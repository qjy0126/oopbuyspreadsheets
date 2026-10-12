import {
  HOME_CATEGORY_COVERS,
  OOPBUY_REGISTER,
  buyUrl,
  categoryLabel,
  escapeHtml,
  getCategories,
  getProducts,
  inCategory,
  productDetailUrl,
  productImageAttrs,
} from "./products.js";
import {
  applyI18n,
  catLabel,
  formatMoney,
  initLocaleControls,
  localeSwitcherHtml,
  t,
} from "./i18n.js";

const THEME_KEY = "obs-theme";

function initLocaleSlot() {
  document.querySelectorAll("[data-locale-slot]").forEach((slot) => {
    slot.innerHTML = localeSwitcherHtml();
  });
  initLocaleControls();
}

function initTheme() {
  const stored = localStorage.getItem(THEME_KEY);
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = stored || (prefersDark ? "dark" : "light");
  applyTheme(theme);

  document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
      localStorage.setItem(THEME_KEY, next);
    });
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  document.querySelectorAll("[data-theme-icon]").forEach((el) => {
    el.textContent = theme === "dark" ? "☀️" : "🌙";
  });
  document.querySelectorAll("[data-theme-label]").forEach((el) => {
    el.textContent = theme === "dark" ? t("theme_light") : t("theme_dark");
  });
}

function initYear() {
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });
}

function initRegisterLinks() {
  document.querySelectorAll("[data-oopbuy-register]").forEach((el) => {
    el.setAttribute("href", OOPBUY_REGISTER);
  });
}

function initLiveCounts() {
  const total = getProducts().length;
  if (!total) return;
  const label = total >= 1000 ? `${Math.floor(total / 100) * 100}+` : String(total);
  document.querySelectorAll("[data-product-count]").forEach((el) => {
    el.textContent = label;
  });
}

function initCountdown() {
  const root = document.querySelector("[data-countdown]");
  if (!root) return;

  const target = new Date(root.getAttribute("data-target") || Date.now());
  const daysEl = root.querySelector("[data-days]");
  const hoursEl = root.querySelector("[data-hours]");
  const minutesEl = root.querySelector("[data-minutes]");
  const secondsEl = root.querySelector("[data-seconds]");

  const tick = () => {
    const diff = Math.max(0, target.getTime() - Date.now());
    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    daysEl.textContent = String(days).padStart(2, "0");
    hoursEl.textContent = String(hours).padStart(2, "0");
    minutesEl.textContent = String(minutes).padStart(2, "0");
    secondsEl.textContent = String(seconds).padStart(2, "0");
  };

  tick();
  setInterval(tick, 1000);
}

function initGiveawayForm() {
  const form = document.querySelector("[data-giveaway-form]");
  if (!form) return;
  const note = document.querySelector("[data-giveaway-note]");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const email = String(data.get("email") || "").trim();
    if (!email) return;
    form.reset();
    if (note) note.hidden = false;
  });
}

function initHomeCategories() {
  const grid = document.querySelector("[data-home-categories]");
  if (!grid) return;

  const render = () => {
    const KF = window.KF;
    const cats = KF?.categories?.length
      ? KF.categories
      : [
          { slug: "shoes", label: "Shoes", image: "" },
          { slug: "t-shirts", label: "T-Shirts", image: "" },
          { slug: "hoodies", label: "Hoodies", image: "" },
          { slug: "jackets", label: "Jackets", image: "" },
          { slug: "pants", label: "Pants/Shorts", image: "" },
          { slug: "headwear", label: "Headwear", image: "" },
          { slug: "sets", label: "Sets", image: "" },
          { slug: "underwear", label: "Underpants", image: "" },
          { slug: "jersey", label: "Jersey", image: "" },
          { slug: "accessories", label: "Accessories", image: "" },
          { slug: "other", label: "Other Stuff", image: "" },
        ];

    const allAttrs = productImageAttrs(HOME_CATEGORY_COVERS.all || KF?.allProductImage || "");
    const cards = cats
      .map((cat) => {
        const attrs = productImageAttrs(HOME_CATEGORY_COVERS[cat.slug] || cat.image);
        const label = catLabel(cat.slug) || cat.label;
        return `
          <a class="category-card" href="/spreadsheet.html?cat=${encodeURIComponent(cat.slug)}">
            <div class="category-thumb">
              ${
                attrs.src
                  ? `<img src="${escapeHtml(attrs.src)}" alt="" loading="lazy" width="320" height="320"${attrs.onerror ? ` onerror="${attrs.onerror}"` : ""} />`
                  : ""
              }
            </div>
            <span>${escapeHtml(label)}</span>
          </a>`;
      })
      .join("");

    grid.innerHTML =
      cards +
      `
      <a class="category-card" href="/spreadsheet.html">
        <div class="category-thumb">
          ${
            allAttrs.src
              ? `<img src="${escapeHtml(allAttrs.src)}" alt="" loading="lazy" width="320" height="320"${allAttrs.onerror ? ` onerror="${allAttrs.onerror}"` : ""} />`
              : ""
          }
        </div>
        <span>${escapeHtml(t("all_product"))}</span>
      </a>`;
  };

  render();
  window.addEventListener("obs:localechange", render);
}

