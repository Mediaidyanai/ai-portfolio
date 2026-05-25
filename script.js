// Scroll fade-in
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 120);
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

document.querySelectorAll('.fade-in').forEach((el) => observer.observe(el));

// Active nav highlight
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((a) => a.classList.remove('active'));
        const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  },
  { rootMargin: '-40% 0px -55% 0px' }
);

sections.forEach((s) => navObserver.observe(s));

// Hamburger toggle (mobile)
const toggle = document.querySelector('.nav-toggle');
const navLinksEl = document.querySelector('.nav-links');

if (toggle && navLinksEl) {
  toggle.addEventListener('click', () => {
    const isOpen = navLinksEl.classList.toggle('nav-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close on link click
  navLinksEl.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      navLinksEl.classList.remove('nav-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}
