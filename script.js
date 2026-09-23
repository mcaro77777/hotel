(function () {
  'use strict';
  const $ = (selector) => document.querySelector(selector);
  const all = (selector) => Array.from(document.querySelectorAll(selector));
  const whatsapp = (message) => 'https://wa.me/56984373730?text=' + encodeURIComponent(message);
  const money = (value) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(value);
  const today = () => {
    const date = new Date();
    return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
  };
  const dateNumber = (value) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return NaN;
    const [year, month, day] = value.split('-').map(Number);
    const stamp = Date.UTC(year, month - 1, day);
    return new Date(stamp).toISOString().slice(0, 10) === value ? stamp : NaN;
  };
  const nextDate = (value) => new Date(dateNumber(value) + 86400000).toISOString().slice(0, 10);
  const dateLabel = (value) => new Intl.DateTimeFormat('es-CL', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(dateNumber(value)));
  const motion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
  $('#year').textContent = new Date().getFullYear();

  const menu = $('.main-nav');
  const menuButton = $('.menu-toggle');
  function closeMenu() {
    menu.classList.remove('open'); menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Abrir menú'); document.body.classList.remove('menu-open');
  }
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menu.classList.toggle('open', open); menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú'); document.body.classList.toggle('menu-open', open);
  });
  all('.main-nav a').forEach((link) => link.addEventListener('click', closeMenu));
  window.matchMedia('(min-width: 981px)').addEventListener('change', closeMenu);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menu.classList.contains('open')) { closeMenu(); menuButton.focus(); }
  });

  let kind = 'all';
  const capacityFilter = $('#capacity-filter');
  function filterStays() {
    let count = 0;
    all('.stay-card').forEach((card) => {
      const show = (kind === 'all' || card.dataset.kind === kind) && Number(card.dataset.capacity) >= Number(capacityFilter.value);
      card.hidden = !show; if (show) count++;
    });
    $('#filter-status').textContent = count + (count === 1 ? ' alojamiento para descubrir' : ' alojamientos para descubrir');
    $('#empty-state').hidden = count > 0;
    all('[data-filter]').forEach((button) => {
      const active = button.dataset.filter === kind;
      button.classList.toggle('active', active); button.setAttribute('aria-pressed', String(active));
    });
  }
  all('[data-filter]').forEach((button) => button.addEventListener('click', () => { kind = button.dataset.filter; filterStays(); }));
  capacityFilter.addEventListener('change', filterStays);
  $('#reset-filters').addEventListener('click', () => { kind = 'all'; capacityFilter.value = '0'; filterStays(); $('[data-filter="all"]').focus(); });

  // A native dialog provides Escape handling and restores focus to its opener.
  const dialog = $('#photo-dialog');
  let activeGallery = null;
  function updateDialog() {
    if (!activeGallery) return;
    const { images, alts, index, name } = activeGallery;
    $('#photo-title').textContent = name; $('#photo-image').src = images[index];
    $('#photo-image').alt = alts[index] || name;
    $('#photo-caption').textContent = (index + 1) + ' / ' + images.length + ' · ' + (alts[index] || name);
  }
  all('[data-gallery]').forEach((gallery) => {
    const state = { images: JSON.parse(gallery.dataset.images), alts: JSON.parse(gallery.dataset.alts), index: 0, name: gallery.closest('.stay-card').querySelector('h3').textContent };
    const image = gallery.querySelector('img');
    const show = (delta) => {
      state.index = (state.index + delta + state.images.length) % state.images.length;
      image.src = state.images[state.index]; image.alt = state.alts[state.index] || state.name;
      gallery.querySelector('.gallery-count').textContent = (state.index + 1) + ' / ' + state.images.length;
    };
    state.show = show;
    gallery.querySelector('.gallery-prev').addEventListener('click', () => show(-1));
    gallery.querySelector('.gallery-next').addEventListener('click', () => show(1));
    const expand = document.createElement('button');
    expand.type = 'button'; expand.className = 'gallery-expand'; expand.textContent = 'Ampliar fotos ↗';
    expand.setAttribute('aria-label', 'Ampliar fotos de ' + state.name);
    gallery.querySelector('figcaption').prepend(expand);
    expand.addEventListener('click', () => {
      activeGallery = state; updateDialog(); dialog.showModal(); document.body.classList.add('gallery-open');
    });
    let touchStart = null;
    gallery.addEventListener('touchstart', (event) => { touchStart = [event.changedTouches[0].clientX, event.changedTouches[0].clientY]; }, { passive: true });
    gallery.addEventListener('touchend', (event) => {
      if (!touchStart) return;
      const dx = event.changedTouches[0].clientX - touchStart[0]; const dy = event.changedTouches[0].clientY - touchStart[1];
      if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.5) show(dx < 0 ? 1 : -1);
      touchStart = null;
    }, { passive: true });
  });
  function stepPhoto(delta) { if (activeGallery) { activeGallery.show(delta); updateDialog(); } }
  $('#photo-prev').addEventListener('click', () => stepPhoto(-1)); $('#photo-next').addEventListener('click', () => stepPhoto(1));
  $('#photo-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => document.body.classList.remove('gallery-open'));
  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); stepPhoto(event.key === 'ArrowLeft' ? -1 : 1); }
  });
  dialog.addEventListener('click', (event) => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });

  const form = $('#booking-form'), accommodation = $('#booking-accommodation'), checkIn = $('#check-in'), checkOut = $('#check-out');
  const adults = $('#adults'), children = $('#children'), result = $('#booking-result'), error = $('#booking-error'), estimate = $('#estimate');
  checkIn.min = today(); checkOut.min = nextDate(today());
  function details() {
    const option = accommodation.selectedOptions[0];
    const nights = (dateNumber(checkOut.value) - dateNumber(checkIn.value)) / 86400000;
    return { option, nights, price: Number(option.dataset.price), guests: Number(adults.value) + Number(children.value), capacity: Number(option.dataset.capacity) };
  }
  function validation() {
    const data = details();
    if (!accommodation.value) return 'Elige un alojamiento para preparar tu consulta.';
    if (!Number.isFinite(dateNumber(checkIn.value)) || !Number.isFinite(dateNumber(checkOut.value))) return 'Indica las fechas de llegada y salida.';
    if (checkIn.value < today()) return 'La llegada debe ser hoy o una fecha posterior.';
    if (data.nights < 1) return 'La salida debe ser posterior a la llegada.';
    if (data.guests > data.capacity) return data.option.textContent + ' admite hasta ' + data.capacity + (data.capacity === 1 ? ' persona.' : ' personas.') + ' Elige una alternativa más amplia o consulta por varios alojamientos en Contacto.';
    return '';
  }
  function refreshEstimate() {
    error.hidden = true;
    const data = details();
    const ready = accommodation.value && Number.isFinite(data.nights) && data.nights > 0 && checkIn.value >= today();
    estimate.querySelector('span').textContent = ready ? data.nights + (data.nights === 1 ? ' noche' : ' noches') + ' × ' + money(data.price) + ' CLP' : 'Una idea de tu estadía';
    estimate.querySelector('strong').textContent = ready ? money(data.nights * data.price) + ' CLP · estimado' : 'Selecciona alojamiento y fechas';
    if (accommodation.value && data.guests > data.capacity) {
      error.textContent = 'Este alojamiento admite hasta ' + data.capacity + (data.capacity === 1 ? ' persona.' : ' personas.') + ' Ajusta los huéspedes o elige otra alternativa.'; error.hidden = false;
    }
  }
  form.addEventListener('input', refreshEstimate); form.addEventListener('change', refreshEstimate);
  checkIn.addEventListener('change', () => {
    checkOut.min = Number.isFinite(dateNumber(checkIn.value)) ? nextDate(checkIn.value) : nextDate(today());
    if (checkOut.value && checkOut.value < checkOut.min) checkOut.value = '';
    refreshEstimate();
  });
  function editQuery() { result.hidden = true; form.hidden = false; }
  all('[data-stay]').forEach((button) => button.addEventListener('click', () => {
    editQuery(); accommodation.value = button.dataset.stay;
    refreshEstimate(); $('#consulta').scrollIntoView({ behavior: motion(), block: 'start' }); checkIn.focus({ preventScroll: true });
  }));
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const problem = validation();
    if (problem) { error.textContent = problem; error.hidden = false; error.tabIndex = -1; error.focus(); return; }
    const data = details();
    const summary = data.option.textContent + '\nLlegada: ' + dateLabel(checkIn.value) + '\nSalida: ' + dateLabel(checkOut.value) + '\n' + adults.value + (adults.value === '1' ? ' adulto' : ' adultos') + ' · ' + children.value + (children.value === '1' ? ' niño' : ' niños') + '\n' + data.nights + (data.nights === 1 ? ' noche' : ' noches') + ' · Estimación: ' + money(data.nights * data.price) + ' CLP\nTarifa referencial, sujeta a confirmación.';
    const message = 'Iorana, quisiera consultar disponibilidad en Aorangi Hare.\n\n' + summary + '\n\n¿Podrían confirmar disponibilidad, valor final y condiciones de la reserva?';
    $('#inquiry-summary').textContent = summary; $('#inquiry-whatsapp').href = whatsapp(message);
    $('#inquiry-email').href = 'mailto:aorangihare@gmail.com?subject=' + encodeURIComponent('Consulta de estadía · ' + data.option.textContent) + '&body=' + encodeURIComponent(message);
    form.hidden = true; result.hidden = false; result.tabIndex = -1; result.focus({ preventScroll: true }); result.scrollIntoView({ behavior: motion(), block: 'center' });
  });
  $('#edit-query').addEventListener('click', () => { editQuery(); accommodation.focus(); });
  all('[data-guest-message]').forEach((link) => { link.href = whatsapp(link.dataset.guestMessage); link.target = '_blank'; link.rel = 'noopener noreferrer'; });
})();