function initSpreadsheet() {
  const grid = document.querySelector("[data-product-grid]");
  if (!grid) return;

  const categoryBar = document.querySelector("[data-category-bar]");
  const searchInput = document.querySelector("[data-search]");
  const countEl = document.querySelector("[data-result-count]");
  const titleEl = document.querySelector("[data-catalog-title]");
  const pagination = document.querySelector("[data-pagination]");
  const pageSize = 24;

  const categories = getCategories();
  const products = getProducts();
  const params = new URLSearchParams(location.search);
  const initialCat = params.get("cat") || "all";
  let category = categories.some((item) => item.slug === initialCat) ? initialCat : "all";
  let query = "";
  let page = 1;

  if (!products.length) {
    grid.innerHTML = `<p class="empty-state">Catalog failed to load. Make sure <code>kakobuysheetlink/js/catalog.js</code> is available.</p>`;
    return;
  }

  categories.forEach((item) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = item.label;
    button.dataset.slug = item.slug;
    button.className = item.slug === category ? "active" : "";
    button.addEventListener("click", () => {
      category = item.slug;
      page = 1;
      categoryBar.querySelectorAll("button").forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.slug === category);
      });
      render();
    });
    categoryBar.appendChild(button);
  });

  const suggestBox = document.querySelector("[data-suggestions]");
  const searchWrap = document.querySelector("[data-search-wrap]");
  const STOP = new Set([
    "the", "and", "for", "with", "from", "all", "new", "men", "women", "womens",
    "style", "suit", "set", "pack", "item", "high", "low", "top", "quality",
    "find", "finds", "size", "sizes", "color", "colors", "edition", "series",
    "model", "type", "version", "original", "classic", "black", "white",
  ]);

  const suggestionStats = new Map();
  const bump = (term, weight = 1) => {
    const key = String(term || "").trim();
    if (!key || key.length < 2) return;
    const lower = key.toLowerCase();
    if (STOP.has(lower) || /^\d+$/.test(lower)) return;
    const prev = suggestionStats.get(lower) || { label: key, count: 0 };
    if (key[0] === key[0].toUpperCase() || prev.label.length < key.length) prev.label = key;
    prev.count += weight;
    suggestionStats.set(lower, prev);
  };

  products.forEach((product) => {
    bump(product.collection, 4);
    (product.tags || []).forEach((tag) => bump(tag, 3));
    String(product.title || "")
      .split(/[^a-zA-Z0-9+#.-]+/)
      .filter(Boolean)
      .forEach((word) => bump(word, 1));
  });

  const popularSuggestions = [...suggestionStats.values()]
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
    .slice(0, 40);

  let activeSuggest = -1;

  function getSuggestions(raw) {
    const q = String(raw || "").trim().toLowerCase();
    if (!q) return popularSuggestions.slice(0, 8);
    return [...suggestionStats.values()]
      .filter((item) => item.label.toLowerCase().includes(q))
      .sort((a, b) => {
        const aStarts = a.label.toLowerCase().startsWith(q) ? 0 : 1;
        const bStarts = b.label.toLowerCase().startsWith(q) ? 0 : 1;
        if (aStarts !== bStarts) return aStarts - bStarts;
        return b.count - a.count || a.label.localeCompare(b.label);
      })
      .slice(0, 8);
  }

  function hideSuggestions() {
    if (!suggestBox || !searchInput) return;
    suggestBox.hidden = true;
    suggestBox.innerHTML = "";
    activeSuggest = -1;
    searchInput.setAttribute("aria-expanded", "false");
  }

  function showSuggestions(raw = searchInput?.value || "") {
    if (!suggestBox || !searchInput) return;
    const items = getSuggestions(raw);
    if (!items.length) {
      hideSuggestions();
      return;
    }
    suggestBox.hidden = false;
    searchInput.setAttribute("aria-expanded", "true");
    activeSuggest = -1;
    suggestBox.innerHTML = items
      .map(
        (item, index) => `
        <li role="option" id="suggest-${index}">
          <button type="button" data-suggest="${escapeHtml(item.label)}">
            ${escapeHtml(item.label)}
            <span class="suggest-meta">${item.count.toLocaleString()} finds</span>
          </button>
        </li>`
      )
      .join("");
  }

  function applySearch(value, { keepSuggest = false } = {}) {
    if (!searchInput) return;
    searchInput.value = value;
    query = value.trim().toLowerCase();
    page = 1;
    render();
    if (keepSuggest) showSuggestions(value);
    else hideSuggestions();
  }

  let searchTimer;
  searchInput?.addEventListener("input", () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      query = searchInput.value.trim().toLowerCase();
      page = 1;
      render();
      showSuggestions(searchInput.value);
    }, 120);
  });

  searchInput?.addEventListener("focus", () => showSuggestions(searchInput.value));
  searchInput?.addEventListener("click", () => showSuggestions(searchInput.value));

  searchInput?.addEventListener("keydown", (event) => {
    const buttons = suggestBox && !suggestBox.hidden ? [...suggestBox.querySelectorAll("button")] : [];

    if (event.key === "ArrowDown" && buttons.length) {
      event.preventDefault();
      activeSuggest = (activeSuggest + 1) % buttons.length;
      buttons.forEach((btn, index) => btn.classList.toggle("is-active", index === activeSuggest));
      return;
    }

    if (event.key === "ArrowUp" && buttons.length) {
      event.preventDefault();
      activeSuggest = (activeSuggest - 1 + buttons.length) % buttons.length;
      buttons.forEach((btn, index) => btn.classList.toggle("is-active", index === activeSuggest));
      return;
    }

    if (event.key === "Escape") {
      hideSuggestions();
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      clearTimeout(searchTimer);
      const selected =
        activeSuggest >= 0 && buttons[activeSuggest]
          ? buttons[activeSuggest].dataset.suggest || ""
          : searchInput.value;
      applySearch(selected);
      searchInput.blur();
    }
  });

  suggestBox?.addEventListener("mousedown", (event) => {
    const button = event.target.closest("button[data-suggest]");
    if (!button) return;
    event.preventDefault();
    applySearch(button.dataset.suggest || "");
  });

  document.addEventListener("click", (event) => {
    if (!searchWrap?.contains(event.target)) hideSuggestions();
  });

  function filtered() {
    return products.filter((product) => {
      if (!inCategory(product, category)) return false;
      if (!query) return true;
      const haystack = `${product.title || ""} ${product.collection || ""} ${product.category || ""} ${(product.tags || []).join(" ")}`.toLowerCase();
      return haystack.includes(query);
    });
  }

  function render() {
    const items = filtered();
    const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
    page = Math.min(page, totalPages);
    const slice = items.slice((page - 1) * pageSize, page * pageSize);

    if (titleEl) {
      titleEl.textContent =
        category === "all" ? t("all_products") : categoryLabel(category, categories);
    }
    if (countEl) countEl.textContent = `${items.length.toLocaleString()} ${t("finds")}`;

    grid.innerHTML = "";
    if (!slice.length) {
      grid.innerHTML = `<p class="empty-state">No products match that search.</p>`;
    } else {
      slice.forEach((product) => {
        const card = document.createElement("a");
        const attrs = productImageAttrs(product.image);
        const title = escapeHtml(product.title);
        const price = Number(product.price) || 0;
        const meta = escapeHtml(product.collection || product.category || "");
        card.className = "product-card";
        card.href = productDetailUrl(product);
        card.innerHTML = `
          <div class="product-media">
            ${
              attrs.src
                ? `<img src="${escapeHtml(attrs.src)}" alt="" loading="lazy" decoding="async" width="400" height="400"${attrs.onerror ? ` onerror="${attrs.onerror}"` : ""} />`
                : `<span>${escapeHtml((product.title || "?").slice(0, 2).toUpperCase())}</span>`
            }
          </div>
          <div class="product-body">
            <h3>${title}</h3>
            <div class="price">${escapeHtml(formatMoney(price))}</div>
            <div class="meta">${meta}${product.qc ? " · QC" : ""}</div>
          </div>
        `;
        grid.appendChild(card);
      });
    }

    renderPagination(totalPages);
  }

  function renderPagination(totalPages) {
    if (!pagination) return;
    pagination.innerHTML = "";

    const addBtn = (label, opts = {}) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = label;
      if (opts.disabled) btn.disabled = true;
      if (opts.active) btn.className = "active";
      if (opts.onClick) btn.addEventListener("click", opts.onClick);
      pagination.appendChild(btn);
      return btn;
    };

    addBtn("Prev", {
      disabled: page <= 1,
      onClick: () => {
        page -= 1;
        render();
        window.scrollTo({ top: 0, behavior: "smooth" });
      },
    });

    const pages = [];
    for (let i = 1; i <= totalPages; i += 1) {
      const edge = i === 1 || i === totalPages;
      const near = Math.abs(i - page) <= 1;
      if (totalPages <= 9 || edge || near) pages.push(i);
      else if (pages[pages.length - 1] !== "…") pages.push("…");
    }

    pages.forEach((entry) => {
      if (entry === "…") {
        addBtn("…", { disabled: true });
        return;
      }
      addBtn(String(entry), {
        active: entry === page,
        onClick: () => {
          page = entry;
          render();
          window.scrollTo({ top: 0, behavior: "smooth" });
        },
      });
    });

    addBtn("Next", {
      disabled: page >= totalPages,
      onClick: () => {
        page += 1;
        render();
        window.scrollTo({ top: 0, behavior: "smooth" });
      },
    });
  }

  render();

  window.addEventListener("obs:localechange", () => {
    if (searchInput?.hasAttribute("data-i18n-placeholder")) {
      searchInput.setAttribute("placeholder", t("search_placeholder"));
    }
    render();
  });
}

