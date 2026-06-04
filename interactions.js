/**
 * interactions.js — Shared lightweight interaction layer
 * Handles: cursor, scroll reveal, nav scroll, smooth scroll, mobile nav
 */
(function() {
  'use strict';

  // ── NAV SCROLL CLASS ──
  const nav = document.getElementById('main-nav');
  if (nav) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          nav.classList.toggle('scrolled', window.scrollY > 10);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // ── SMOOTH SCROLL ──
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
    });
  });

  // ── MOBILE NAV ──
  const mBtn = document.getElementById('mMenuBtn');
  const mDrawer = document.getElementById('mDrawer');
  const mOverlay = document.getElementById('mOverlay');
  if (mBtn && mDrawer) {
    const close = () => { mBtn.classList.remove('open'); mDrawer.classList.remove('open'); if(mOverlay) mOverlay.classList.remove('open'); document.body.style.overflow=''; };
    const open = () => { mBtn.classList.add('open'); mDrawer.classList.add('open'); if(mOverlay) mOverlay.classList.add('open'); document.body.style.overflow='hidden'; };
    mBtn.addEventListener('click', () => mBtn.classList.contains('open') ? close() : open());
    if(mOverlay) mOverlay.addEventListener('click', close);
    mDrawer.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  }

  // ── CURSOR (pointer devices only) ──
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    if (dot && ring) {
      let rx = 0, ry = 0, dx = 0, dy = 0;
      document.addEventListener('mousemove', e => {
        dx = e.clientX; dy = e.clientY;
        dot.style.transform = `translate(${dx}px,${dy}px) translate(-50%,-50%)`;
      }, { passive: true });
      const animRing = () => {
        rx += (dx - rx) * 0.12;
        ry += (dy - ry) * 0.12;
        ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
        requestAnimationFrame(animRing);
      };
      animRing();
      const hoverEls = document.querySelectorAll('a, button, [class*="card"], [class*="item"], .skill-pill');
      hoverEls.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
      });
    }
  }

  // ── SCROLL REVEAL ──
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('visible'));
  }

  // ── COUNTER ANIMATION ──
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    const cio = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const dec = parseInt(el.dataset.decimal) || 0;
        const start = performance.now();
        const animate = now => {
          const t = Math.min((now - start) / 1000, 1);
          const ease = 1 - Math.pow(1 - t, 3);
          el.textContent = (target * ease).toFixed(dec) + suffix;
          if (t < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
        cio.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(el => cio.observe(el));
  }

  // ── MAGNETIC BUTTONS ──
  document.querySelectorAll('.magnetic').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * 0.18;
      const y = (e.clientY - r.top - r.height / 2) * 0.25;
      el.style.transform = `translate(${x}px,${y}px) translateY(-2px)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });

  // ── WORK CARD TILT (subtle) ──
  document.querySelectorAll('.work-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width - 0.5) * 6;
      const y = ((e.clientY - r.top) / r.height - 0.5) * 6;
      card.style.transform = `translateY(-6px) rotateX(${-y}deg) rotateY(${x}deg)`;
      card.style.boxShadow = `${-x}px ${12 + Math.abs(y)}px 40px rgba(0,0,0,0.12)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.boxShadow = '';
    });
  });

})();
