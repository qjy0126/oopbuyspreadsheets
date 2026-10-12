const LANG_KEY = "obs-lang";
const CURRENCY_KEY = "obs-currency";

const RATES = {
  USD: { rate: 1, symbol: "$", code: "USD" },
  EUR: { rate: 0.92, symbol: "€", code: "EUR" },
  CNY: { rate: 7.2, symbol: "¥", code: "CNY" },
};

const STRINGS = {
  en: {
    nav_home: "Home",
    nav_spreadsheet: "Spreadsheet",
    nav_dead: "Dead Links",
    theme_dark: "Dark",
    theme_light: "Light",
    language: "Language",
    currency: "Currency",
    hero_title: "Premium finds & coupons for your next haul",
    hero_sub:
      "Browse curated links and join monthly giveaways — built for oopbuyspreadsheets.me.",
    cta_signup: "Sign up for OopBuy & get coupons",
    cta_explore: "Explore the spreadsheet",
    curated_catalog: "Curated catalog",
    curated_note: "Verified product finds across 50+ marketplaces",
    metric_finds: "Curated product finds",
    metric_markets: "Supported marketplaces",
    metric_discord: "Community support",
    countdown_title: "Next giveaway draw in",
    days: "Days",
    hours: "Hours",
    minutes: "Minutes",
    seconds: "Seconds",
    giveaway_eyebrow: "Monthly giveaways",
    giveaway_title: "Join the largest OopBuy monthly giveaway",
    giveaway_lede:
      "Every month we pick four winners for products and coupons — enter with your email below.",
    place_1: "1st place",
    place_2: "2nd place",
    place_3: "3rd place",
    place_4: "4th place",
    prize_shoes: "Shoes",
    prize_hoodie: "Sweater / Hoodie",
    prize_tee: "T-Shirt",
    prize_coupon: "15% Coupon",
    email_placeholder: "Your email address",
    join_giveaway: "Join giveaway",
    giveaway_ok: "You’re on the list. Good luck!",
    faq_eyebrow: "FAQ",
    faq_title: "Common questions",
    faq_q1: "Is this an official OopBuy website?",
    faq_a1:
      "No. OopBuySpreadsheets operates independently and has no partnership or official connection with OopBuy, Weidian, Taobao, 1688, Temu, or other marketplaces.",
    faq_q2: "Do you sell products here?",
    faq_a2:
      "We do not run an online shop. Nothing is sold directly through this site — we help you find, track, and manage items from various sources.",
    faq_q3: "Are recommendations paid placements?",
    faq_a3:
      "From time to time we recommend resources we find useful. Suggestions are based on relevance and quality, and are never influenced by payment for placement.",
    faq_q4: "Where should I start?",
    faq_a4:
      "Open the spreadsheet, filter by category, review the listing and QC photos, then place your order through your preferred agent.",
    how_to_buy: "How to buy",
    footer_blurb: "Independent haul research hub for oopbuyspreadsheets.me",
    footer_copy: "OopBuySpreadsheets. Independent of Weidian, Taobao, 1688, and Temu.",
    all_products: "All Products",
    all_product: "ALL PRODUCT",
    categories_title: "Explore Our Categories",
    categories_lede: "Jump into a lane instead of scrolling a 15,000-row dump.",
    search_placeholder: "Search for products here",
    finds: "finds",
    sheet_title: "OopBuy Spreadsheet",
    product_loading: "Loading product…",
    product_missing: "Product not found.",
    back_to_sheet: "Back to spreadsheet",
    buy_oopbuy: "Buy on OopBuy",
    open_source: "Open source link",
    related_title: "Related finds",
    product_sizes: "Sizes",
    product_source: "Source",
    product_seller: "Seller",
    product_brand: "Brand",
    product_category: "Category",
    product_qc: "QC available",
    cat_shoes: "Shoes",
    cat_tshirts: "T-Shirts",
    cat_hoodies: "Hoodies",
    cat_jackets: "Jackets",
    cat_pants: "Pants/Shorts",
    cat_headwear: "Headwear",
    cat_sets: "Sets",
    cat_underwear: "Underpants",
    cat_jersey: "Jersey",
    cat_accessories: "Accessories",
    cat_other: "Other Stuff",
  },
  de: {
    nav_home: "Start",
    nav_spreadsheet: "Spreadsheet",
    nav_dead: "Tote Links",
    theme_dark: "Dunkel",
    theme_light: "Hell",
    language: "Sprache",
    currency: "Währung",
    hero_title: "Premium-Funde & Coupons für deinen nächsten Haul",
    hero_sub:
      "Durchsuche kuratierte Links und nimm an monatlichen Giveaways teil — für oopbuyspreadsheets.me.",
    cta_signup: "Bei OopBuy anmelden & Coupons holen",
    cta_explore: "Spreadsheet entdecken",
    curated_catalog: "Kuratierter Katalog",
    curated_note: "Geprüfte Produktfunde aus über 50 Marktplätzen",
    metric_finds: "Kuratierte Produktfunde",
    metric_markets: "Unterstützte Marktplätze",
    metric_discord: "Community-Support",
    countdown_title: "Nächste Verlosung in",
    days: "Tage",
    hours: "Stunden",
    minutes: "Minuten",
    seconds: "Sekunden",
    giveaway_eyebrow: "Monatliche Giveaways",
    giveaway_title: "Mach beim größten OopBuy-Monatsgiveaway mit",
    giveaway_lede:
      "Jeden Monat wählen wir vier Gewinner für Produkte und Coupons — trag dich mit deiner E-Mail ein.",
    place_1: "1. Platz",
    place_2: "2. Platz",
    place_3: "3. Platz",
    place_4: "4. Platz",
    prize_shoes: "Schuhe",
    prize_hoodie: "Pullover / Hoodie",
    prize_tee: "T-Shirt",
    prize_coupon: "15% Gutschein",
    email_placeholder: "Deine E-Mail-Adresse",
    join_giveaway: "Am Giveaway teilnehmen",
    giveaway_ok: "Du bist auf der Liste. Viel Glück!",
    faq_eyebrow: "FAQ",
    faq_title: "Häufige Fragen",
    faq_q1: "Ist das eine offizielle OopBuy-Website?",
    faq_a1:
      "Nein. OopBuySpreadsheets arbeitet unabhängig und hat keine Partnerschaft oder offizielle Verbindung zu OopBuy, Weidian, Taobao, 1688, Temu oder anderen Marktplätzen.",
    faq_q2: "Verkauft ihr hier Produkte?",
    faq_a2:
      "Wir betreiben keinen Online-Shop. Über diese Seite wird nichts verkauft — wir helfen dir, Artikel zu finden, zu verfolgen und zu verwalten.",
    faq_q3: "Sind Empfehlungen bezahlte Platzierungen?",
    faq_a3:
      "Gelegentlich empfehlen wir nützliche Ressourcen. Vorschläge basieren auf Relevanz und Qualität und werden nie durch Zahlungen für Platzierung beeinflusst.",
    faq_q4: "Wo sollte ich starten?",
    faq_a4:
      "Öffne das Spreadsheet, filtere nach Kategorie, prüfe Listing und QC-Fotos und bestelle dann über deinen bevorzugten Agenten.",
    how_to_buy: "Kaufhilfe",
    footer_blurb: "Unabhängiger Haul-Recherche-Hub für oopbuyspreadsheets.me",
    footer_copy: "OopBuySpreadsheets. Unabhängig von Weidian, Taobao, 1688 und Temu.",
    all_products: "Alle Produkte",
    all_product: "ALLE PRODUKTE",
    categories_title: "Entdecke unsere Kategorien",
    categories_lede: "Wähle eine Kategorie statt durch 15.000 Zeilen zu scrollen.",
    search_placeholder: "Produkte hier suchen",
    finds: "Treffer",
    sheet_title: "OopBuy Spreadsheet",
    product_loading: "Produkt wird geladen…",
    product_missing: "Produkt nicht gefunden.",
    back_to_sheet: "Zurück zum Spreadsheet",
    buy_oopbuy: "Bei OopBuy kaufen",
    open_source: "Quelllink öffnen",
    related_title: "Ähnliche Funde",
    product_sizes: "Größen",
    product_source: "Quelle",
    product_seller: "Verkäufer",
    product_brand: "Marke",
    product_category: "Kategorie",
    product_qc: "QC verfügbar",
    cat_shoes: "Schuhe",
    cat_tshirts: "T-Shirts",
    cat_hoodies: "Hoodies",
    cat_jackets: "Jacken",
    cat_pants: "Hosen/Shorts",
    cat_headwear: "Kopfbedeckung",
    cat_sets: "Sets",
    cat_underwear: "Unterwäsche",
    cat_jersey: "Trikots",
    cat_accessories: "Accessoires",
    cat_other: "Sonstiges",
  },
};

