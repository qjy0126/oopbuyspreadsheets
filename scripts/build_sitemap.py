#!/usr/bin/env python3
"""Regenerate sitemap XML for oopbuyspreadsheeets.me from catalog.js."""
from pathlib import Path
import re
from datetime import date
from xml.sax.saxutils import escape

ROOT = Path(__file__).resolve().parents[1]
BASE = "https://oopbuyspreadsheeets.me"
TODAY = date.today().isoformat()
CHUNK = 500

def url_entry(loc, priority=None, changefreq="weekly"):
    parts = [
        "  <url>",
        f"    <loc>{escape(loc)}</loc>",
        f"    <lastmod>{TODAY}</lastmod>",
        f"    <changefreq>{changefreq}</changefreq>",
    ]
    if priority is not None:
        parts.append(f"    <priority>{priority}</priority>")
    parts.append("  </url>")
    return "\n".join(parts)

def main():
    catalog = (ROOT / "kakobuysheetlink/js/catalog.js").read_text()
    ids = list(dict.fromkeys(re.findall(r'"id":\s*"(p-[^"]+)"', catalog)))
    data = (ROOT / "kakobuysheetlink/js/data.js").read_text()
    m = re.search(r"KF\.categories\s*=\s*\[(.*?)\];", data, re.S)
    cat_slugs = re.findall(r'slug:\s*"([^"]+)"', m.group(1)) if m else []

    page_urls = [
        (f"{BASE}/", "1.0", "daily"),
        (f"{BASE}/spreadsheet.html", "0.9", "daily"),
        (f"{BASE}/dead-links.html", "0.4", "monthly"),
    ]
    for slug in cat_slugs:
        page_urls.append((f"{BASE}/spreadsheet.html?cat={slug}", "0.8", "daily"))

    pages = ['<?xml version="1.0" encoding="UTF-8"?>',
             '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for loc, pri, freq in page_urls:
        pages.append(url_entry(loc, pri, freq))
    pages.append("</urlset>")
    (ROOT / "sitemap-pages.xml").write_text("\n".join(pages) + "\n")

    sitemap_dir = ROOT / "sitemaps"
    sitemap_dir.mkdir(exist_ok=True)
    for old in sitemap_dir.glob("*.xml"):
        old.unlink()

    chunk_files = []
    for i in range(0, len(ids), CHUNK):
        chunk = ids[i : i + CHUNK]
        name = f"{len(chunk_files) + 1:02d}.xml"
        lines = ['<?xml version="1.0" encoding="UTF-8"?>',
                 '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
        for pid in chunk:
            lines.append(url_entry(f"{BASE}/product.html?id={pid}", "0.6", "weekly"))
        lines.append("</urlset>")
        (sitemap_dir / name).write_text("\n".join(lines) + "\n")
        chunk_files.append(name)

    index = ['<?xml version="1.0" encoding="UTF-8"?>',
             '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
             f'  <sitemap><loc>{BASE}/sitemap-pages.xml</loc><lastmod>{TODAY}</lastmod></sitemap>']
    for name in chunk_files:
        index.append(f'  <sitemap><loc>{BASE}/sitemaps/{name}</loc><lastmod>{TODAY}</lastmod></sitemap>')
    index.append("</sitemapindex>")
    text = "\n".join(index) + "\n"
    (ROOT / "sitemap-index.xml").write_text(text)
    (ROOT / "sitemap.xml").write_text(text)

    (ROOT / "robots.txt").write_text(
        f"""User-agent: *
Allow: /

Disallow: /*?q=
Disallow: /*?page=

User-agent: GPTBot
Allow: /

User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

Sitemap: {BASE}/sitemap-index.xml
"""
    )
    print(f"OK products={len(ids)} chunks={len(chunk_files)} cats={len(cat_slugs)}")

if __name__ == "__main__":
    main()
