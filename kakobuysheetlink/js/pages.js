(function () {
  const params = new URLSearchParams(location.search);
  const $ = (sel) => document.querySelector(sel);

  function fill(id, html) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  }

  function renderHome() {
    const label = (c) => (KF.catLabel && KF.catLabel(c.slug)) || c.label;
    const tt = (k) => (KF.t && KF.t(k)) || k;
    const pills = (KF.categories || []).map((c) =>
      `<a class="pill" href="${KF.catPath(c.slug)}">${label(c)}</a>`
    ).join("") + `<a class="pill" href="${KF.findsPath()}">${tt("all_finds")}</a>`;
    fill("pill-row", pills);
    fill("latest-pills", pills);
    fill("cat-grid", KF.categories.map((c) => `
      <a class="cat-tile" href="${KF.catPath(c.slug)}">
        <img src="${KF.asset(c.image)}" alt="${label(c)}" loading="lazy" decoding="async" />
        <h3>${label(c)}</h3>
        <span>${tt("browse_sheet_links")}</span>
      </a>
    `).join(""));
    const latest = KF.products.filter((p) => p.popular || p.featured).slice(0, 24);
    const fallback = latest.length ? latest : KF.products.slice(0, 24);
    fill("latest-grid", fallback.map(KF.ui.productCard).join(""));
    fill("faq-list", (KF.faqs || []).map((f) => `
      <article class="faq-item"><h3>${f.q}</h3><p>${f.a.replace(/kakobuyqcsheets\.com/g, "kakobuysheetlink.com")}</p></article>
    `).join(""));
    const sheet = $("#home-sheet-link");
    if (sheet) sheet.href = KF.site.sheetUrl;
  }

  function pagerHtml(page, pages, cat, q, sort, qc) {
    if (pages <= 1) return "";
    function href(n) {
      const next = new URL(location.pathname.replace(/index\.html$/i, "") || "/", location.href);
      if (q) next.searchParams.set("q", params.get("q"));
      if (sort && sort !== "latest") next.searchParams.set("sort", sort);
      if (qc === "1") next.searchParams.set("qc", "1");
      if (n > 1) next.searchParams.set("page", String(n));
      return next.pathname + next.search;
    }
    const nums = [];
    const from = Math.max(1, page - 2);
    const to = Math.min(pages, page + 2);
    if (page > 1) nums.push(`<a href="${href(page - 1)}">Prev</a>`);
    if (from > 1) nums.push(`<a href="${href(1)}">1</a>`);
    if (from > 2) nums.push("<span>…</span>");
    for (let n = from; n <= to; n++) {
      nums.push(n === page ? `<span class="is-on">${n}</span>` : `<a href="${href(n)}">${n}</a>`);
    }
    if (to < pages - 1) nums.push("<span>…</span>");
    if (to < pages) nums.push(`<a href="${href(pages)}">${pages}</a>`);
    if (page < pages) nums.push(`<a href="${href(page + 1)}">Next</a>`);
    return nums.join("");
  }

  function renderShop() {
    const cat = document.body.dataset.cat || params.get("cat") || "";
    const brandSlug = document.body.dataset.brand || params.get("brand") || "";
    const q = (params.get("q") || "").toLowerCase();
    const qcOnly = params.get("qc") === "1";
    const sort = params.get("sort") || "latest";
    const pageSize = 48;
    const page = Math.max(1, parseInt(params.get("page") || "1", 10) || 1);
    let list = KF.products.slice();
    if (cat) list = list.filter((p) => KF.inCategory(p, cat));
    if (brandSlug) list = list.filter((p) => KF.brandSlug(p.collection) === brandSlug);
    if (q) list = list.filter((p) => `${p.title} ${p.collection} ${KF.productCats(p).join(" ")}`.toLowerCase().includes(q));
    if (qcOnly) list = list.filter((p) => p.qc);
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sort === "rating" || sort === "popular") list.sort((a, b) => b.rating - a.rating);
    const brandName = brandSlug
      ? (list[0] && list[0].collection) || brandSlug
      : "";
    const title = (
      KF.categories.find((c) => c.slug === cat) ||
      KF.nav.apparel.find((c) => c.slug === cat) ||
      KF.nav.lifestyle.find((c) => c.slug === cat) ||
      {}
    ).label || brandName || (q ? `Search: ${params.get("q")}` : "Shop all");
    if (!document.querySelector(".catalog-intro h1")) {
      document.title = `${title} — Kakobuy Sheet Link`;
    }
    const band = document.getElementById("cat-band-title");
    if (band) band.textContent = title;
    const pillsEl = document.getElementById("shop-pills");
    if (pillsEl) {
      const all = [...KF.nav.apparel, ...KF.nav.lifestyle];
      pillsEl.innerHTML = `<a class="pill${!cat ? " is-on" : ""}" href="${KF.findsPath()}">All</a>` +
        all.map((c) => `<a class="pill${c.slug === cat ? " is-on" : ""}" href="${KF.catPath(c.slug)}">${c.label}</a>`).join("");
    }
    const total = list.length;
    const pages = Math.max(1, Math.ceil(total / pageSize));
    const safePage = Math.min(page, pages);
    const start = (safePage - 1) * pageSize;
    const slice = list.slice(start, start + pageSize);
    const from = total ? start + 1 : 0;
    const to = start + slice.length;
    fill("shop-count", total ? `Showing ${from}–${to} of ${total} results` : "No products found");
    fill("product-grid", slice.map(KF.ui.productCard).join("") || "<p>No finds in this filter.</p>");
    fill("pager", pagerHtml(safePage, pages, cat, q, sort, params.get("qc")));
    function apply() {
      const next = new URL(location.pathname.replace(/index\.html$/i, "") || "/", location.href);
      const s = $("#sort").value;
      if (s !== "latest") next.searchParams.set("sort", s);
      if (q) next.searchParams.set("q", params.get("q"));
      if (qcOnly) next.searchParams.set("qc", "1");
      KF.track("filter", { filter_type: "sort", filter_value: s || "latest" });
      location.href = next.pathname + next.search;
    }
    const sortBox = $("#sort");
    if (sortBox) {
      sortBox.value = sort === "latest" ? "latest" : sort;
      sortBox.addEventListener("change", apply);
    }
  }

  function catLabel(slug) {
    if (KF.catLabel) return KF.catLabel(slug);
    return (
      KF.categories.find((c) => c.slug === slug) ||
      KF.nav.apparel.find((c) => c.slug === slug) ||
      KF.nav.lifestyle.find((c) => c.slug === slug) ||
      { label: slug }
    ).label;
  }

  function tt(key) {
    return (KF.t && KF.t(key)) || key;
  }

  function itemIdFrom(item) {
    const fromId = String(item.id || "").replace(/^p-/, "");
    if (/^\d+$/.test(fromId)) return fromId;
    const m = String(item.sourceUrl || "").match(/itemID=(\d+)/i);
    return m ? m[1] : "";
  }

  function photoExists(src) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = src;
    });
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (ch) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[ch]));
  }

  function itemViews(item) {
    let h = 0;
    const key = String(item.id || item.title || "");
    for (let i = 0; i < key.length; i++) h = (h * 33 + key.charCodeAt(i)) >>> 0;
    return (1800 + (h % 8200)).toLocaleString("en-US");
  }

  function qualityScore(item) {
    const r = Math.min(5, Math.max(3.8, Number(item.rating) || 4.6));
    return (r * 1.9).toFixed(1);
  }

  function renderItem() {
    const wanted = document.body.dataset.itemId || params.get("id");
    const item = KF.products.find((p) => p.id === wanted);
    if (!item) {
      location.replace(KF.findsPath());
      return;
    }
    const related = KF.products.filter((p) => p.category === item.category);
    const idx = Math.max(0, related.findIndex((p) => p.id === item.id));
    const prev = related[(idx - 1 + related.length) % related.length];
    const next = related[(idx + 1) % related.length];
    const local = KF.asset(item.image || ((item.gallery && item.gallery[0]) || ""));
    const gallery = [local];
    let photo = 0;
    const buy = KF.kakobuyUrl(item.sourceUrl);
    const cat = catLabel(item.category);
    const brand = item.collection || "Find";
    const source = String(item.source || "Weidian").toUpperCase();
    const hot = !!(item.featured || item.popular || (item.tags || []).some((t) => /top trending|hot/i.test(t)));

    document.title = `${item.title} — Kakobuy Spreadsheet`;

    const page = document.querySelector("main.item-page") || $("main");
    page.className = "wrap item-page";
    page.innerHTML = `
      <div class="item-bar">
        <nav class="crumbs" id="crumbs">
          <a href="${KF.findsPath()}">${tt("spreadsheet")}</a><span>/</span>
          <a href="${KF.catPath(item.category)}">${escapeHtml(cat)}</a><span>/</span>
          <span>${escapeHtml(brand)}</span>
        </nav>
        <div class="item-switch" id="item-switch">
          ${related.length > 1 ? `<a href="${KF.itemPath(prev)}">‹ Previous</a><a href="${KF.itemPath(next)}">Next ›</a>` : ""}
        </div>
      </div>
      <div class="item-layout">
        <div class="gallery">
          <div class="main-stage">
            <button type="button" class="gal-arrow gal-prev is-hidden" id="gal-prev" aria-label="Previous photo">‹</button>
            <div class="main" id="item-stage">
              <img id="item-main" src="${local}" alt="${escapeHtml(item.title)}" />
            </div>
            <button type="button" class="gal-arrow gal-next is-hidden" id="gal-next" aria-label="Next photo">›</button>
            <span class="gal-count" id="gal-count">1/1</span>
          </div>
          <div class="thumbs" id="thumbs"></div>
        </div>
        <aside class="item-info">
          <div class="item-tags">
            <span class="tag tag-src">${escapeHtml(source)}</span>
            <span class="tag tag-cat">${escapeHtml(cat)}</span>
            ${item.qc ? '<span class="tag tag-qc">QC</span>' : ""}
            ${hot ? '<span class="tag tag-hot">HOT</span>' : ""}
          </div>
          <h1 id="item-title">${escapeHtml(item.title)}</h1>
          <p class="item-sub">${escapeHtml(brand)} · ${escapeHtml(cat)}</p>
          <div class="item-stats" id="item-rating">
            <span class="stat-quality"><b>${qualityScore(item)}</b>/10 ${tt("quality")}</span>
            <span class="stat-stars">${KF.ui.stars(item.rating)} <em>${Number(item.rating || 0).toFixed(1)}</em></span>
            <span class="stat-views">${itemViews(item)} ${tt("views")}</span>
          </div>
          <div class="item-price-row">
            <div class="price" id="item-price" data-price="${item.price}">${KF.money(item.price)}</div>
            <a class="btn-ext" href="${buy}" target="_blank" rel="noopener" aria-label="${tt("open_kakobuy")}" title="${tt("open_kakobuy")}">↗</a>
          </div>
          <a class="btn btn-buy" id="buy-link" href="${buy}" target="_blank" rel="noopener">
            <img class="buy-k" src="${KF.asset("img/k.svg")}" alt="" width="18" height="22" />
            <span>${tt("buy_kakobuy")}</span>
            <span class="buy-arrow">↑</span>
          </a>
          <div class="item-seller">
            <span class="seller-mark"><img src="${KF.asset("img/k.svg")}" alt="" width="14" height="18" /></span>
            <span class="seller-name">kakobuyspreadsheet</span>
            <span class="seller-badge">${tt("trusted")}</span>
          </div>
        </aside>
      </div>
    `;

    KF.track("view_item", {
      item_id: String(item.id),
      item_name: KF.itemName(item),
      currency: "USD",
      value: Number(item.price) || 0,
      items: KF.gaItem(item),
    });

    fill("related-grid", related.filter((p) => p.id !== item.id).slice(0, 6).map(KF.ui.productCard).join(""));

    const stage = $("#item-stage");
    const layer = $("#zoom-layer");
    const zoomImg = $("#zoom-img");

    function resetZoom() {
      stage.classList.remove("is-zoom");
      $("#item-main").style.transformOrigin = "center";
    }

    function renderThumbs() {
      const count = $("#gal-count");
      if (count) count.textContent = `${photo + 1}/${gallery.length}`;
      fill("thumbs", gallery.map((src, i) => `
        <button type="button" data-i="${i}" class="${i === photo ? "is-on" : ""}" aria-label="Photo ${i + 1}">
          <img src="${src}" alt="">
        </button>
      `).join(""));
      const hideArrows = gallery.length < 2;
      $("#gal-prev").classList.toggle("is-hidden", hideArrows);
      $("#gal-next").classList.toggle("is-hidden", hideArrows);
      if (count) count.classList.toggle("is-hidden", gallery.length < 2);
    }

    function show(i) {
      photo = (i + gallery.length) % gallery.length;
      $("#item-main").src = gallery[photo];
      resetZoom();
      renderThumbs();
    }

    function openLayer() {
      if (!layer || !zoomImg) return;
      zoomImg.src = gallery[photo];
      zoomImg.alt = item.title;
      layer.classList.add("show");
      layer.classList.remove("is-deep");
    }

    function closeLayer() {
      if (!layer) return;
      layer.classList.remove("show", "is-deep");
    }

    $("#item-main").addEventListener("error", () => {
      if ($("#item-main").getAttribute("src") !== local) {
        $("#item-main").src = local;
        resetZoom();
      }
    });
    renderThumbs();
    $("#gal-prev").addEventListener("click", () => show(photo - 1));
    $("#gal-next").addEventListener("click", () => show(photo + 1));
    $("#thumbs").addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (btn) show(Number(btn.dataset.i));
    });
    stage.addEventListener("click", () => stage.classList.toggle("is-zoom"));
    stage.addEventListener("mousemove", (e) => {
      if (!stage.classList.contains("is-zoom")) return;
      const box = stage.getBoundingClientRect();
      const x = ((e.clientX - box.left) / box.width) * 100;
      const y = ((e.clientY - box.top) / box.height) * 100;
      $("#item-main").style.transformOrigin = `${x}% ${y}%`;
    });
    if ($("#zoom-close")) {
      $("#zoom-close").addEventListener("click", (e) => {
        e.stopPropagation();
        closeLayer();
      });
    }
    if (layer) {
      layer.addEventListener("click", (e) => {
        if (e.target === zoomImg) layer.classList.toggle("is-deep");
        else closeLayer();
      });
    }
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeLayer();
    });

    const id = itemIdFrom(item);
    if (id) {
      Promise.all([2, 3].map((n) => {
        const src = KF.asset(`img/products/${id}-${n}.webp`);
        return photoExists(src).then((ok) => (ok ? src : ""));
      })).then((found) => {
        found.filter(Boolean).forEach((src) => gallery.push(src));
        if (found.some(Boolean)) renderThumbs();
      });
    }
  }

  function authorOf(post) {
    const slug = post.author || "kakospreadsheet";
    return KF.authors[slug] || { slug, name: slug };
  }

  function postCard(p) {
    const author = authorOf(p);
    return `
      <article class="card post-card">
        <a href="/guide.html?slug=${p.slug}">
          <small>${p.date}</small>
          <h3>${p.title}</h3>
          <p>${p.excerpt}</p>
        </a>
        <a class="post-by" href="/author.html?id=${author.slug}">by: ${author.name}</a>
      </article>
    `;
  }

  function renderGuides() {
    fill("post-grid", KF.posts.map(postCard).join(""));
  }

  function renderGuide() {
    const post = KF.posts.find((p) => p.slug === params.get("slug")) || KF.posts[0];
    const author = authorOf(post);
    $("#guide-title").textContent = post.title;
    $("#guide-date").textContent = post.date;
    const by = $("#guide-by");
    if (by) by.innerHTML = `<a href="/author.html?id=${author.slug}">by: ${author.name}</a>`;
    fill("guide-body", post.body.map((p) => `<p>${p}</p>`).join(""));
    document.title = `${post.title} — Kakobuy Sheet Link`;
  }

  function renderAuthor() {
    const slug = params.get("id") || "kakospreadsheet";
    const author = KF.authors[slug] || KF.authors.kakospreadsheet;
    const posts = KF.posts.filter((p) => (p.author || "kakospreadsheet") === author.slug);
    document.title = `${author.name} — Kakobuy Sheet Link`;
    $("#author-name").textContent = author.name;
    $("#author-bio").textContent = author.bio || author.byline || "";
    fill("post-grid", posts.map(postCard).join("") || "<p>No guides yet.</p>");
  }

  function knownCats() {
    return new Set([
      ...KF.categories.map((c) => c.slug),
      ...KF.nav.apparel.map((c) => c.slug),
      ...KF.nav.lifestyle.map((c) => c.slug),
    ]);
  }

  function redirectLegacy() {
    const path = location.pathname;
    const cats = knownCats();
    if (/\/item\.html$/i.test(path)) {
      const id = params.get("id");
      const item = id && KF.products.find((p) => p.id === id);
      location.replace(item ? KF.itemPath(item) : KF.findsPath());
      return true;
    }
    if (/\/shop\.html$/i.test(path)) {
      const cat = params.get("cat");
      const next = new URLSearchParams(params);
      next.delete("cat");
      const dest = cat && cats.has(cat) ? KF.catPath(cat) : KF.findsPath();
      const qs = next.toString();
      location.replace(dest + (qs ? "?" + qs : ""));
      return true;
    }
    if ((path === "/finds/" || path === "/finds") && params.get("cat")) {
      const cat = params.get("cat");
      if (!cats.has(cat)) return false;
      const next = new URLSearchParams(params);
      next.delete("cat");
      const qs = next.toString();
      location.replace(KF.catPath(cat) + (qs ? "?" + qs : ""));
      return true;
    }
    return false;
  }

  function renderBrands() {
    const skip = /^(find)?$/i;
    const counts = {};
    KF.products.forEach((p) => {
      const name = String(p.collection || "").trim();
      if (!name || skip.test(name)) return;
      counts[name] = (counts[name] || 0) + 1;
    });
    const rows = Object.entries(counts)
      .filter(([, n]) => n >= 5)
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
    fill("brand-grid", rows.map(([name, n]) => `
      <a class="cat-card" href="${KF.brandPath(name)}">
        <span class="cat-name">${name}</span>
        <small>${n} finds</small>
      </a>
    `).join(""));
  }

  if (redirectLegacy()) return;
  const page = document.body.dataset.page;
  KF.ui.bindChrome();
  if (page === "home") renderHome();
  if (page === "shop") renderShop();
  if (page === "item") renderItem();
  if (page === "guides") renderGuides();
  if (page === "guide") renderGuide();
  if (page === "author") renderAuthor();
  if (page === "brands") renderBrands();
})();
