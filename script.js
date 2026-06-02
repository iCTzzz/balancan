/* ═══════════════════════════════════════════════════════════
   BALANCÁN TOURISM – SCRIPT.JS
   Full interactivity: nav, scroll, animations, accordions
════════════════════════════════════════════════════════════ */

'use strict';

// ── NAVBAR ─────────────────────────────────────────────────
const navbar     = document.getElementById('navbar');
const hamburger  = document.getElementById('hamburger');
const navLinks   = document.getElementById('navLinks');
const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
const backToTop  = document.getElementById('backToTop');

// Initial transparent state
navbar.classList.add('transparent');

// Scroll handler: sticky background + back-to-top
function onScroll() {
  const scrollY = window.scrollY;

  if (scrollY > 60) {
    navbar.classList.remove('transparent');
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
    navbar.classList.add('transparent');
  }

  if (scrollY > 400) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }

  updateScrollSpy();
  animateCounters();
}

window.addEventListener('scroll', onScroll, { passive: true });

// Back to top
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ── HAMBURGER MENU ──────────────────────────────────────────
hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close mobile menu when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

// Close on outside click
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target) && navLinks.classList.contains('open')) {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
});

// ── DROPDOWN ────────────────────────────────────────────────
dropdownToggles.forEach(toggle => {
  const parent = toggle.closest('.nav-dropdown');
  const menu   = parent.querySelector('.dropdown-menu');

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = parent.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen);
  });

  // Close when clicking dropdown item (mobile)
  menu && menu.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', () => {
      parent.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
});

// Close dropdown on outside click
document.addEventListener('click', (e) => {
  document.querySelectorAll('.nav-dropdown.open').forEach(d => {
    if (!d.contains(e.target)) {
      d.classList.remove('open');
      d.querySelector('.dropdown-toggle').setAttribute('aria-expanded', 'false');
    }
  });
});

// ── SMOOTH SCROLL ───────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const targetId = link.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();
    const offset = navbar.offsetHeight + 16;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ── SCROLL SPY ──────────────────────────────────────────────
const spySections = document.querySelectorAll('section[id], div[id]');
const navLinkItems = document.querySelectorAll('.nav-link[data-section]');

function updateScrollSpy() {
  let current = '';
  const offset = navbar.offsetHeight + 80;

  spySections.forEach(section => {
    const top = section.getBoundingClientRect().top;
    if (top < offset) {
      current = section.id;
    }
  });

  navLinkItems.forEach(link => {
    link.classList.toggle('active', link.dataset.section === current);
  });
}

// ── REVEAL ON SCROLL ────────────────────────────────────────
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -60px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

// ── PARALLAX HERO ────────────────────────────────────────────
const heroBg = document.querySelector('.hero-bg');

function parallaxHero() {
  if (!heroBg) return;
  const scrolled = window.scrollY;
  if (scrolled < window.innerHeight) {
    heroBg.style.transform = `scale(1.05) translateY(${scrolled * 0.25}px)`;
  }
}

window.addEventListener('scroll', parallaxHero, { passive: true });

// ── COUNTER ANIMATION ────────────────────────────────────────
const counters    = document.querySelectorAll('.stat-number[data-target]');
let countersAnimated = false;

function animateCounters() {
  if (countersAnimated) return;
  const statsBar = document.querySelector('.stats-bar');
  if (!statsBar) return;

  const rect = statsBar.getBoundingClientRect();
  if (rect.top < window.innerHeight - 100) {
    countersAnimated = true;
    counters.forEach(counter => {
      const target = parseInt(counter.dataset.target, 10);
      const duration = 1800;
      const start = performance.now();

      function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        counter.textContent = Math.round(target * eased);
        if (progress < 1) requestAnimationFrame(update);
      }

      requestAnimationFrame(update);
    });
  }
}

// ── ACTIVITY TABS ────────────────────────────────────────────
const tabBtns       = document.querySelectorAll('.tab-btn');
const activityCards = document.querySelectorAll('.activity-card');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab;

    // Update active btn
    tabBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Filter cards
    activityCards.forEach(card => {
      const matches = tab === 'all' || card.dataset.category === tab;
      card.classList.toggle('hidden', !matches);

      if (matches) {
        // Re-trigger reveal animation
        card.classList.remove('visible');
        setTimeout(() => card.classList.add('visible'), 60);
      }
    });
  });
});

// Initial: show all cards as visible after page load
setTimeout(() => {
  activityCards.forEach(card => card.classList.add('visible'));
}, 400);

// ── ACCORDION ────────────────────────────────────────────────
const accordionHeaders = document.querySelectorAll('.accordion-header');

accordionHeaders.forEach(header => {
  header.addEventListener('click', () => {
    const isExpanded = header.getAttribute('aria-expanded') === 'true';
    const body = header.nextElementSibling;
    const accordion = header.closest('.accordion');

    // Close siblings in same accordion
    accordion.querySelectorAll('.accordion-header').forEach(h => {
      if (h !== header) {
        h.setAttribute('aria-expanded', 'false');
        const b = h.nextElementSibling;
        if (b) b.classList.remove('open');
      }
    });

    // Toggle this one
    header.setAttribute('aria-expanded', !isExpanded);
    if (body) body.classList.toggle('open', !isExpanded);
  });
});

// ── KEYBOARD NAVIGATION ─────────────────────────────────────
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    // Close mobile nav
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';

    // Close all dropdowns
    document.querySelectorAll('.nav-dropdown.open').forEach(d => {
      d.classList.remove('open');
      d.querySelector('.dropdown-toggle').setAttribute('aria-expanded', 'false');
    });
  }
});

// ── INIT ON LOAD ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Trigger scroll handler for initial state
  onScroll();
  parallaxHero();

  // Ensure hero content is visible even if animation fails
  setTimeout(() => {
    document.querySelectorAll('.reveal-hero').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  }, 2000);

  console.log('%c◈ Balancán – Visit Tabasco', 'color: #4CAF50; font-size: 16px; font-weight: bold;');
  console.log('%cDesigned for World Cup 2026 international travelers', 'color: #666; font-size: 12px;');
});
