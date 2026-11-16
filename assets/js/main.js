/* Mayian Explorers Campsite — interactions
   Kept intentionally light: no libraries, no layout thrash. */
(function () {
  'use strict';

  var doc = document;
  var root = doc.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Flag JS so reveal styles only apply when they can be undone. */
  root.classList.add('js');

  /* ------------------------------------------------------------------ *
   * Sticky nav + reading progress
   * ------------------------------------------------------------------ */
  var nav = doc.querySelector('[data-nav]');
  var progress = doc.querySelector('[data-progress]');
  var menuIsOpen = false;
  var ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      var y = window.scrollY || window.pageYOffset;
      if (nav && !menuIsOpen) nav.classList.toggle('is-stuck', y > 24);

      if (progress) {
        var max = doc.documentElement.scrollHeight - window.innerHeight;
        var ratio = max > 0 ? Math.min(y / max, 1) : 0;
        progress.style.transform = 'scaleX(' + ratio.toFixed(4) + ')';
      }
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();

  /* ------------------------------------------------------------------ *
   * Mobile menu
   * ------------------------------------------------------------------ */
  var toggle = doc.querySelector('[data-menu-toggle]');
  var menu = doc.querySelector('[data-menu]');
  var lastFocus = null;

  function openMenu() {
    if (!menu || !toggle) return;
    menuIsOpen = true;
    lastFocus = doc.activeElement;
    menu.hidden = false;
    // next frame so the opacity transition runs
    window.requestAnimationFrame(function () { menu.classList.add('is-visible'); });
    toggle.setAttribute('aria-expanded', 'true');
    if (nav) { nav.classList.add('is-open'); nav.classList.remove('is-stuck'); }
    doc.body.classList.add('is-locked');
    var first = menu.querySelector('a');
    if (first) first.focus({ preventScroll: true });
  }

  function closeMenu(restoreFocus) {
    if (!menu || !toggle) return;
    menuIsOpen = false;
    menu.classList.remove('is-visible');
    toggle.setAttribute('aria-expanded', 'false');
    if (nav) nav.classList.remove('is-open');
    doc.body.classList.remove('is-locked');
    var hide = function () { if (!menuIsOpen) menu.hidden = true; };
    if (reduceMotion) hide(); else window.setTimeout(hide, 350);
    if (restoreFocus !== false && lastFocus) lastFocus.focus({ preventScroll: true });
    onScroll();
  }

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      if (menuIsOpen) closeMenu(); else openMenu();
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeMenu(false);
    });
    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menuIsOpen) closeMenu();
    });
    // keep focus inside the open panel
    menu.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab' || !menuIsOpen) return;
      var items = menu.querySelectorAll('a, button');
      if (!items.length) return;
      var first = items[0];
      var last = items[items.length - 1];
      if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    // reset when resizing back to desktop
    window.addEventListener('resize', function () {
      if (window.innerWidth > 1024 && menuIsOpen) closeMenu(false);
    });
  }

  /* ------------------------------------------------------------------ *
   * Reveal on scroll
   * ------------------------------------------------------------------ */
  var revealables = Array.prototype.slice.call(doc.querySelectorAll('[data-reveal]'));

  if (!('IntersectionObserver' in window) || reduceMotion) {
    revealables.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

    revealables.forEach(function (el) { io.observe(el); });
  }

  /* ------------------------------------------------------------------ *
   * Special Five — field guide
   * ------------------------------------------------------------------ */
  var five = doc.querySelector('[data-five]');
  if (five) {
    var items = Array.prototype.slice.call(five.querySelectorAll('[data-five-item]'));
    var images = Array.prototype.slice.call(five.querySelectorAll('[data-five-img]'));
    var caption = five.querySelector('[data-five-caption]');
    var labels = {
      gerenuk: 'Gerenuk · Samburu dry country',
      zebra: "Grevy's zebra · northern Kenya",
      oryx: 'Beisa oryx · open plains',
      ostrich: 'Somali ostrich · blue-grey neck',
      giraffe: 'Reticulated giraffe · thorn scrub'
    };

    function select(key, focusItem) {
      items.forEach(function (el) {
        var active = el.dataset.fiveItem === key;
        el.classList.toggle('is-active', active);
        el.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
      images.forEach(function (img) {
        img.classList.toggle('is-active', img.dataset.fiveImg === key);
      });
      if (caption && labels[key]) caption.textContent = labels[key];
      if (focusItem) {
        var target = five.querySelector('[data-five-item="' + key + '"]');
        if (target) target.focus();
      }
    }

    items.forEach(function (item) {
      var key = item.dataset.fiveItem;
      item.addEventListener('mouseenter', function () { select(key); });
      item.addEventListener('focus', function () { select(key); });
      item.addEventListener('click', function () { select(key); });
      item.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          e.preventDefault();
          var i = items.indexOf(item);
          var next = e.key === 'ArrowDown' ? (i + 1) % items.length : (i - 1 + items.length) % items.length;
          select(items[next].dataset.fiveItem, true);
        }
      });
    });
  }

  /* ------------------------------------------------------------------ *
   * Footer year
   * ------------------------------------------------------------------ */
  var year = doc.querySelector('[data-year]');
  if (year) year.textContent = String(new Date().getFullYear());
})();
