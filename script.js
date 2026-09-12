/* =========================================================
   PORTFOLIO — script.js
   Vanilla JS only. No dependencies.
   ========================================================= */
(function () {
  'use strict';

  /* ---------- Progressive Enhancement Marker ---------- */
  document.documentElement.classList.add('js');

  /* ---------- Safe Storage Utilities ---------- */
  function safeGetStorage(key, fallback) {
    try {
      var val = localStorage.getItem(key);
      return val !== null ? val : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function safeSetStorage(key, val) {
    try {
      localStorage.setItem(key, val);
    } catch (e) {}
  }

  /* ---------- Unified Scroll-Lock Manager ---------- */
  var scrollLockCount = 0;
  var lockedScrollY = 0;

  function lockScroll() {
    if (scrollLockCount === 0) {
      lockedScrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
      document.body.style.position = 'fixed';
      document.body.style.top = -lockedScrollY + 'px';
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    }
    scrollLockCount++;
  }

  function unlockScroll() {
    if (scrollLockCount <= 0) return;
    scrollLockCount--;
    if (scrollLockCount === 0) {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      window.scrollTo(0, lockedScrollY);
    }
  }

  /* ---------- Mobile Nav Toggle & Offcanvas ---------- */
  var navToggle = document.getElementById('navToggle');
  var sidenav   = document.getElementById('sidenav');
  var navScrim  = document.getElementById('navScrim');

  function openNav() {
    if (!sidenav || !navToggle || !navScrim) return;
    sidenav.classList.add('is-open');
    navToggle.classList.add('is-open');
    navScrim.classList.add('is-visible');
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', 'Tutup menu navigasi');
    sidenav.setAttribute('aria-hidden', 'false');
    sidenav.removeAttribute('inert');
    lockScroll();
  }

  function closeNav(skipFocus) {
    if (!sidenav || !sidenav.classList.contains('is-open')) return;
    sidenav.classList.remove('is-open');
    if (navToggle) {
      navToggle.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Buka menu navigasi');
    }
    if (navScrim) navScrim.classList.remove('is-visible');
    if (window.innerWidth <= 1000) {
      sidenav.setAttribute('aria-hidden', 'true');
      sidenav.setAttribute('inert', '');
    }
    unlockScroll();
    if (!skipFocus && navToggle && typeof navToggle.focus === 'function') {
      navToggle.focus();
    }
  }

  if (navToggle) {
    navToggle.addEventListener('click', function () {
      if (sidenav && sidenav.classList.contains('is-open')) {
        closeNav();
      } else {
        openNav();
      }
    });
  }

  if (navScrim) {
    navScrim.addEventListener('click', function () {
      closeNav();
    });
  }

  var navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      if (window.innerWidth <= 1000) {
        closeNav(true);
      }
    });
  });

  function handleNavResponsiveState() {
    if (!sidenav) return;
    if (window.innerWidth > 1000) {
      if (sidenav.classList.contains('is-open')) {
        closeNav(true);
      }
      sidenav.setAttribute('aria-hidden', 'false');
      sidenav.removeAttribute('inert');
    } else {
      if (!sidenav.classList.contains('is-open')) {
        sidenav.setAttribute('aria-hidden', 'true');
        sidenav.setAttribute('inert', '');
      }
    }
  }
  window.addEventListener('resize', handleNavResponsiveState);
  window.addEventListener('orientationchange', function () {
    if (sidenav && sidenav.classList.contains('is-open')) {
      closeNav(true);
    }
    handleNavResponsiveState();
  });
  handleNavResponsiveState();

  /* ---------- Smooth Scroll (Preserve hash & offset) ---------- */
  navLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      var targetId = link.getAttribute('href');
      if (!targetId || targetId.charAt(0) !== '#') return;
      var target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', targetId);
    });
  });

  /* ---------- Scroll-Spy: Highlight Active Nav Link ---------- */
  var sections = Array.prototype.slice.call(document.querySelectorAll('main .section'));

  function updateActiveLink() {
    if (sections.length === 0) return;
    var scrollPos = window.scrollY + window.innerHeight * 0.35;
    var current = sections[0];
    sections.forEach(function (sec) {
      if (sec.offsetTop <= scrollPos) current = sec;
    });
    navLinks.forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current.id);
    });
  }

  /* ---------- Fade-in on Scroll (IntersectionObserver) ---------- */
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fadeEls = document.querySelectorAll('.fade-in');

  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0, /* Crucial: 0 threshold so long sections (e.g. 24 blog cards) reveal immediately */
      rootMargin: '0px 0px -40px 0px'
    });

    fadeEls.forEach(function (el) { io.observe(el); });
  } else {
    // Fallback: no observer or reduced motion, reveal all immediately
    fadeEls.forEach(function (el) { el.classList.add('in-view'); });
  }

  /* ---------- Back-to-top Button ---------- */
  var toTop = document.getElementById('toTop');
  function updateToTop() {
    if (toTop) {
      toTop.classList.toggle('visible', window.scrollY > 400);
    }
  }
  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Scroll Listener (Throttled via rAF) ---------- */
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        updateActiveLink();
        updateToTop();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
  updateActiveLink();
  updateToTop();

  /* ---------- Hero Typewriter ---------- */
  var roles = [
    'website yang responsif.',
    'UI yang nyaman digunakan.',
    'sistem yang efisien dan cepat.',
    'setiap detail dengan teliti.'
  ];
  var twEl = document.getElementById('typewriter');

  if (twEl) {
    var roleIndex = 0, charIndex = 0, deleting = false;
    var TYPE_SPEED = 55, DELETE_SPEED = 30, HOLD = 1400, GAP = 400;

    function tick() {
      var word = roles[roleIndex];

      if (!deleting) {
        charIndex++;
        twEl.textContent = word.slice(0, charIndex);
        if (charIndex === word.length) {
          deleting = true;
          return setTimeout(tick, HOLD);
        }
        return setTimeout(tick, TYPE_SPEED);
      }

      charIndex--;
      twEl.textContent = word.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        return setTimeout(tick, GAP);
      }
      setTimeout(tick, DELETE_SPEED);
    }
    tick();
  }

  /* ---------- Contact Form (Mailto Generator) ---------- */
  var form = document.getElementById('contactForm');
  var status = document.getElementById('formStatus');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.name.value.trim();
      var email = form.email.value.trim();
      var message = form.message.value.trim();

      if (!form.checkValidity() || !name || !email || !message) {
        status.textContent = 'Mohon lengkapi semua kolom dengan benar.';
        status.style.color = '#d4746c';
        return;
      }

      var mailtoUrl = 'mailto:ruliyanradith@gmail.com' +
        '?subject=' + encodeURIComponent('Pesan Portofolio — ' + name) +
        '&body=' + encodeURIComponent('Nama: ' + name + '\nEmail: ' + email + '\n\nPesan:\n' + message);

      window.location.href = mailtoUrl;

      status.style.color = '';
      status.textContent = 'Terima kasih, ' + name + '! Aplikasi email Anda dibuka untuk mengirimkan pesan ini.';
      form.reset();
    });
  }

  /* ---------- Dark/Light Mode Theme Toggle ---------- */
  var themeToggle = document.getElementById('themeToggle');
  var themeToggleIcon = themeToggle ? themeToggle.querySelector('i') : null;

  var systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  var savedTheme = safeGetStorage('theme', null);
  var currentTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');

  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);

  function updateThemeIcon(theme) {
    if (!themeToggleIcon) return;
    if (theme === 'dark') {
      themeToggleIcon.className = 'fa-solid fa-sun';
      if (themeToggle) themeToggle.setAttribute('aria-label', 'Ganti ke mode terang');
    } else {
      themeToggleIcon.className = 'fa-solid fa-moon';
      if (themeToggle) themeToggle.setAttribute('aria-label', 'Ganti ke mode gelap');
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', function (e) {
      var activeTheme = document.documentElement.getAttribute('data-theme');
      var newTheme = activeTheme === 'dark' ? 'light' : 'dark';

      // If View Transition unsupported or reduced motion requested, apply immediately
      if (!document.startViewTransition || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.documentElement.setAttribute('data-theme', newTheme);
        safeSetStorage('theme', newTheme);
        updateThemeIcon(newTheme);
        return;
      }

      var x = e.clientX || window.innerWidth / 2;
      var y = e.clientY || window.innerHeight / 2;
      var endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      var transition = document.startViewTransition(function () {
        document.documentElement.setAttribute('data-theme', newTheme);
        safeSetStorage('theme', newTheme);
        updateThemeIcon(newTheme);
      });

      transition.ready.then(function () {
        document.documentElement.animate(
          {
            clipPath: [
              'circle(0px at ' + x + 'px ' + y + 'px)',
              'circle(' + endRadius + 'px at ' + x + 'px ' + y + 'px)'
            ]
          },
          {
            duration: 500,
            easing: 'cubic-bezier(0.3, 0, 0.2, 1)',
            pseudoElement: '::view-transition-new(root)'
          }
        );
      });
    });
  }

  /* ---------- Certificate Modal Lightbox (Accessible & Focus Trapped) ---------- */
  var certModal = document.getElementById('certModal');
  var certModalImg = document.getElementById('certModalImg');
  var certModalTitle = document.getElementById('certModalTitle');
  var certModalClose = document.getElementById('certModalClose');
  var certModalBackdrop = document.getElementById('certModalBackdrop');
  var lastModalTrigger = null;

  function openCertModal(imgSrc, titleText, triggerEl) {
    if (!certModal || !certModalImg) return;
    lastModalTrigger = triggerEl || document.activeElement;
    certModalImg.src = imgSrc;
    certModalImg.alt = titleText || 'Pratinjau Sertifikat';
    if (certModalTitle && titleText) certModalTitle.textContent = titleText;
    certModal.classList.add('is-open');
    certModal.setAttribute('aria-hidden', 'false');
    lockScroll();
    if (certModalClose) certModalClose.focus();
  }

  function closeCertModal() {
    if (!certModal || !certModal.classList.contains('is-open')) return;
    certModal.classList.remove('is-open');
    certModal.setAttribute('aria-hidden', 'true');
    unlockScroll();
    if (lastModalTrigger && typeof lastModalTrigger.focus === 'function') {
      lastModalTrigger.focus();
    }
  }

  document.addEventListener('click', function (e) {
    var mediaTrigger = e.target.closest('.card__media--cert');
    var btnTrigger = e.target.closest('.cert-modal-btn');
    var trigger = mediaTrigger || btnTrigger;

    if (trigger) {
      var imgSrc = trigger.getAttribute('data-img');
      var titleText = trigger.getAttribute('data-title');
      if (imgSrc) openCertModal(imgSrc, titleText, trigger);
    }
  });

  if (certModalClose) certModalClose.addEventListener('click', closeCertModal);
  if (certModalBackdrop) certModalBackdrop.addEventListener('click', closeCertModal);

  // Modal Focus Trap
  if (certModal) {
    certModal.addEventListener('keydown', function (e) {
      if (!certModal.classList.contains('is-open')) return;
      if (e.key === 'Tab') {
        var focusables = certModal.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])');
        if (focusables.length === 0) return;
        var first = focusables[0];
        var last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
  }

  // Global Escape key listener
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (certModal && certModal.classList.contains('is-open')) {
        closeCertModal();
      } else if (sidenav && sidenav.classList.contains('is-open')) {
        closeNav();
      }
    }
  });

  /* ---------- Live Clock (WIB - Tangerang, Banten) ---------- */
  var timeEl = document.getElementById('localTime');
  if (timeEl) {
    var updateClock = function () {
      var options = {
        timeZone: 'Asia/Jakarta',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };
      try {
        var formatter = new Intl.DateTimeFormat('id-ID', options);
        var timeStr = formatter.format(new Date());
        timeEl.innerHTML = '<i class="fa-regular fa-clock"></i> ' + timeStr.replace(/\./g, ':') + ' WIB';
      } catch (err) {
        var now = new Date();
        var hrs = String(now.getHours()).padStart(2, '0');
        var mins = String(now.getMinutes()).padStart(2, '0');
        timeEl.innerHTML = '<i class="fa-regular fa-clock"></i> ' + hrs + ':' + mins + ' WIB';
      }
    };
    updateClock();
    setInterval(updateClock, 1000);
  }

  /* ---------- Footer Year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* =========================================================
     DYNAMIC INTERACTIONS & ANIMATIONS (Fine Pointer Only)
     ========================================================= */
  var hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (hasFinePointer && !prefersReducedMotion) {
    document.documentElement.classList.add('has-custom-cursor');

    /* ---------- Custom Cursor with Lerp (Spring Physics) ---------- */
    var cursor = document.getElementById('customCursor');
    var cursorDot = document.getElementById('customCursorDot');
    var mouseX = -100, mouseY = -100;
    var cursorX = -100, cursorY = -100;
    var lerpSpeed = 0.18;
    var cursorRaf = null;

    function renderCursor() {
      var dx = mouseX - cursorX;
      var dy = mouseY - cursorY;
      cursorX += dx * lerpSpeed;
      cursorY += dy * lerpSpeed;

      if (cursor) {
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
      }

      if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
        cursorRaf = requestAnimationFrame(renderCursor);
      } else {
        cursorRaf = null;
      }
    }

    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (cursorDot) {
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';
      }
      if (!cursorRaf && !document.hidden) {
        cursorRaf = requestAnimationFrame(renderCursor);
      }
    });

    document.addEventListener('visibilitychange', function () {
      if (document.hidden && cursorRaf) {
        cancelAnimationFrame(cursorRaf);
        cursorRaf = null;
      }
    });

    /* ---------- Cursor Hover Scale Effect ---------- */
    var hoverables = document.querySelectorAll('a, button, .card, .sidenav__brand, .sidenav__social a, .chip, .to-top');
    hoverables.forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        if (cursor) cursor.classList.add('hovered');
      });
      el.addEventListener('mouseleave', function () {
        if (cursor) cursor.classList.remove('hovered');
      });
    });

    /* ---------- Interactive Card Highlight (pointer-tracked sheen) ---------- */
    var cards = document.querySelectorAll('.card');
    cards.forEach(function (card) {
      var frame = 0;

      card.addEventListener('mousemove', function (e) {
        if (frame) cancelAnimationFrame(frame);
        frame = requestAnimationFrame(function () {
          var rect = card.getBoundingClientRect();
          var x = e.clientX - rect.left;
          var y = e.clientY - rect.top;
          card.style.setProperty('--sheen-x', x + 'px');
          card.style.setProperty('--sheen-y', y + 'px');
          card.classList.add('is-hovered');
        });
      });

      card.addEventListener('mouseleave', function () {
        if (frame) cancelAnimationFrame(frame);
        card.classList.remove('is-hovered');
      });
    });

    /* ---------- Magnetic Hover Effect ---------- */
    var magnetics = document.querySelectorAll('.btn, .theme-toggle, .sidenav__brand');
    magnetics.forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var rect = el.getBoundingClientRect();
        var x = e.clientX - rect.left - (rect.width / 2);
        var y = e.clientY - rect.top - (rect.height / 2);
        el.style.transform = 'translate(' + (x * 0.18) + 'px, ' + (y * 0.18) + 'px)';
      });

      el.addEventListener('mouseleave', function () {
        el.style.transform = '';
      });
    });
  }

})();