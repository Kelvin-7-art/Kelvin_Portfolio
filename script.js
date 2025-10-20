document.addEventListener("DOMContentLoaded", () => {
  /* ================= MENU TOGGLE ================= */
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("active");
      menuToggle.classList.toggle("glow", isOpen);
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    // Close the menu after choosing a link (mobile)
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        menuToggle.classList.remove("glow");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ================= BUTTON GLOW ANIMATION ================= */
  document.querySelectorAll(".btn").forEach((btn) => {
    btn.addEventListener("mouseenter", () => btn.classList.add("is-hovered"));
    btn.addEventListener("mouseleave", () => btn.classList.remove("is-hovered"));
    btn.addEventListener("focus", () => btn.classList.add("is-hovered"));
    btn.addEventListener("blur", () => btn.classList.remove("is-hovered"));
  });

  /* ================= NAV LINK HOVER GLOW ================= */
  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("mouseenter", () => link.classList.add("glow"));
    link.addEventListener("mouseleave", () => link.classList.remove("glow"));
  });

  /* ================= HERO IMAGE FLOAT (CSS-driven) ================= */
  const heroImage = document.querySelector(".hero-image img");
  const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  if (heroImage && !prefersReduced) {
    heroImage.classList.add("float");
  }

  /* ================= AUTO-HIGHLIGHT CURRENT NAV ================= */
  const raw = window.location.pathname.split("/").pop();
  const page = raw === "" ? "index.html" : raw;
  document.querySelectorAll(".nav-links a").forEach((a) => {
    if (a.getAttribute("href") === page) {
      a.setAttribute("aria-current", "page"); // uses your existing CSS for [aria-current="page"]
    }
  });
});
