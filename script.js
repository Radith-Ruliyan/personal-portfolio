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
    themeToggle.addEventListener('click', function () {
      var activeTheme = document.documentElement.getAttribute('data-theme');
      var newTheme = activeTheme === 'dark' ? 'light' : 'dark';

      // Fallback if browser doesn't support View Transitions API
      if (!document.startViewTransition) {
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        return;
      }

      document.startViewTransition(function () {
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
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

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();