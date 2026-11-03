# OopBuySpreadsheets

Static site for **oopbuyspreadsheets.me** — inspired by [oopbuyspreads.com](https://oopbuyspreads.com/) with a stronger brand-first layout.

## Pages

- `index.html` — home, countdown, giveaways, FAQ
- `spreadsheet.html` — category bar, search, product grid, pagination
- `product.html` — product detail
- `dead-links.html` — broken link reports
- `sitemap-index.xml` / `robots.txt` — SEO sitemap (regenerate with `python3 scripts/build_sitemap.py`)

## Local preview

Needs a local static server (ES modules). With Python 3:

```bash
python3 -m http.server 5173
```

Then open `http://localhost:5173`.

## Product data

Real catalog comes from `kakobuysheetlink/`:

- `kakobuysheetlink/js/data.js` — categories, invite codes, OopBuy link builder
- `kakobuysheetlink/js/catalog.js` — ~4,800 products
- Images: jsDelivr CDN (`cdn.jsdelivr.net/gh/qjy0126/kakobuysheetlink@main/`)
- Buy links open OopBuy with invite code `1W4CISK9G`

## Customize

- Accent color: `--pink` in `styles.css` (`#e91e63`)
- Giveaway end date: `data-target` on the countdown element in `index.html`
- Invite code: `OOPBUY_INVITE` in `products.js` / `KF.invite.oopbuy` in `data.js`
