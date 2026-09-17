(function () {
  "use strict";

  const header = document.querySelector(".site-header");
  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".main-nav");
  const year = document.querySelector("#year");
  const bookingForm = document.querySelector("#booking-form");
  const bookingResult = document.querySelector("#booking-result");
  const occupancyToggle = document.querySelector("#occupancy-toggle");
  const occupancyPanel = document.querySelector("#occupancy-panel");
  const occupancyDone = document.querySelector("#occupancy-done");
  const occupancySummary = document.querySelector("#occupancy-summary");
  const contactForm = document.querySelector("#contact-form");
  const contactStatus = document.querySelector("#contact-status");

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

  const guests = { adults: 2, children: 0, rooms: 1 };
  const guestLimits = { adults: [1, 12], children: [0, 10], rooms: [1, 8] };

  function updateOccupancy() {
    if (!occupancySummary) return;
    occupancySummary.textContent = guests.adults + (guests.adults === 1 ? " adulto" : " adultos") + " · " + guests.children + (guests.children === 1 ? " niño" : " niños") + " · " + guests.rooms + (guests.rooms === 1 ? " habitación" : " habitaciones");
    Object.keys(guests).forEach(function (key) {
      const output = document.querySelector("#" + key + "-count");
      if (output) output.textContent = String(guests[key]);
    });
  }

  function closeOccupancy() {
    if (!occupancyToggle || !occupancyPanel) return;
    occupancyPanel.hidden = true;
    occupancyToggle.setAttribute("aria-expanded", "false");
  }

  function showBookingResult(title, message) {
    if (!bookingResult) return;
    const heading = document.createElement("strong");
    heading.textContent = title;
    bookingResult.replaceChildren(heading, document.createTextNode(message));
    bookingResult.hidden = false;
  }

  if (occupancyToggle && occupancyPanel) {
    occupancyToggle.addEventListener("click", function () {
      const opening = occupancyPanel.hidden;
      occupancyPanel.hidden = !opening;
      occupancyToggle.setAttribute("aria-expanded", String(opening));
    });
    occupancyPanel.querySelectorAll("[data-counter]").forEach(function (button) {
      button.addEventListener("click", function () {
        const key = button.dataset.counter;
        const limits = guestLimits[key];
        guests[key] = Math.min(limits[1], Math.max(limits[0], guests[key] + Number(button.dataset.step)));
        updateOccupancy();
      });
    });
    if (occupancyDone) occupancyDone.addEventListener("click", closeOccupancy);
    document.addEventListener("click", function (event) {
      if (!occupancyPanel.hidden && !event.target.closest(".occupancy-field")) closeOccupancy();
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !occupancyPanel.hidden) closeOccupancy();
    });
  }

  if (bookingForm && bookingResult) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const checkIn = bookingForm.querySelector("#check-in");
    const checkOut = bookingForm.querySelector("#check-out");
    const toInputDate = function (date) { return date.toISOString().split("T")[0]; };
    checkIn.min = toInputDate(today);
    checkOut.min = toInputDate(tomorrow);
    checkIn.addEventListener("change", function () {
      if (!checkIn.value) return;
      const nextDay = new Date(checkIn.value + "T12:00:00");
      nextDay.setDate(nextDay.getDate() + 1);
      checkOut.min = toInputDate(nextDay);
      if (checkOut.value && checkOut.value <= checkIn.value) checkOut.value = "";
    });

    bookingForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const data = new FormData(bookingForm);
      showBookingResult("Búsqueda preparada", data.get("destination") + ", del " + data.get("checkIn") + " al " + data.get("checkOut") + ", para " + occupancySummary.textContent + ". La disponibilidad y los precios aparecerán cuando se conecte el motor de reservas.");
    });

    document.querySelectorAll("[data-stay]").forEach(function (button) {
      button.addEventListener("click", function () {
        showBookingResult(button.dataset.stay, "Selecciona las fechas y los huéspedes para consultar este alojamiento cuando el motor de reservas esté conectado.");
        bookingForm.scrollIntoView({ behavior: "smooth", block: "center" });
        checkIn.focus({ preventScroll: true });
      });
    });
  }

  if (contactForm && contactStatus) {
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();
      contactStatus.textContent = "La consulta está lista. El envío estará disponible cuando se conecte el formulario; tus datos no fueron enviados.";
    });
  }
})();
