// Interactions for the Boba Drops personal site:
// typewriter tagline, scroll-reveal sections, reading progress,
// theme toggle (persisted), copy-email with feedback, device visit counter.

(function () {
  'use strict';

  var root = document.documentElement;

  /* ---------- typewriter tagline ---------- */
  var phrases = [
    'I build pages that actually run.',
    'Learning HTML, CSS and a little JavaScript.',
    'Shipping one small project at a time.'
  ];
  var typedEl = document.getElementById('typed');
  var phraseIndex = 0;
  var charIndex = 0;
  var deleting = false;

  function tick() {
    var phrase = phrases[phraseIndex];
    if (!deleting) {
      charIndex += 1;
      if (charIndex >= phrase.length) {
        typedEl.textContent = phrase;
        deleting = true;
        window.setTimeout(tick, 1700);
        return;
      }
    } else {
      charIndex -= 1;
      if (charIndex <= 0) {
        charIndex = 0;
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
    }
    typedEl.textContent = phrase.slice(0, charIndex);
    window.setTimeout(tick, deleting ? 28 : 55);
  }

  if (typedEl) {
    typedEl.textContent = phrases[0].slice(0, 1);
    window.setTimeout(tick, 420);
  }

  /* ---------- scroll reveal ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- reading progress bar ---------- */
  var bar = document.getElementById('progress-bar');

  function updateProgress() {
    if (!bar) return;
    var scrollable = document.documentElement.scrollHeight - window.innerHeight;
    var ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
    bar.style.width = Math.min(Math.max(ratio, 0), 1) * 100 + '%';
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
  updateProgress();

  /* ---------- theme toggle ---------- */
  var themeBtn = document.getElementById('theme');

  function syncThemeButton() {
    if (!themeBtn) return;
    var isLight = root.dataset.theme === 'light';
    themeBtn.setAttribute('aria-pressed', String(isLight));
    themeBtn.setAttribute(
      'aria-label',
      isLight ? 'Switch to dark theme' : 'Switch to light theme'
    );
  }

  if (themeBtn) {
    syncThemeButton();
    themeBtn.addEventListener('click', function () {
      var next = root.dataset.theme === 'light' ? 'dark' : 'light';
      root.dataset.theme = next;
      try {
        localStorage.setItem('theme', next);
      } catch (e) { /* storage blocked: theme still applies for this page load */ }
      syncThemeButton();
    });
  }

  /* ---------- copy email ---------- */
  var copyBtn = document.getElementById('copy');
  var copyStatus = document.getElementById('copy-status');
  var EMAIL = 'carl20101008@gmail.com';

  function flash(message) {
    if (!copyStatus) return;
    copyStatus.textContent = message;
    window.setTimeout(function () {
      copyStatus.textContent = '';
    }, 2200);
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(EMAIL).then(function () {
          flash('Copied: ' + EMAIL);
        }).catch(function () {
          legacyCopy();
        });
      } else {
        legacyCopy();
      }
    });
  }

  // Fallback for browsers/pages where the async Clipboard API is unavailable.
  function legacyCopy() {
    var area = document.createElement('textarea');
    area.value = EMAIL;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.top = '-1000px';
    document.body.appendChild(area);
    area.select();
    var ok = false;
    try {
      ok = document.execCommand('copy');
    } catch (e) {
      ok = false;
    }
    document.body.removeChild(area);
    flash(ok ? 'Copied: ' + EMAIL : 'Email: ' + EMAIL);
  }

  /* ---------- visit counter (this device only) ---------- */
  var visitsEl = document.getElementById('visits');
  try {
    var key = 'boba-site-visits';
    var visits = Number(localStorage.getItem(key) || '0') + 1;
    localStorage.setItem(key, String(visits));
    if (visitsEl) {
      visitsEl.textContent = visits === 1
        ? 'first visit on this device'
        : visits + ' visits on this device';
    }
  } catch (e) { /* storage blocked: keep the default label */ }

  /* ---------- footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
