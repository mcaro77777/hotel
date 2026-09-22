(function () {
  "use strict";

  const header = document.querySelector(".site-header");
  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".main-nav");
  const year = document.querySelector("#year");
  const bookingForm = document.querySelector("#booking-form");
  const bookingResult = document.querySelector("#booking-result");
  const accommodationSelect = document.querySelector("#booking-accommodation");
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
    navigation.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeMenu();
    });
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

  document.querySelectorAll("[data-gallery]").forEach(function (gallery) {
    const image = gallery.querySelector("img");
    const count = gallery.querySelector(".gallery-count");
    const images = JSON.parse(gallery.dataset.images || "[]");
    const alts = JSON.parse(gallery.dataset.alts || "[]");
    let current = 0;

    function showImage(index) {
      current = (index + images.length) % images.length;
      image.src = images[current];
      image.alt = alts[current] || "Fotografía del alojamiento";
      if (count) count.textContent = (current + 1) + " / " + images.length;
    }

    gallery.querySelector(".gallery-prev").addEventListener("click", function () {
      showImage(current - 1);
    });
    gallery.querySelector(".gallery-next").addEventListener("click", function () {
      showImage(current + 1);
    });
  });

  const stayFilters = document.querySelectorAll("[data-filter]");
  const stayCards = document.querySelectorAll(".stay-card[data-kind]");
  stayFilters.forEach(function (filter) {
    filter.addEventListener("click", function () {
      const kind = filter.dataset.filter;
      stayFilters.forEach(function (item) {
        const active = item === filter;
        item.classList.toggle("active", active);
        item.setAttribute("aria-pressed", String(active));
      });
      stayCards.forEach(function (card) {
        card.hidden = kind !== "all" && card.dataset.kind !== kind;
      });
    });
  });

  const guests = { adults: 2, children: 0, rooms: 1 };
  const guestLimits = { adults: [1, 12], children: [0, 10], rooms: [1, 4] };

  function updateOccupancy() {
    if (!occupancySummary) return;
    occupancySummary.textContent = guests.adults + (guests.adults === 1 ? " adulto" : " adultos") + " · " + guests.children + (guests.children === 1 ? " niño" : " niños") + " · " + guests.rooms + (guests.rooms === 1 ? " alojamiento" : " alojamientos");
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

  function showBookingResult(title, message, isError) {
    if (!bookingResult) return;
    const heading = document.createElement("strong");
    heading.textContent = title;
    bookingResult.replaceChildren(heading, document.createTextNode(message));
    bookingResult.classList.toggle("is-error", Boolean(isError));
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

  function localInputDate(date) {
    const yearValue = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return yearValue + "-" + month + "-" + day;
  }

  if (bookingForm && bookingResult && accommodationSelect) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const checkIn = bookingForm.querySelector("#check-in");
    const checkOut = bookingForm.querySelector("#check-out");
    checkIn.min = localInputDate(today);
    checkOut.min = localInputDate(tomorrow);

    checkIn.addEventListener("change", function () {
      if (!checkIn.value) return;
      const nextDay = new Date(checkIn.value + "T12:00:00");
      nextDay.setDate(nextDay.getDate() + 1);
      checkOut.min = localInputDate(nextDay);
      if (checkOut.value && checkOut.value <= checkIn.value) checkOut.value = "";
    });

    bookingForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const selected = accommodationSelect.options[accommodationSelect.selectedIndex];
      const capacityPerUnit = Number(selected.dataset.capacity || 0);
      const totalGuests = guests.adults + guests.children;
      const totalCapacity = capacityPerUnit * guests.rooms;
      if (totalGuests > totalCapacity) {
        showBookingResult("La capacidad no es suficiente", selected.textContent + " admite hasta " + totalCapacity + (totalCapacity === 1 ? " huésped" : " huéspedes") + " con la cantidad seleccionada. Ajusta los huéspedes, agrega otro alojamiento o elige una alternativa más amplia.", true);
        return;
      }
      const data = new FormData(bookingForm);
      showBookingResult("Consulta preparada", selected.textContent + " · tarifa referencial " + selected.dataset.price + " por noche · del " + data.get("checkIn") + " al " + data.get("checkOut") + " · " + occupancySummary.textContent + ". La disponibilidad, condiciones y valor final deben ser confirmados por Aorangi Hare.", false);
    });

    document.querySelectorAll("[data-stay]").forEach(function (button) {
      button.addEventListener("click", function () {
        accommodationSelect.value = button.dataset.stay;
        bookingForm.scrollIntoView({ behavior: "smooth", block: "center" });
        window.setTimeout(function () { accommodationSelect.focus({ preventScroll: true }); }, 450);
      });
    });
  }

  if (contactForm && contactStatus) {
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();
      contactStatus.textContent = "Tu consulta quedó preparada. El envío estará disponible cuando se conecte el formulario; por ahora tus datos no fueron enviados.";
    });
  }
})();