const CAT_I18N = {
  shoes: "cat_shoes",
  "t-shirts": "cat_tshirts",
  hoodies: "cat_hoodies",
  jackets: "cat_jackets",
  pants: "cat_pants",
  headwear: "cat_headwear",
  sets: "cat_sets",
  underwear: "cat_underwear",
  jersey: "cat_jersey",
  accessories: "cat_accessories",
  other: "cat_other",
};

const LANGS = [
  { code: "en", label: "EN", flag: "🇺🇸", name: "English" },
  { code: "de", label: "DE", flag: "🇩🇪", name: "Deutsch" },
];

const CURRENCIES = ["USD", "EUR", "CNY"];

function readLang() {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved === "en" || saved === "de") return saved;
  } catch (_) {}
  const nav = (navigator.language || "en").slice(0, 2).toLowerCase();
  return nav === "de" ? "de" : "en";
}

function readCurrency() {
  try {
    const saved = localStorage.getItem(CURRENCY_KEY);
    if (saved && RATES[saved]) return saved;
  } catch (_) {}
  return "USD";
}

let lang = readLang();
let currency = readCurrency();

export function t(key) {
  return STRINGS[lang]?.[key] || STRINGS.en[key] || key;
}

export function catLabel(slug) {
  const key = CAT_I18N[slug];
  return key ? t(key) : slug;
}

