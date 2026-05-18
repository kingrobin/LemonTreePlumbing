/* ============================================================
   global.js — 全站共用
   - Component injector (components/*.inc → #inject-XXX)
   - Header scroll effect
   - Mobile menu
   ============================================================ */

(function () {
  'use strict';

  /* ---------- Component injector ---------- */
  async function injectComponent(targetId, url) {
    const host = document.getElementById(targetId);
    if (!host) return;
    try {
      const bust = '?v=' + Date.now();
      const res = await fetch(url + bust, { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to load ' + url + ': ' + res.status);
      host.innerHTML = await res.text();
    } catch (err) {
      console.error(err);
    }
  }

  /* ---------- Header scroll effect ---------- */
  function initHeaderScroll() {
    const header = document.getElementById('siteHeader');
    if (!header) return;
    const onScroll = () => {
      if (window.scrollY > 10) header.classList.add('is-scrolled');
      else header.classList.remove('is-scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Mobile menu ---------- */
  function initMobileMenu() {
    const openBtn  = document.getElementById('menuOpenBtn');
    const closeBtn = document.getElementById('menuCloseBtn');
    const menu     = document.getElementById('mobileMenu');
    if (!openBtn || !closeBtn || !menu) return;

    const open  = () => {
      menu.classList.add('is-open');
      document.body.classList.add('is-menu-open');
      menu.setAttribute('aria-hidden', 'false');
    };
    const close = () => {
      menu.classList.remove('is-open');
      document.body.classList.remove('is-menu-open');
      menu.setAttribute('aria-hidden', 'true');
    };

    openBtn.addEventListener('click', open);
    closeBtn.addEventListener('click', close);
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

    // Accordion groups
    menu.querySelectorAll('.mobile-menu__toggle').forEach(toggle => {
      toggle.addEventListener('click', () => {
        const group = toggle.closest('.mobile-menu__group');
        if (!group) return;
        const isOpen = group.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', String(isOpen));
      });
    });
  }

  /* ---------- Active nav (依當前路徑標記 nav link) ---------- */
  function initActiveNav() {
    // 取當前頁的 "key"：路徑 segment（services/ areas/）或檔名（index.html / about.html）
    let path = window.location.pathname.replace(/\/+$/, '/');  /* 確保 / 結尾保留 */
    let key;
    const segments = path.split('/').filter(Boolean);
    const last = segments[segments.length - 1] || '';
    if (path === '/' || last === '' || last === 'index.html') {
      key = 'index.html';
    } else if (last.endsWith('.html')) {
      key = last;                                              /* about.html / gallery.html ... */
    } else {
      key = last + '/';                                        /* services / areas → services/ */
    }

    document.querySelectorAll('.site-nav__link, .mobile-menu__link').forEach(a => {
      const href = a.getAttribute('href') || '';
      const hrefKey = href.endsWith('/') ? href.split('/').filter(Boolean).pop() + '/' : href;
      if (hrefKey === key) a.classList.add('is-active');
    });
  }

  /* ---------- Dynamic copyright year ---------- */
  function initCopyrightYear() {
    document.querySelectorAll('[data-year]').forEach(el => {
      el.textContent = String(new Date().getFullYear());
    });
  }

  /* ---------- Bootstrap ---------- */
  document.addEventListener('DOMContentLoaded', async () => {
    await Promise.all([
      injectComponent('inject-header', 'components/header.inc'),
      injectComponent('inject-footer', 'components/footer.inc'),
    ]);
    // Component-dependent handlers must run AFTER injection
    initHeaderScroll();
    initMobileMenu();
    initActiveNav();
    initCopyrightYear();

    // Notify page scripts that shared components are ready
    document.dispatchEvent(new CustomEvent('components:ready'));
  });
})();
