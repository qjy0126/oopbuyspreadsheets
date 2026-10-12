#!/usr/bin/env python3
"""Import 2026-10-10 + 2026-10-12 xlsx into catalog.js (prepend new finds)."""
from __future__ import annotations

import json
import re
import time
from collections import Counter
from concurrent.futures import ThreadPoolExecutor, as_completed
from io import BytesIO
from pathlib import Path
from urllib.parse import quote
from urllib.request import Request, urlopen

import openpyxl
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT.parent
XLSXS = [
    SITE / "2026-10-10商品.xlsx",
    SITE / "2026-10-12商品.xlsx",
]
THUMB_DIRS = [
    Path("/Users/cusky/Desktop/商品表单/2026-10-10主图"),
    Path("/Users/cusky/Desktop/商品表单/2026-10-12主图"),
]
OUT = ROOT / "img" / "products"
JS = ROOT / "js" / "catalog.js"
CACHE = ROOT / "scripts" / "pic_urls.json"
WORKERS = 6
UA = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
    "Accept": "*/*",
    "Accept-Language": "en-US,en;q=0.9",
    "Referer": "https://weidian.com/",
}

TAG_CAT = {
    "shoes": "shoes",
    "slides": "shoes",
    "sneakers": "shoes",
    "shorts": "pants",
    "pants": "pants",
    "jeans": "pants",
    "t-shirt": "t-shirts",
    "tshirt": "t-shirts",
    "tee": "t-shirts",
    "polo": "t-shirts",
    "hoodies": "hoodies",
    "hoodie": "hoodies",
    "sweater": "hoodies",
    "jacket": "jackets",
    "vest": "jackets",
    "coat": "jackets",
    "cap": "headwear",
    "hat": "headwear",
    "beanie": "headwear",
    "suit": "sets",
    "set": "sets",
    "tracksuit": "sets",
    "jersey": "jersey",
    "sunglasses": "glasses",
    "glasses": "glasses",
    "bag": "accessories",
    "belt": "accessories",
    "wallet": "accessories",
    "accessories": "accessories",
    "watch": "watches",
    "electronics": "other",
    "apple": "other",
    "airpods": "other",
    "dress": "other",
    "underwear": "underwear",
}

CAT_SKIP_BRAND = set(TAG_CAT) | {
    "top trending",
    "trending",
    "new",
    "hot",
    "new arrivals",
}


def guess_cat(tags: list[str], title: str) -> str:
    t = (title or "").lower()
    tag_l = [x.lower().strip() for x in tags]

    if re.search(r"\b(lego|bricks?)\b", t):
        return "bricks"
    if re.search(r"\b(sunglasses?|eyewear)\b", t) or "sunglasses" in tag_l:
        return "glasses"
    if re.search(r"\b(watch(?:es)?|rolex)\b", t) or "watch" in tag_l:
        return "watches"
    if re.search(r"\b(perfume|cologne)\b", t):
        return "perfume"
    if any(k in t for k in ("shoe", "sneaker", "slide", "slipper", "jordan")) or "shoes" in tag_l or "slides" in tag_l:
        return "shoes"
    if any(k in t for k in ("jersey", "football")) or "jersey" in tag_l:
        return "jersey"
    if any(k in t for k in ("hoodie", "sweater")) or "hoodies" in tag_l:
        return "hoodies"
    if any(k in t for k in ("cap", "hat", "beanie")) or "cap" in tag_l:
        return "headwear"
    if "suit" in tag_l or "set" in tag_l or re.search(r"\b(tracksuit|suit|set)\b", t):
        return "sets"
    if any(k in t for k in ("jacket", "coat", "vest", "bomber")) or "jacket" in tag_l or "vest" in tag_l:
        return "jackets"
    if any(k in t for k in ("short", "pant", "jean")) or any(x in tag_l for x in ("shorts", "pants", "jeans")):
        return "pants"
    if any(k in t for k in ("tee", "t-shirt", "shirt", "polo")) or any(x in tag_l for x in ("t-shirt", "polo")):
        return "t-shirts"
    if any(x in tag_l for x in ("bag", "belt", "wallet", "accessories")) or any(
        k in t for k in ("bag", "wallet", "belt")
    ):
        return "accessories"
    if any(x in tag_l for x in ("electronics", "apple", "airpods")):
        return "other"
    for tag in tag_l:
        if tag in TAG_CAT:
            return TAG_CAT[tag]
    return "other"