export function getLang() {
  return lang;
}

export function getCurrency() {
  return currency;
}

export function formatMoney(usd) {
  const n = Number(usd) || 0;
  const info = RATES[currency] || RATES.USD;
  const value = n * info.rate;
  if (currency === "EUR") {
    return (
      value.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) +
      " " +
      info.symbol
    );
  }
  if (currency === "CNY") {
    return info.symbol + Math.round(value).toLocaleString("zh-CN");
  }
  return info.symbol + value.toFixed(2);
}

export function applyI18n() {
  document.documentElement.setAttribute("lang", lang);

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (!key) return;
    el.textContent = t(key);
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (!key) return;
    el.setAttribute("placeholder", t(key));
  });

  document.querySelectorAll("[data-theme-label]").forEach((el) => {
    const theme = document.documentElement.getAttribute("data-theme");
    el.textContent = theme === "dark" ? t("theme_light") : t("theme_dark");
  });

  syncLocaleControls();
  window.dispatchEvent(new CustomEvent("obs:localechange", { detail: { lang, currency } }));
}

export function setLang(code) {
  if (code !== "en" && code !== "de") return;
  lang = code;
  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch (_) {}
  applyI18n();
}

export function setCurrency(code) {
  if (!RATES[code]) return;
  currency = code;
  try {
    localStorage.setItem(CURRENCY_KEY, currency);
  } catch (_) {}
  applyI18n();
}

function syncLocaleControls() {
  document.querySelectorAll("[data-lang-option]").forEach((btn) => {
    btn.classList.toggle("active", btn.getAttribute("data-lang-option") === lang);
  });
  document.querySelectorAll("[data-currency-option]").forEach((btn) => {
    btn.classList.toggle("active", btn.getAttribute("data-currency-option") === currency);
  });
  document.querySelectorAll("[data-lang-current]").forEach((el) => {
    const current = LANGS.find((item) => item.code === lang) || LANGS[0];
    el.innerHTML = `<span class="locale-flag">${current.flag}</span><span>${current.label}</span>`;
  });
  document.querySelectorAll("[data-currency-current]").forEach((el) => {
    el.textContent = currency;
  });
}

export function initLocaleControls() {
  document.querySelectorAll("[data-lang-option]").forEach((btn) => {
    btn.addEventListener("click", () => {
      setLang(btn.getAttribute("data-lang-option"));
      closeMenus();
    });
  });

  document.querySelectorAll("[data-currency-option]").forEach((btn) => {
    btn.addEventListener("click", () => {
      setCurrency(btn.getAttribute("data-currency-option"));
      closeMenus();
    });
  });

  document.querySelectorAll("[data-locale-toggle]").forEach((btn) => {
    btn.addEventListener("click", (event) => {
      event.stopPropagation();
      const menu = btn.parentElement?.querySelector("[data-locale-menu]");
      const open = menu?.hasAttribute("hidden") === false;
      closeMenus();
      if (menu && open) menu.hidden = true;
      else if (menu) menu.hidden = false;
    });
  });

  document.addEventListener("click", () => closeMenus());
  applyI18n();
}

function closeMenus() {
  document.querySelectorAll("[data-locale-menu]").forEach((menu) => {
    menu.hidden = true;
  });
}

export function localeSwitcherHtml() {
  return `
    <div class="locale-controls">
      <div class="locale-group">
        <button class="locale-btn" type="button" data-locale-toggle aria-label="Language">
          <span data-lang-current></span>
        </button>
        <div class="locale-menu" data-locale-menu hidden>
          ${LANGS.map(
            (item) => `
            <button type="button" data-lang-option="${item.code}">
              <span class="locale-flag">${item.flag}</span> ${item.label}
            </button>`
          ).join("")}
        </div>
      </div>
      <div class="locale-group">
        <button class="locale-btn" type="button" data-locale-toggle aria-label="Currency">
          <span data-currency-current>USD</span>
        </button>
        <div class="locale-menu" data-locale-menu hidden>
          ${CURRENCIES.map(
            (code) => `
            <button type="button" data-currency-option="${code}">${code}</button>`
          ).join("")}
        </div>
      </div>
    </div>
  `;
}
