/* =============================================
   BUBA INterijeri dizajn — Main JavaScript
   ============================================= */

(function () {
  'use strict';

  /* ---- Navbar scroll effect ---- */
  var navbar = document.getElementById('navbar');
  var backToTop = document.getElementById('backToTop');

  function onScroll() {
    var y = window.scrollY;
    navbar.classList.toggle('scrolled', y > 80);
    backToTop.classList.toggle('visible', y > 500);
    updateActiveNav();
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---- Mobile menu ---- */
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', function () {
    var open = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', String(open));
  });

  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---- Active nav link ---- */
  var sections = Array.from(document.querySelectorAll('section[id]'));
  var navItems = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));

  function updateActiveNav() {
    var current = '';
    sections.forEach(function (sec) {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    navItems.forEach(function (a) {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }

  /* ---- Scroll-reveal ---- */
  var fadeEls = document.querySelectorAll('.fade-up');

  if ('IntersectionObserver' in window) {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    fadeEls.forEach(function (el) { revealObs.observe(el); });
  } else {
    fadeEls.forEach(function (el) { el.classList.add('in-view'); });
  }

  /* ---- EmailJS init ---- */
  if (typeof emailjs !== 'undefined') {
    emailjs.init('z_P96eL1X_Ng_Pdyi');
  }

  /* ---- Contact form ---- */
  var form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Validate all required fields
      var fields = Array.from(form.querySelectorAll('[required]'));
      var valid = true;
      fields.forEach(function (field) {
        var val = field.value.trim();
        var ok = true;

        if (!val) {
          ok = false;
        } else if (field.type === 'email') {
          ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
        } else if (field.type === 'tel') {
          ok = /^\+?[\d\s\-()]{7,20}$/.test(val);
        }

        field.classList.toggle('field-error', !ok);
        if (!ok) valid = false;
      });
      if (!valid) return;

      var btn = form.querySelector('button[type="submit"]');
      var original = btn.textContent;
      btn.textContent = 'Slanje…';
      btn.disabled = true;

      emailjs.sendForm('service_lwbdvd8', 'template_5zfk6fl', form)
        .then(function () {
          btn.textContent = 'Poruka poslana ✓';
          btn.classList.add('success');
          form.reset();
          setTimeout(function () {
            btn.textContent = original;
            btn.classList.remove('success');
            btn.disabled = false;
          }, 3500);
        })
        .catch(function () {
          btn.textContent = 'Greška — pokušajte ponovo';
          setTimeout(function () {
            btn.textContent = original;
            btn.disabled = false;
          }, 3500);
        });
    });

    // Clear error highlight once field becomes valid
    form.querySelectorAll('[required]').forEach(function (field) {
      field.addEventListener('input', function () {
        var val = field.value.trim();
        var ok = false;
        if (field.type === 'email') {
          ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
        } else if (field.type === 'tel') {
          ok = /^\+?[\d\s\-()]{7,20}$/.test(val);
        } else {
          ok = val.length > 0;
        }
        if (ok) field.classList.remove('field-error');
      });
    });
  }

  /* Initial state */
  onScroll();

})();
