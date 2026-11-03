#!/usr/bin/env python3
"""Regenerate a single sitemap.xml for oopbuyspreadsheeets.com from catalog.js."""
from pathlib import Path
import re
from datetime import date
from xml.sax.saxutils import escape

ROOT = Path(__file__).resolve().parents[1]
BASE = "https://oopbuyspreadsheeets.com"
TODAY = date.today().isoformat()


def url_entry(loc, priority="0.5", changefreq="weekly"):
    return (
        f"  <url>\n"
        f"    <loc>{escape(loc)}</loc>\n"
        f"    <lastmod>{TODAY}</lastmod>\n"
        f"    <changefreq>{changefreq}</changefreq>\n"
        f"    <priority>{priority}</priority>\n"
        f"  </url>"
    )


def main():
    catalog = (ROOT / "kakobuysheetlink/js/catalog.js").read_text()
    ids = list(dict.fromkeys(re.findall(r'"id":\s*"(p-[^"]+)"', catalog)))
    data = (ROOT / "kakobuysheetlink/js/data.js").read_text()
    m = re.search(r"KF\.categories\s*=\s*\[(.*?)\];", data, re.S)
    cat_slugs = re.findall(r'slug:\s*"([^"]+)"', m.group(1)) if m else []

    urls = [
        (f"{BASE}/", "1.0", "daily"),
        (f"{BASE}/spreadsheet.html", "0.9", "daily"),
        (f"{BASE}/dead-links.html", "0.4", "monthly"),
    ]
    for slug in cat_slugs:
        urls.append((f"{BASE}/spreadsheet.html?cat={slug}", "0.8", "daily"))
    for pid in ids:
        urls.append((f"{BASE}/product.html?id={pid}", "0.6", "weekly"))

    body = "\n".join(url_entry(u, p, f) for u, p, f in urls)
    xml = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        f"{body}\n"
        "</urlset>\n"
    )
    (ROOT / "sitemap.xml").write_text(xml)

    pages = [u for u in urls if "product.html" not in u[0]]
    (ROOT / "sitemap-pages.xml").write_text(
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + "\n".join(url_entry(u, p, f) for u, p, f in pages)
        + "\n</urlset>\n"
    )

    (ROOT / "sitemap-index.xml").write_text(
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        f'  <sitemap><loc>{BASE}/sitemap.xml</loc><lastmod>{TODAY}</lastmod></sitemap>\n'
        "</sitemapindex>\n"
    )

    (ROOT / "robots.txt").write_text(
        f"""User-agent: *
Allow: /

User-agent: GPTBot
Allow: /

User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

Sitemap: {BASE}/sitemap.xml
"""
    )
    print(f"Wrote sitemap.xml with {len(urls)} URLs ({len(ids)} products)")


if __name__ == "__main__":
    main()
