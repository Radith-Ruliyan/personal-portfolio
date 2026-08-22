/* =========================================================
   PORTFOLIO — script.js
   Vanilla JS only. No dependencies.
   ========================================================= */
(function () {
  'use strict';

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.getElementById('navToggle');
  var sidenav   = document.getElementById('sidenav');
  var navScrim  = document.getElementById('navScrim');

  function openNav() {
    sidenav.classList.add('is-open');
    navToggle.classList.add('is-open');
    navScrim.classList.add('is-visible');
    navToggle.setAttribute('aria-expanded', 'true');
  }
  function closeNav() {
    sidenav.classList.remove('is-open');
    navToggle.classList.remove('is-open');
    navScrim.classList.remove('is-visible');
    navToggle.setAttribute('aria-expanded', 'false');
  }
  navToggle.addEventListener('click', function () {
    sidenav.classList.contains('is-open') ? closeNav() : openNav();
  });
  navScrim.addEventListener('click', closeNav);

  var navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      if (window.innerWidth <= 1000) closeNav();
    });
  });

  /* ---------- Smooth scroll (native CSS handles it; JS ensures offset) ---------- */
  navLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      var targetId = link.getAttribute('href');
      var target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', targetId);
    });
  });

  /* ---------- Scroll-spy: highlight active nav link ---------- */
  var sections = Array.prototype.slice.call(document.querySelectorAll('main .section'));

  function updateActiveLink() {
    var scrollPos = window.scrollY + window.innerHeight * 0.35;
    var current = sections[0];
    sections.forEach(function (sec) {
      if (sec.offsetTop <= scrollPos) current = sec;
    });
    navLinks.forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current.id);
    });
  }

  /* ---------- Fade-in on scroll (IntersectionObserver) ---------- */
  var fadeEls = document.querySelectorAll('.fade-in');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    fadeEls.forEach(function (el) { io.observe(el); });
  } else {
    // Fallback: no observer support, just show everything
    fadeEls.forEach(function (el) { el.classList.add('in-view'); });
  }

  /* ---------- Back-to-top button ---------- */
  var toTop = document.getElementById('toTop');
  function updateToTop() {
    toTop.classList.toggle('visible', window.scrollY > 500);
  }
  toTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- Scroll listener (throttled via rAF) ---------- */
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
  });
  updateActiveLink();
  updateToTop();

    /* ---------- Hero typewriter ---------- */
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

  /* ---------- Contact form ---------- */
  var form = document.getElementById('contactForm');
  var status = document.getElementById('formStatus');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.name.value.trim();
      var email = form.email.value.trim();
      var message = form.message.value.trim();

      if (!form.checkValidity()) {
        status.textContent = 'Mohon lengkapi semua kolom dengan benar.';
        status.style.color = '#d4746c';
        return;
      }

      // Format mailto link to automatically draft email to ruliyanradith@gmail.com
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

  var savedTheme = localStorage.getItem('theme');
  var systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  var currentTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');

  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', function (e) {
      var activeTheme = document.documentElement.getAttribute('data-theme');
      var newTheme = activeTheme === 'dark' ? 'light' : 'dark';

      // Fallback if browser doesn't support View Transitions API
      if (!document.startViewTransition) {
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
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
        localStorage.setItem('theme', newTheme);
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
            duration: 550,
            easing: 'cubic-bezier(0.3, 0, 0.2, 1)',
            pseudoElement: '::view-transition-new(root)'
          }
        );
      });
    });
  }

  function updateThemeIcon(theme) {
    if (!themeToggleIcon) return;
    if (theme === 'dark') {
      themeToggleIcon.className = 'fa-solid fa-sun';
      themeToggle.setAttribute('aria-label', 'Ganti ke mode terang');
    } else {
      themeToggleIcon.className = 'fa-solid fa-moon';
      themeToggle.setAttribute('aria-label', 'Ganti ke mode gelap');
    }
  }

  /* ---------- Certificate Modal Lightbox ---------- */
  var certModal = document.getElementById('certModal');
  var certModalImg = document.getElementById('certModalImg');
  var certModalTitle = document.getElementById('certModalTitle');
  var certModalClose = document.getElementById('certModalClose');
  var certModalBackdrop = document.getElementById('certModalBackdrop');

  function openCertModal(imgSrc, titleText) {
    if (!certModal || !certModalImg) return;
    certModalImg.src = imgSrc;
    if (certModalTitle && titleText) certModalTitle.textContent = titleText;
    certModal.classList.add('is-open');
    certModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Stop background scrolling
  }

  function closeCertModal() {
    if (!certModal) return;
    certModal.classList.remove('is-open');
    certModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Trigger modal via card media click or button click
  document.addEventListener('click', function (e) {
    var mediaTrigger = e.target.closest('.card__media--cert');
    var btnTrigger = e.target.closest('.cert-modal-btn');

    if (mediaTrigger) {
      var imgSrc = mediaTrigger.getAttribute('data-img');
      var titleText = mediaTrigger.getAttribute('data-title');
      if (imgSrc) openCertModal(imgSrc, titleText);
    } else if (btnTrigger) {
      var imgSrc = btnTrigger.getAttribute('data-img');
      var titleText = btnTrigger.getAttribute('data-title');
      if (imgSrc) openCertModal(imgSrc, titleText);
    }
  });

  if (certModalClose) certModalClose.addEventListener('click', closeCertModal);
  if (certModalBackdrop) certModalBackdrop.addEventListener('click', closeCertModal);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && certModal && certModal.classList.contains('is-open')) {
      closeCertModal();
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

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* =========================================================
     PREMIUM DYNAMIC INTERACTIONS & ANIMATIONS (Figma-Prototype level)
     ========================================================= */

  // Check if touch device
  var isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  if (!isTouch) {
    /* ---------- Custom Cursor with Lerp (spring physics) ---------- */
    var cursor = document.getElementById('customCursor');
    var cursorDot = document.getElementById('customCursorDot');
    var mouseX = 0, mouseY = 0;
    var cursorX = 0, cursorY = 0;
    var lerpSpeed = 0.15;

    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (cursorDot) {
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';
      }
    });

    var renderCursor = function () {
      var dx = mouseX - cursorX;
      var dy = mouseY - cursorY;
      cursorX += dx * lerpSpeed;
      cursorY += dy * lerpSpeed;
      if (cursor) {
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
      }
      requestAnimationFrame(renderCursor);
    };
    renderCursor();

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

    /* ---------- Interactive Card Highlight (pointer-tracked sheen, no 3D) ---------- */
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

    /* ---------- Magnetic Hover Effect on Main Buttons & Toggles ---------- */
    var magnetics = document.querySelectorAll('.btn, .theme-toggle, .sidenav__brand');
    magnetics.forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var rect = el.getBoundingClientRect();
        var x = e.clientX - rect.left - (rect.width / 2);
        var y = e.clientY - rect.top - (rect.height / 2);
        // drift 20% toward cursor
        el.style.transform = 'translate(' + (x * 0.22) + 'px, ' + (y * 0.22) + 'px)';
      });

      el.addEventListener('mouseleave', function () {
        el.style.transform = 'translate(0, 0)';
      });
    });
  }

})();