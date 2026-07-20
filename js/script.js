// ===================================================
// ESCUELA DEL SOL — script.js
// ===================================================

document.addEventListener('DOMContentLoaded', function () {

  // ---------- Hamburger / mobile nav ----------
  const hamburger  = document.querySelector('.hamburger');
  const mobileNav  = document.querySelector('.nav-mobile');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', function () {
      const isOpen = mobileNav.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen);
      // Animate bars
      const bars = hamburger.querySelectorAll('span');
      if (isOpen) {
        bars[0].style.transform = 'translateY(8px) rotate(45deg)';
        bars[1].style.opacity   = '0';
        bars[2].style.transform = 'translateY(-8px) rotate(-45deg)';
      } else {
        bars.forEach(b => { b.style.transform = ''; b.style.opacity = ''; });
      }
    });
  }

  // ---------- Mobile sub-menus accordion ----------
  const mobToggles = document.querySelectorAll('.mob-toggle');
  mobToggles.forEach(function (toggle) {
    toggle.addEventListener('click', function () {
      const row = toggle.closest('.mob-parent-row');
      const sub = row && row.nextElementSibling;
      if (sub && sub.classList.contains('mob-sub')) {
        const isOpen = sub.style.display === 'block';
        // Close all others
        document.querySelectorAll('.mob-sub').forEach(s => s.style.display = 'none');
        sub.style.display = isOpen ? 'none' : 'block';
      }
    });
  });

  // ---------- Mark active nav link ----------
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .nav-mobile a').forEach(function (link) {
    const href = link.getAttribute('href');
    if (href && href.split('/').pop() === currentPage) {
      link.classList.add('active');
    }
  });

  // ---------- Cursor blink on banner ----------
  const banner = document.querySelector('.site-banner');
  if (banner) {
    const text = banner.textContent;
    if (text.endsWith('|')) {
      let show = true;
      setInterval(function () {
        banner.textContent = show ? text : text.slice(0, -1) + ' ';
        show = !show;
      }, 600);
    }
  }

  // ---------- Smooth scroll for anchor links ----------
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ---------- Lightbox (click a photo to enlarge) ----------
  const lightboxImgs = document.querySelectorAll('.lightbox-img');
  if (lightboxImgs.length) {
    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.innerHTML = '<span class="lightbox-close">&times;</span><img class="lightbox-overlay-img">';
    document.body.appendChild(overlay);
    const overlayImg = overlay.querySelector('.lightbox-overlay-img');

    lightboxImgs.forEach(function (img) {
      img.addEventListener('click', function () {
        overlayImg.src = img.getAttribute('src');
        overlay.classList.add('open');
      });
    });

    overlay.addEventListener('click', function () {
      overlay.classList.remove('open');
    });
  }

  // ---------- Formulario Exalumnos -> Google Sheets ----------
  const formExalumnos = document.getElementById('form-exalumnos');
  if (formExalumnos) {
    // Pegá acá la URL de tu Google Apps Script Web App una vez que la publiques.
    const EXALUMNOS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz7CLEmq0XiRi0ocPOw6sklrpaFcRLl-0gE-l3p4T_rS_0jdKRolm9L0hmMahvqyI4V/exec';

    formExalumnos.addEventListener('submit', function (e) {
      e.preventDefault();
      const statusEl = document.getElementById('form-exalumnos-status');
      const submitBtn = formExalumnos.querySelector('button[type="submit"]');

      if (EXALUMNOS_SCRIPT_URL.indexOf('PEGAR_AQUI') !== -1) {
        statusEl.textContent = 'El formulario todavía no está conectado a la planilla.';
        statusEl.style.display = 'block';
        return;
      }

      submitBtn.disabled = true;
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Enviando...';

      fetch(EXALUMNOS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: new FormData(formExalumnos)
      }).then(function () {
        statusEl.textContent = '¡Gracias! Tus datos fueron enviados correctamente.';
        statusEl.style.display = 'block';
        formExalumnos.reset();
      }).catch(function () {
        statusEl.textContent = 'Hubo un problema al enviar. Probá de nuevo en un momento.';
        statusEl.style.display = 'block';
      }).finally(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      });
    });
  }

  // ---------- Carousel ----------
  document.querySelectorAll('.carousel').forEach(function (carousel) {
    const slides = carousel.querySelectorAll('.carousel-slide');
    const dots = carousel.querySelectorAll('.carousel-dot');
    let index = 0;
    let timer;

    function show(i) {
      index = (i + slides.length) % slides.length;
      slides.forEach(function (s, j) { s.classList.toggle('active', j === index); });
      dots.forEach(function (d, j) { d.classList.toggle('active', j === index); });
    }

    function startAuto() {
      timer = setInterval(function () { show(index + 1); }, 3500);
    }

    const prevBtn = carousel.querySelector('.carousel-arrow.prev');
    const nextBtn = carousel.querySelector('.carousel-arrow.next');
    if (prevBtn) prevBtn.addEventListener('click', function () { show(index - 1); clearInterval(timer); startAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { show(index + 1); clearInterval(timer); startAuto(); });
    dots.forEach(function (d, j) {
      d.addEventListener('click', function () { show(j); clearInterval(timer); startAuto(); });
    });

    carousel.addEventListener('mouseenter', function () { clearInterval(timer); });
    carousel.addEventListener('mouseleave', startAuto);

    show(0);
    startAuto();
  });

});