def brand_from(tags: list[str], title: str) -> str:
    for tag in tags:
        if tag.lower().strip() not in CAT_SKIP_BRAND:
            return tag.strip()
    parts = re.split(r"\s+", (title or "").strip())
    return parts[0] if parts else "Find"


def index_local_thumbs() -> dict[str, Path]:
    mapping: dict[str, Path] = {}
    for folder in THUMB_DIRS:
        if not folder.is_dir():
            continue
        for path in folder.iterdir():
            if not path.is_file():
                continue
            m = re.search(r"(\d{8,})", path.stem)
            if m:
                mapping[m.group(1)] = path
    return mapping


def load_xlsx(path: Path, date_tag: str):
    wb = openpyxl.load_workbook(path, read_only=True, data_only=True)
    ws = wb.active
    rows = list(ws.iter_rows(values_only=True))
    items = []
    seen = set()
    for r in rows[1:]:
        if not r or not r[1]:
            continue
        title = str(r[0] or "Find").strip()
        url = str(r[1]).strip()
        tags = [t.strip() for t in str(r[2] or "").replace("\n", ",").split(",") if t.strip()]
        m = re.search(r"itemID=(\d+)", url, re.I)
        if not m:
            continue
        iid = m.group(1)
        if iid in seen:
            continue
        seen.add(iid)
        items.append(
            {
                "itemId": iid,
                "title": title[:80],
                "url": f"https://weidian.com/item.html?itemID={iid}",
                "tags": tags,
                "category": guess_cat(tags, title),
                "brand": brand_from(tags, title),
                "date": date_tag,
            }
        )
    wb.close()
    return items


def load_existing():
    raw = JS.read_text(encoding="utf-8")
    start = raw.index("KF.products = ") + len("KF.products = ")
    products, _ = json.JSONDecoder().raw_decode(raw[start:])
    return products


def load_cache():
    if CACHE.exists():
        return json.loads(CACHE.read_text(encoding="utf-8"))
    return {}


def save_cache(cache):
    CACHE.write_text(json.dumps(cache, ensure_ascii=False), encoding="utf-8")


def save_webp_from_path(src: Path, dest: Path, max_side=560, quality=72):
    im = Image.open(src)
    im.load()
    if im.mode not in ("RGB", "L"):
        im = im.convert("RGB")
    elif im.mode == "L":
        im = im.convert("RGB")
    if max(im.size) > max_side:
        im.thumbnail((max_side, max_side), Image.Resampling.LANCZOS)
    buf = BytesIO()
    im.save(buf, format="WEBP", quality=quality, method=4)
    dest.write_bytes(buf.getvalue())


def save_webp_blob(blob: bytes, dest: Path, max_side=560, quality=72):
    im = Image.open(BytesIO(blob))
    im.load()
    if im.mode not in ("RGB", "L"):
        im = im.convert("RGB")
    elif im.mode == "L":
        im = im.convert("RGB")
    if max(im.size) > max_side:
        im.thumbnail((max_side, max_side), Image.Resampling.LANCZOS)
    buf = BytesIO()
    im.save(buf, format="WEBP", quality=quality, method=4)
    dest.write_bytes(buf.getvalue())


def fetch_price(item_id: str):
    param = quote(json.dumps({"itemId": str(item_id)}, separators=(",", ":")))
    api = f"https://thor.weidian.com/detail/getItemSkuInfo/1.0?param={param}"
    for attempt in range(3):
        try:
            req = Request(api, headers=UA)
            with urlopen(req, timeout=18) as r:
                data = json.loads(r.read().decode("utf-8", "replace"))
            res = data.get("result") or {}
            fen = res.get("itemDiscountLowPrice") or res.get("itemOriginalLowPrice")
            price_cny = float(fen) / 100.0 if fen is not None else None
            pic = (res.get("itemMainPic") or "").split("?")[0]
            return price_cny, pic
        except Exception:
            time.sleep(0.45 * (attempt + 1))
    return None, ""


def usd(cny):
    return round(float(cny) / 7.2, 2) if cny else 0


def write_catalog(products):
    JS.write_text(
        "KF.products = "
        + json.dumps(products, ensure_ascii=False, indent=2)
        + """;

(function () {
  const cover = {};
  const prefer = { other: "img/products/7770013729.webp" };
  KF.products.forEach(function (p) {
    if (!cover[p.category]) cover[p.category] = p.image;
  });
  KF.categories.forEach(function (c) {
    if (prefer[c.slug]) c.image = prefer[c.slug];
    else if (cover[c.slug]) c.image = cover[c.slug];
  });
  KF.allProductImage = "img/products/7784475023.webp";
  if (KF.applyExtraCategories) KF.applyExtraCategories();
})();
""",
        encoding="utf-8",
    )


