/* EN/PL UI strings + USD/PLN display currency */
(function () {
  window.KF = window.KF || {};

  const RATES = {
    USD: { rate: 1, symbol: "$", code: "USD" },
    PLN: { rate: 3.95, symbol: "zł", code: "PLN" },
  };

  const STRINGS = {
    en: {
      language: "Language",
      currency: "Currency",
      lang_en: "English",
      lang_pl: "Polski",
      fx_note: "Display rates are approximate.",
      nav_home: "Home",
      nav_categories: "All Categories ▾",
      nav_spreadsheet: "Spreadsheet",
      nav_kakobuy: "Kakobuy",
      nav_howto: "How to",
      search_placeholder: "Search finds…",
      search_modal_placeholder: "Search reps, brands, items…",
      search_popular: "Popular",
      search_categories: "Categories",
      promo_coupons: "Kakobuy coupons · Sign up with invite 9v88f · Free shipping deals",
      promo_browse: "Browse sheet links as cards — open any find on Kakobuy in one tap",
      hero_tagline: "The best Kakobuy spreadsheet",
      hero_lede: "Sheet links as a shoppable grid — shoes, streetwear, and QC finds. Preview here, checkout on Kakobuy.",
      view_spreadsheet: "View Spreadsheet",
      open_kakobuy: "Open Kakobuy",
      explore_categories: "Explore Our Categories",
      explore_lede: "Jump into a lane — same idea as Finds Spreadsheet, built for Kakobuy.",
      browse_sheet_links: "Browse sheet links",
      latest_finds: "Latest Finds",
      view_all: "View All",
      more_in_category: "More in this category",
      buy_kakobuy: "Buy on Kakobuy",
      all_finds: "All finds",
      footer_blurb: "A Finds-style Kakobuy spreadsheet site: browse sheet links as product cards, then checkout on Kakobuy. Independent directory — not affiliated with Kakobuy.",
      footer_categories: "Categories",
      footer_kakobuy: "Kakobuy",
      footer_site: "Site",
      signup_coupons: "Sign up / coupons",
      how_to_buy: "How to buy",
      read_qc: "Read QC",
      classic_sheet: "Classic sheet",
      about: "About",
      privacy: "Privacy",
      terms: "Terms",
      quality: "quality",
      views: "views",
      spreadsheet: "Spreadsheet",
      trusted: "TRUSTED",
    },
    pl: {
      language: "Język",
      currency: "Waluta",
      lang_en: "English",
      lang_pl: "Polski",
      fx_note: "Kursy wyświetlania są orientacyjne.",
      nav_home: "Start",
      nav_categories: "Kategorie ▾",
      nav_spreadsheet: "Spreadsheet",
      nav_kakobuy: "Kakobuy",
      nav_howto: "Poradnik",
      search_placeholder: "Szukaj…",
      search_modal_placeholder: "Szukaj marek, rzeczy…",
      search_popular: "Popularne",
      search_categories: "Kategorie",
      promo_coupons: "Kupony Kakobuy · Zarejestruj się z kodem 9v88f · Promocje na wysyłkę",
      promo_browse: "Przeglądaj linki jak karty — otwórz znalezisko na Kakobuy jednym tapnięciem",
      hero_tagline: "Najlepszy Kakobuy spreadsheet",
      hero_lede: "Linki ze sheetu jako siatka produktów — buty, streetwear i QC. Podgląd tutaj, zakupy na Kakobuy.",
      view_spreadsheet: "Zobacz spreadsheet",
      open_kakobuy: "Otwórz Kakobuy",
      explore_categories: "Przeglądaj kategorie",
      explore_lede: "Wybierz kategorię — ten sam pomysł co Finds Spreadsheet, pod Kakobuy.",
      browse_sheet_links: "Przeglądaj linki",
      latest_finds: "Najnowsze znaleziska",
      view_all: "Zobacz wszystkie",
      more_in_category: "Więcej w tej kategorii",
      buy_kakobuy: "Kup na Kakobuy",
      all_finds: "Wszystkie",
      footer_blurb: "Katalog Kakobuy w stylu Finds: karty produktów ze sheetu, checkout na Kakobuy. Niezależny katalog — bez powiązania z Kakobuy.",
      footer_categories: "Kategorie",
      footer_kakobuy: "Kakobuy",
      footer_site: "Strona",
      signup_coupons: "Rejestracja / kupony",
      how_to_buy: "Jak kupować",
      read_qc: "Czytaj QC",
      classic_sheet: "Klasyczny sheet",
      about: "O nas",
      privacy: "Prywatność",
      terms: "Regulamin",
      quality: "jakość",
      views: "wyświetleń",
      spreadsheet: "Spreadsheet",
      trusted: "ZAUFANY",
    },
  };

  const CAT_LABELS = {
    en: {
      shoes: "Shoes",
      "t-shirts": "T-Shirts",
      hoodies: "Hoodies",
      jackets: "Jackets",
      pants: "Pants/Shorts",
      headwear: "Headwear",
      sets: "Sets",
      underwear: "Underpants",
      jersey: "Jersey",
      accessories: "Accessories",
      glasses: "Glasses",
      watches: "Watches",
      perfume: "Perfume",
      bricks: "Building Blocks",
      other: "Other Stuff",
    },
    pl: {
      shoes: "Buty",
      "t-shirts": "Koszulki",
      hoodies: "Bluzy",
      jackets: "Kurtki",
      pants: "Spodnie/Szorty",
      headwear: "Czapki",
      sets: "Komplety",
      underwear: "Bielizna",
      jersey: "Jersey",
      accessories: "Akcesoria",
      glasses: "Okulary",
      watches: "Zegarki",
      perfume: "Perfumy",
      bricks: "Klocki",
      other: "Inne",
    },
  };

  function readLang() {
    try {
      const c = localStorage.getItem("kf-lang");
      if (c === "pl" || c === "en") return c;
    } catch (_) {}
    const html = (document.documentElement.getAttribute("lang") || "").slice(0, 2).toLowerCase();
    if (html === "pl") return "pl";
    return "en";
  }

  function readCurrency() {
    try {
      const c = localStorage.getItem("kf-currency");
      if (c && RATES[c]) return c;
    } catch (_) {}
    return "USD";
  }

  let lang = "en";
  let currency = "USD";

  function init() {
    lang = readLang();
    currency = readCurrency();
    document.documentElement.setAttribute("lang", lang);
  }

  function t(key) {
    const pack = STRINGS[lang] || STRINGS.en;
    return pack[key] || STRINGS.en[key] || key;
  }

  function catLabel(slug) {
    return (CAT_LABELS[lang] || CAT_LABELS.en)[slug] || slug;
  }

  function money(usd) {
    const n = Number(usd) || 0;
    const info = RATES[currency] || RATES.USD;
    const v = n * info.rate;
    if (currency === "PLN") {
      const rounded = Math.round(v * 100) / 100;
      return (
        rounded.toLocaleString("pl-PL", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) +
        " " +
        info.symbol
      );
    }
    return info.symbol + v.toFixed(2);
  }

  function cny(usd) {
    return `¥${Math.round((Number(usd) || 0) * 7.2)}`;
  }

  function priceLabel(usd) {
    return `${cny(usd)} = ${money(usd)}`;
  }

  function setLang(code) {
    if (code !== "en" && code !== "pl") return;
    try {
      localStorage.setItem("kf-lang", code);
    } catch (_) {}
    lang = code;
    location.reload();
  }

  function setCurrency(code) {
    if (!RATES[code]) return;
    currency = code;
    try {
      localStorage.setItem("kf-currency", code);
    } catch (_) {}
    refreshPrices();
    updateChip();
    document.dispatchEvent(new CustomEvent("kf:currency", { detail: { currency } }));
  }

  function refreshPrices() {
    document.querySelectorAll("[data-price]").forEach((el) => {
      el.textContent = priceLabel(el.getAttribute("data-price"));
    });
    const itemPrice = document.getElementById("item-price");
    if (itemPrice && itemPrice.dataset.price != null) {
      itemPrice.textContent = money(itemPrice.dataset.price);
    }
  }

  function applyStaticI18n() {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (key) el.textContent = t(key);
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (key) el.setAttribute("placeholder", t(key));
    });
  }

  function updateChip() {
    const chip = document.getElementById("prefs-chip");
    if (!chip) return;
    chip.innerHTML = `${lang === "pl" ? "PL" : "EN"} · <strong>${currency}</strong>`;
  }

  init();

  KF.i18n = {
    get lang() {
      return lang;
    },
    get currency() {
      return currency;
    },
    t,
    catLabel,
    money,
    cny,
    priceLabel,
    setLang,
    setCurrency,
    refreshPrices,
    applyStaticI18n,
    updateChip,
  };

  KF.t = t;
  KF.catLabel = catLabel;
  KF.money = money;
  KF.cny = cny;
  KF.priceLabel = priceLabel;
})();
