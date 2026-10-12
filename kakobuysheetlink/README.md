# Kakobuy Spreadsheet

独立目录站，域名 [kakobuysheetlink.com](https://kakobuysheetlink.com)。

参考了常见 spreadsheet 站点的信息架构（分类、QC、链接转换、Kakobuy 下单），但配色、版式和文案都是原创，不是原站拷贝。

## 本地预览

```bash
cd /Users/cusky/Desktop/kakobuy网站/kakobuysheetlink
python3 -m http.server 5173
```

打开 http://localhost:5173

## 上线 kakobuysheetlink.com

仓库：[qjy0126/kakobuysheetlink](https://github.com/qjy0126/kakobuysheetlink)。

- GitHub Pages：Settings → Pages，Source 选 `main` / `/ (root)`。`CNAME` 已写成 `kakobuysheetlink.com`。
- Cloudflare（Wrangler）：`.assetsignore` 已排除 `img/products`（体积太大）。线上商品图走 jsDelivr（GitHub `main`），本地仍读本地文件。

域名 DNS（GitHub Pages）：

- 根域名 `kakobuysheetlink.com` 用 A 记录指向：
  - `185.199.108.153`
  - `185.199.109.153`
  - `185.199.110.153`
  - `185.199.111.153`
- `www.kakobuysheetlink.com` 用 CNAME 指向 `qjy0126.github.io`

生效后访问 https://kakobuysheetlink.com
