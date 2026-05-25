/* =========================================================
   Portfolio Script
   - Staggered fade-in per section
   - Nav scroll shrink (nav-scrolled class)
   - Smooth anchor scroll with nav-height guard
   - Active nav highlight
   - Hamburger toggle
   - Back-to-top body class (show-top)
   ========================================================= */

const NAV_HEIGHT = 70; // px — matches html { scroll-padding-top } in CSS

// ---------------------------------------------------------
// 1. STAGGERED FADE-IN PER SECTION
//    Group .fade-in elements by their closest section/parent
//    so delay resets to 0 at the start of each section.
// ---------------------------------------------------------
(function initFadeIn() {
  const fadeEls = Array.from(document.querySelectorAll('.fade-in'));

  // Build a map: sectionKey -> [elements in order]
  const groups = new Map();
  fadeEls.forEach((el) => {
    // Walk up to find the nearest section or .section ancestor
    const section =
      el.closest('section') ||
      el.closest('[data-fade-group]') ||
      document.body;
    const key = section;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(el);
  });

  // Assign per-group stagger indices as data attributes
  groups.forEach((els) => {
    els.forEach((el, idx) => {
      el.dataset.fadeIndex = idx;
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = Number(entry.target.dataset.fadeIndex || 0) * 120;
          setTimeout(() => entry.target.classList.add('visible'), delay);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  fadeEls.forEach((el) => observer.observe(el));
})();

// ---------------------------------------------------------
// 2. NAV SCROLL SHRINK  +  5. BACK-TO-TOP BODY CLASS
//    Throttled scroll handler — single rAF loop.
// ---------------------------------------------------------
(function initScrollEffects() {
  const nav = document.querySelector('.nav');
  let ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;

      // Nav shrink
      if (nav) {
        nav.classList.toggle('nav-scrolled', y > 20);
      }

      ticking = false;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load to set initial state
})();

// ---------------------------------------------------------
// 3. SMOOTH ANCHOR SCROLL GUARD
//    Belt-and-suspenders on top of scroll-padding-top CSS.
//    Offsets the destination by NAV_HEIGHT.
// ---------------------------------------------------------
(function initAnchorScroll() {
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const hash = link.getAttribute('href');
    if (!hash || hash === '#') return;

    const target = document.querySelector(hash);
    if (!target) return;

    e.preventDefault();

    const top =
      target.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT;

    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });

    // Update URL hash without jumping
    if (history.pushState) {
      history.pushState(null, '', hash);
    }
  });
})();

// ---------------------------------------------------------
// 4. ACTIVE NAV HIGHLIGHT
// ---------------------------------------------------------
(function initNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((a) => a.classList.remove('active'));
          const active = document.querySelector(
            `.nav-links a[href="#${entry.target.id}"]`
          );
          if (active) active.classList.add('active');
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  sections.forEach((s) => navObserver.observe(s));
})();

// ---------------------------------------------------------
// 5. HAMBURGER TOGGLE (MOBILE)
// ---------------------------------------------------------
(function initHamburger() {
  const toggle = document.querySelector('.nav-toggle');
  const navLinksEl = document.querySelector('.nav-links');

  if (!toggle || !navLinksEl) return;

  toggle.addEventListener('click', () => {
    const isOpen = navLinksEl.classList.toggle('nav-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'メニューを閉じる' : 'メニューを開く');
  });

  // Close menu on link click
  navLinksEl.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      navLinksEl.classList.remove('nav-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
})();
