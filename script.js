(function () {
  "use strict";

  const header = document.querySelector(".site-header");
  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".main-nav");
  const year = document.querySelector("#year");
  const planner = document.querySelector("#planner-form");
  const planResult = document.querySelector("#plan-result");
  const newsletter = document.querySelector("#newsletter-form");
  const newsletterStatus = document.querySelector("#newsletter-status");

  if (year) year.textContent = String(new Date().getFullYear());

  function updateHeader() {
    if (header) header.classList.toggle("scrolled", window.scrollY > 12);
  }

  function closeMenu() {
    if (!menuButton || !navigation) return;
    navigation.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Abrir menú");
    document.body.classList.remove("menu-open");
  }

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  if (menuButton && navigation) {
    menuButton.addEventListener("click", function () {
      const open = navigation.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(open));
      menuButton.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
      document.body.classList.toggle("menu-open", open);
    });
    navigation.querySelectorAll("a").forEach(function (link) { link.addEventListener("click", closeMenu); });
    document.addEventListener("keydown", function (event) { if (event.key === "Escape") closeMenu(); });
  }

  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll('.main-nav a[href^="#"]');
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id);
        });
      });
    }, { rootMargin: "-25% 0px -60%", threshold: 0 });
    sections.forEach(function (section) { observer.observe(section); });
  }

  if (planner && planResult) {
    planner.addEventListener("submit", function (event) {
      event.preventDefault();
      const data = new FormData(planner);
      const days = Number(data.get("days"));
      const pace = days <= 3 ? "una ruta esencial y pausada" : days <= 5 ? "una ruta equilibrada con tiempo para descansar" : "una ruta amplia para explorar sin prisa";
      planResult.hidden = false;
      planResult.innerHTML = "<strong>Tu punto de partida</strong>Para " + data.get("travelers") + " en " + data.get("month") + ", sugerimos " + pace + ", centrada en " + String(data.get("interest")).toLowerCase() + ". Esta propuesta es informativa y no genera una reserva.";
      planResult.focus({ preventScroll: true });
    });
  }

  if (newsletter && newsletterStatus) {
    newsletter.addEventListener("submit", function (event) {
      event.preventDefault();
      newsletterStatus.textContent = "Gracias. La suscripción estará disponible cuando se conecte el servicio de correo; tus datos no fueron enviados.";
    });
  }
})();
