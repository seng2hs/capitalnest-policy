(() => {
  "use strict";

  const header = document.querySelector(".site-header");
  const drawer = document.getElementById("mobile-drawer");
  const overlay = document.getElementById("drawer-overlay");
  const openBtn = document.getElementById("nav-toggle");
  const closeBtn = document.getElementById("drawer-close");
  const drawerLinks = drawer ? drawer.querySelectorAll("a") : [];

  const openDrawer = () => {
    drawer?.classList.add("is-open");
    overlay?.classList.add("is-open");
    overlay?.removeAttribute("hidden");
    drawer?.setAttribute("aria-hidden", "false");
    document.body.classList.add("drawer-open");
    openBtn?.setAttribute("aria-expanded", "true");
  };

  const closeDrawer = () => {
    drawer?.classList.remove("is-open");
    overlay?.classList.remove("is-open");
    overlay?.setAttribute("hidden", "");
    drawer?.setAttribute("aria-hidden", "true");
    document.body.classList.remove("drawer-open");
    openBtn?.setAttribute("aria-expanded", "false");
  };

  openBtn?.addEventListener("click", openDrawer);
  closeBtn?.addEventListener("click", closeDrawer);
  overlay?.addEventListener("click", closeDrawer);
  drawerLinks.forEach((link) => link.addEventListener("click", closeDrawer));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDrawer();
  });

  const onScroll = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* FAQ accordion */
  document.querySelectorAll(".faq-item").forEach((item) => {
    const btn = item.querySelector(".faq-question");
    const panel = item.querySelector(".faq-answer");
    if (!btn || !panel) return;

    btn.addEventListener("click", () => {
      const isOpen = item.classList.contains("is-open");
      document.querySelectorAll(".faq-item.is-open").forEach((openItem) => {
        if (openItem === item) return;
        openItem.classList.remove("is-open");
        const openPanel = openItem.querySelector(".faq-answer");
        const openBtnEl = openItem.querySelector(".faq-question");
        if (openPanel) openPanel.style.maxHeight = null;
        openBtnEl?.setAttribute("aria-expanded", "false");
      });

      item.classList.toggle("is-open", !isOpen);
      btn.setAttribute("aria-expanded", String(!isOpen));
      panel.style.maxHeight = isOpen ? null : `${panel.scrollHeight}px`;
    });
  });

  /* Reveal on scroll */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  /* Active nav highlight */
  const sections = document.querySelectorAll("section[id]");
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  const highlightNav = () => {
    let current = "";
    sections.forEach((section) => {
      if (window.scrollY >= section.offsetTop - 120) {
        current = section.id;
      }
    });
    navAnchors.forEach((a) => {
      a.classList.toggle("active", a.getAttribute("href") === `#${current}`);
    });
  };
  window.addEventListener("scroll", highlightNav, { passive: true });

  /* Newsletter (client-only feedback; no backend) */
  const form = document.getElementById("newsletter-form");
  const msg = document.getElementById("newsletter-msg");
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = form.querySelector('input[type="email"]');
    if (!email?.value) return;
    if (msg) {
      msg.textContent = "Thanks! We’ll notify you when CapitalNest launches.";
    }
    form.reset();
  });

  /* ——— Country-based currency display ——— */
  const STORAGE_KEY = "cn-currency";

  const TZ_TO_COUNTRY = {
    "Asia/Kolkata": "IN",
    "Asia/Calcutta": "IN",
    "Asia/Dubai": "AE",
    "Asia/Singapore": "SG",
    "Asia/Kuala_Lumpur": "MY",
    "Asia/Riyadh": "SA",
    "Asia/Tokyo": "JP",
    "Asia/Shanghai": "CN",
    "Asia/Hong_Kong": "HK",
    "Asia/Bangkok": "TH",
    "Asia/Jakarta": "ID",
    "Asia/Manila": "PH",
    "Asia/Karachi": "PK",
    "Asia/Dhaka": "BD",
    "Asia/Colombo": "LK",
    "Asia/Kathmandu": "NP",
    "Europe/London": "GB",
    "Europe/Paris": "FR",
    "Europe/Berlin": "DE",
    "Europe/Madrid": "ES",
    "Europe/Rome": "IT",
    "Europe/Amsterdam": "NL",
    "America/New_York": "US",
    "America/Chicago": "US",
    "America/Denver": "US",
    "America/Los_Angeles": "US",
    "America/Toronto": "CA",
    "America/Vancouver": "CA",
    "Australia/Sydney": "AU",
    "Australia/Melbourne": "AU",
    "Pacific/Auckland": "NZ",
    "Africa/Johannesburg": "ZA",
    "Africa/Lagos": "NG",
    "Africa/Nairobi": "KE",
  };

  const COUNTRY_CURRENCY = {
    IN: "INR", AE: "AED", SG: "SGD", MY: "MYR", SA: "SAR",
    JP: "JPY", CN: "CNY", HK: "HKD", TH: "THB", ID: "IDR",
    PH: "PHP", PK: "PKR", BD: "BDT", LK: "LKR", NP: "NPR",
    GB: "GBP", FR: "EUR", DE: "EUR", ES: "EUR", IT: "EUR", NL: "EUR",
    US: "USD", CA: "CAD", AU: "AUD", NZ: "NZD", ZA: "ZAR",
    NG: "NGN", KE: "KES",
  };

  /* Approximate units of foreign currency per 1 INR (marketing display only) */
  const INR_RATES = {
    INR: 1,
    USD: 0.012,
    EUR: 0.011,
    GBP: 0.0094,
    AED: 0.044,
    SGD: 0.016,
    AUD: 0.018,
    CAD: 0.016,
    MYR: 0.053,
    SAR: 0.045,
    JPY: 1.8,
    CNY: 0.086,
    HKD: 0.093,
    THB: 0.40,
    IDR: 190,
    PHP: 0.67,
    PKR: 3.3,
    BDT: 1.4,
    LKR: 3.6,
    NPR: 1.6,
    NZD: 0.020,
    ZAR: 0.22,
    NGN: 18,
    KES: 1.55,
  };

  const LOCALE_FOR = {
    INR: "en-IN", USD: "en-US", EUR: "en-IE", GBP: "en-GB",
    AED: "en-AE", SGD: "en-SG", AUD: "en-AU", CAD: "en-CA",
    MYR: "en-MY", SAR: "en-SA", JPY: "ja-JP", CNY: "zh-CN",
    HKD: "en-HK", THB: "th-TH", IDR: "id-ID", PHP: "en-PH",
    PKR: "en-PK", BDT: "en-BD", LKR: "en-LK", NPR: "en-NP",
    NZD: "en-NZ", ZAR: "en-ZA", NGN: "en-NG", KES: "en-KE",
  };

  const detectCountry = () => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz && TZ_TO_COUNTRY[tz]) return TZ_TO_COUNTRY[tz];
    } catch (_) { /* ignore */ }

    const lang = navigator.language || navigator.userLanguage || "en-IN";
    const parts = lang.split("-");
    if (parts.length > 1) return parts[parts.length - 1].toUpperCase();
    return "IN";
  };

  const resolveCurrency = (override) => {
    if (override && override !== "auto" && INR_RATES[override]) return override;
    const country = detectCountry();
    return COUNTRY_CURRENCY[country] || "INR";
  };

  const formatMoney = (amountInr, currency, compact) => {
    const rate = INR_RATES[currency] ?? 1;
    const value = amountInr * rate;
    const locale = LOCALE_FOR[currency] || undefined;
    const fractionDigits = currency === "JPY" || currency === "IDR" ? 0 : value >= 100 ? 0 : 2;

    try {
      if (compact && value >= 1000) {
        return new Intl.NumberFormat(locale, {
          style: "currency",
          currency,
          notation: "compact",
          maximumFractionDigits: 1,
        }).format(value);
      }
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        maximumFractionDigits: fractionDigits,
        minimumFractionDigits: 0,
      }).format(value);
    } catch (_) {
      return `${currency} ${Math.round(value).toLocaleString()}`;
    }
  };

  const applyCurrency = (currency) => {
    document.querySelectorAll("[data-money]").forEach((el) => {
      const amount = Number(el.getAttribute("data-money"));
      if (Number.isNaN(amount)) return;
      const compact = el.hasAttribute("data-money-compact");
      el.textContent = formatMoney(amount, currency, compact);
    });

    const note = document.getElementById("currency-note");
    if (note) {
      const country = detectCountry();
      note.textContent =
        currency === "INR"
          ? "Prices shown in Indian Rupees. Play Store billing may vary by country."
          : `Converted from INR for display (${currency}). Final Google Play price may differ in your country (${country}).`;
    }
  };

  const select = document.getElementById("currency-select");
  const saved = localStorage.getItem(STORAGE_KEY) || "auto";
  const active = resolveCurrency(saved);

  if (select) {
    if ([...select.options].some((o) => o.value === saved)) {
      select.value = saved;
    }
    select.addEventListener("change", () => {
      localStorage.setItem(STORAGE_KEY, select.value);
      applyCurrency(resolveCurrency(select.value));
    });
  }

  applyCurrency(active);
})();
