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
})();
