/* =============================================
   BUBA INterijeri dizajn — Main JavaScript
   ============================================= */

(function () {
  'use strict';

  /* ---- Navbar scroll effect ---- */
  var navbar    = document.getElementById('navbar');
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
  var navLinks  = document.getElementById('navLinks');

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

  /* =============================================
     GALLERY — two-view system
     ============================================= */
  var galCategories = document.getElementById('galCategories');
  var galImages     = document.getElementById('galImages');
  var galGrid       = document.getElementById('galGrid');
  var galCatTitle   = document.getElementById('galCatTitle');
  var galCatCount   = document.getElementById('galCatCount');
  var galBackBtn    = document.getElementById('galBack');
  var galSection    = document.querySelector('.gal-section');

  var allItems      = Array.from(document.querySelectorAll('.gal-item'));
  var activeCategory = null;

  /* Show images of a category */
  function openCategory(category, label, count) {
    activeCategory = category;

    /* Update header */
    galCatTitle.textContent  = label;
    galCatCount.textContent  = count + ' fotografija';

    /* Show/hide items */
    allItems.forEach(function (item) {
      if (item.dataset.category === category) {
        item.classList.remove('gal-hidden');
      } else {
        item.classList.add('gal-hidden');
      }
    });

    /* Switch views */
    galCategories.classList.add('gal-hidden');
    galImages.classList.remove('gal-hidden');

    /* Scroll to gallery top */
    galSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* Return to category cards */
  function closeCategory() {
    galImages.classList.add('gal-hidden');
    galCategories.classList.remove('gal-hidden');
    activeCategory = null;
  }

  /* Attach click to category cards */
  document.querySelectorAll('.gal-cat-card').forEach(function (card) {
    card.addEventListener('click', function () {
      openCategory(
        card.dataset.category,
        card.dataset.label,
        card.dataset.count
      );
    });
  });

  /* Back button */
  if (galBackBtn) {
    galBackBtn.addEventListener('click', closeCategory);
  }

  /* =============================================
     LIGHTBOX
     ============================================= */
  var lightbox  = document.getElementById('lightbox');
  var lbImg     = document.getElementById('lbImg');
  var lbLabel   = document.getElementById('lbLabel');
  var lbCounter = document.getElementById('lbCounter');
  var lbClose   = document.getElementById('lbClose');
  var lbPrev    = document.getElementById('lbPrev');
  var lbNext    = document.getElementById('lbNext');

  var lbItems  = [];   /* visible items at time of open */
  var lbIndex  = 0;

  function getVisibleItems() {
    return allItems.filter(function (item) {
      return !item.classList.contains('gal-hidden');
    });
  }

  function openLightbox(index) {
    lbItems = getVisibleItems();
    lbIndex = index;
    renderLightbox();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    lbImg.src = '';
  }

  function renderLightbox() {
    var item  = lbItems[lbIndex];
    var img   = item.querySelector('img');
    lbImg.src         = img.src;
    lbImg.alt         = img.alt;
    lbLabel.textContent   = galCatTitle.textContent;
    lbCounter.textContent = (lbIndex + 1) + ' / ' + lbItems.length;
  }

  function goPrev() {
    lbIndex = (lbIndex - 1 + lbItems.length) % lbItems.length;
    renderLightbox();
  }

  function goNext() {
    lbIndex = (lbIndex + 1) % lbItems.length;
    renderLightbox();
  }

  /* Click on image → open lightbox */
  allItems.forEach(function (item) {
    item.addEventListener('click', function () {
      var visible = getVisibleItems();
      var idx     = visible.indexOf(item);
      if (idx >= 0) openLightbox(idx);
    });
  });

  lbClose.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', goPrev);
  lbNext.addEventListener('click', goNext);

  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  goPrev();
    if (e.key === 'ArrowRight') goNext();
  });

  /* Swipe support */
  var touchStartX = 0;
  lightbox.addEventListener('touchstart', function (e) {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  lightbox.addEventListener('touchend', function (e) {
    var dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) { dx < 0 ? goNext() : goPrev(); }
  }, { passive: true });

  /* ---- Contact form ---- */
  var form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn      = form.querySelector('button[type="submit"]');
      var original = btn.textContent;
      btn.textContent = 'Poruka poslana ✓';
      btn.classList.add('success');
      setTimeout(function () {
        btn.textContent = original;
        btn.classList.remove('success');
        form.reset();
      }, 3500);
    });
  }

  /* Initial state */
  onScroll();

})();