def to_product(it, image, price_cny):
    return {
        "id": f"p-{it['itemId']}",
        "title": it["title"],
        "price": usd(price_cny) if price_cny else 0,
        "rating": 4.7,
        "category": it["category"],
        "collection": it["brand"] or "Find",
        "qc": True,
        "featured": True,
        "popular": True,
        "seller": "wen",
        "source": "Weidian",
        "sourceUrl": it["url"],
        "image": image,
        "gallery": [image],
        "sizes": ["40", "41", "42", "43", "44"] if it["category"] == "shoes" else ["S", "M", "L", "XL"],
        "summary": f"{it['brand']} · {it['date']}".strip(" ·"),
        "tags": it["tags"],
    }


def ensure_image(item_id: str, local_map: dict[str, Path], cache: dict, remote_pic: str):
    dest = OUT / f"{item_id}.webp"
    if dest.exists() and dest.stat().st_size > 800:
        return "have", f"img/products/{item_id}.webp"

    local = local_map.get(item_id)
    if local and local.exists():
        save_webp_from_path(local, dest)
        return "local", f"img/products/{item_id}.webp"

    pic = cache.get(item_id) or remote_pic or ""
    if not pic:
        return "fail", ""

    pic = pic.replace(".jpg.webp", ".jpg")
    try:
        req = Request(pic + "?w=560&h=560&cp=1", headers=UA)
        with urlopen(req, timeout=18) as r:
            blob = r.read()
        if len(blob) >= 800:
            save_webp_blob(blob, dest)
            cache[item_id] = pic.split("?")[0]
            return "ok", f"img/products/{item_id}.webp"
    except Exception:
        pass
    if pic.startswith("http"):
        cache[item_id] = pic.split("?")[0]
        return "remote", pic + "?w=560&h=560&cp=1"
    return "fail", ""


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    local_map = index_local_thumbs()
    print(f"local thumbs {len(local_map)}", flush=True)

    new_items = []
    seen = set()
    for path in XLSXS:
        date_tag = "2026-10-10" if "10-10" in path.name else "2026-10-12"
        batch = load_xlsx(path, date_tag)
        print(f"{path.name}: {len(batch)}", flush=True)
        for it in batch:
            if it["itemId"] in seen:
                continue
            seen.add(it["itemId"])
            new_items.append(it)

    existing = load_existing()
    existing_ids = {str(p.get("id") or "") for p in existing}
    todo = [it for it in new_items if f"p-{it['itemId']}" not in existing_ids]
    print(f"unique {len(new_items)} todo {len(todo)} existing {len(existing)}", flush=True)
    print("cats", dict(Counter(it["category"] for it in todo)), flush=True)

    cache = load_cache()
    meta = {}

    def work(it):
        price, pic = fetch_price(it["itemId"])
        st, src = ensure_image(it["itemId"], local_map, cache, pic)
        return it["itemId"], st, src, price

    ok = fail = remote = have = local = 0
    with ThreadPoolExecutor(max_workers=WORKERS) as ex:
        futs = {ex.submit(work, it): it for it in todo}
        for i, fut in enumerate(as_completed(futs), 1):
            iid, st, src, price = fut.result()
            print(f"{i}/{len(todo)} {iid} {st} ¥{price}", flush=True)
            if src:
                meta[iid] = (src, price, st)
                if st == "have":
                    have += 1
                elif st == "local":
                    local += 1
                elif st == "remote":
                    remote += 1
                else:
                    ok += 1
            else:
                fail += 1
            if i % 40 == 0:
                save_cache({k: v for k, v in cache.items() if v})

    save_cache({k: v for k, v in cache.items() if v})

    added = []
    for it in todo:
        row = meta.get(it["itemId"])
        if not row or not row[0]:
            continue
        added.append(to_product(it, row[0], row[1]))

    for p in existing:
        if p.get("featured") or p.get("popular"):
            p["featured"] = False
            p["popular"] = False

    merged = added + existing
    write_catalog(merged)
    print(
        f"done local={local} ok={ok} have={have} remote={remote} fail={fail} "
        f"added={len(added)} total={len(merged)}",
        flush=True,
    )
    print("added cats", dict(Counter(p["category"] for p in added)), flush=True)


if __name__ == "__main__":
    main()