initLocaleSlot();
initTheme();
applyI18n();
initYear();
initRegisterLinks();
initLiveCounts();
initCountdown();
initGiveawayForm();
initHomeCategories();
initSpreadsheet();
initProductPage();

function relatedCard(product) {
  const attrs = productImageAttrs(product.image);
  return `
    <a class="product-card" href="${productDetailUrl(product)}">
      <div class="product-media">
        ${
          attrs.src
            ? `<img src="${escapeHtml(attrs.src)}" alt="" loading="lazy" width="400" height="400"${attrs.onerror ? ` onerror="${attrs.onerror}"` : ""} />`
            : `<span>${escapeHtml((product.title || "?").slice(0, 2).toUpperCase())}</span>`
        }
      </div>
      <div class="product-body">
        <h3>${escapeHtml(product.title)}</h3>
        <div class="price">${escapeHtml(formatMoney(product.price))}</div>
        <div class="meta">${escapeHtml(product.collection || product.category || "")}</div>
      </div>
    </a>`;
}

function initProductPage() {
  const root = document.querySelector("[data-product-page]");
  if (!root) return;

  const render = () => {
    const products = getProducts();
    const id = new URLSearchParams(location.search).get("id");
    const item = products.find((p) => String(p.id) === String(id));

    if (!item) {
      root.innerHTML = `
        <p class="empty-state">${escapeHtml(t("product_missing"))}</p>
        <p style="text-align:center">
          <a class="btn btn-primary" href="/spreadsheet.html">${escapeHtml(t("back_to_sheet"))}</a>
        </p>`;
      return;
    }

    document.title = `${item.title} | OopBuySpreadsheets`;
    const buy = buyUrl(item);
    const gallery = [...new Set([item.image, ...((item.gallery || []).filter(Boolean))])].filter(Boolean);
    const mainAttrs = productImageAttrs(gallery[0] || item.image);
    const categoryName = catLabel(item.category) || item.category || "";
    const brand = item.collection || "";
    const hot = !!(item.featured || item.popular || (item.tags || []).some((tag) => /top trending|hot|new arrivals/i.test(tag)));
    const related = products
      .filter((p) => p.category === item.category && p.id !== item.id)
      .slice(0, 8);

    root.innerHTML = `
      <nav class="product-crumbs" aria-label="Breadcrumb">
        <a href="/spreadsheet.html">${escapeHtml(t("nav_spreadsheet"))}</a>
        <span class="sep">/</span>
        <a href="/spreadsheet.html?cat=${encodeURIComponent(item.category || "")}">${escapeHtml(categoryName)}</a>
        <span class="sep">/</span>
        <span>${escapeHtml(brand || item.title)}</span>
      </nav>

      <div class="product-layout">
        <div class="product-gallery">
          <div class="product-stage">
            <img data-main-photo src="${escapeHtml(mainAttrs.src)}" alt="${escapeHtml(item.title)}"${mainAttrs.onerror ? ` onerror="${mainAttrs.onerror}"` : ""} />
          </div>
          ${
            gallery.length > 1
              ? `<div class="product-thumbs" data-thumbs>
                  ${gallery
                    .map((src, index) => {
                      const attrs = productImageAttrs(src);
                      return `<button type="button" data-thumb="${index}" class="${index === 0 ? "is-on" : ""}">
                        <img src="${escapeHtml(attrs.src)}" alt=""${attrs.onerror ? ` onerror="${attrs.onerror}"` : ""} />
                      </button>`;
                    })
                    .join("")}
                </div>`
              : ""
          }
        </div>

        <aside class="product-info">
          <div class="product-tags">
            <span class="product-tag">${escapeHtml(String(item.source || "Weidian").toUpperCase())}</span>
            <span class="product-tag">${escapeHtml(categoryName)}</span>
            ${item.qc ? `<span class="product-tag is-qc">${escapeHtml(t("product_qc"))}</span>` : ""}
            ${hot ? `<span class="product-tag is-hot">HOT</span>` : ""}
          </div>
          <h1>${escapeHtml(item.title)}</h1>
          <p class="product-sub">${escapeHtml([brand, categoryName].filter(Boolean).join(" · "))}</p>
          <div class="product-price" data-product-price>${escapeHtml(formatMoney(item.price))}</div>

          <div class="product-actions">
            <a class="btn btn-primary" href="${escapeHtml(buy)}" target="_blank" rel="noopener noreferrer">${escapeHtml(t("buy_oopbuy"))}</a>
          </div>
        </aside>
      </div>

      ${
        related.length
          ? `<section class="product-related">
              <h2>${escapeHtml(t("related_title"))}</h2>
              <div class="product-grid">${related.map(relatedCard).join("")}</div>
            </section>`
          : ""
      }
    `;

    const mainPhoto = root.querySelector("[data-main-photo]");
    root.querySelectorAll("[data-thumb]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const index = Number(btn.getAttribute("data-thumb") || 0);
        const attrs = productImageAttrs(gallery[index]);
        if (mainPhoto && attrs.src) {
          mainPhoto.src = attrs.src;
          if (attrs.onerror) mainPhoto.setAttribute("onerror", attrs.onerror);
        }
        root.querySelectorAll("[data-thumb]").forEach((el) => el.classList.toggle("is-on", el === btn));
      });
    });
  };

  render();
  window.addEventListener("obs:localechange", render);
}
