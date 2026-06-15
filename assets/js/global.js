
(function () {
  'use strict';

  /* header/footer 已由 tools/build-includes.py 靜態內嵌進每頁（SEO：爬蟲可直接讀到
     導覽/footer 連結，不需 JS）。本檔只負責互動行為。
     內頁 <body data-base="../"> 仍保留：initHeaderScroll 用它判斷是否固定 scrolled 樣式。 */

  function initHeaderScroll() {
    const header = document.getElementById('siteHeader');
    if (!header) return;
    if (document.body.dataset.base) {
      header.classList.add('is-scrolled');
      return;
    }
    const onScroll = () => {
      if (window.scrollY > 10) header.classList.add('is-scrolled');
      else header.classList.remove('is-scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

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

    menu.querySelectorAll('.mobile-menu__toggle').forEach(toggle => {
      toggle.addEventListener('click', () => {
        const group = toggle.closest('.mobile-menu__group');
        if (!group) return;
        const isOpen = group.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', String(isOpen));
      });
    });
  }

  function initActiveNav() {
    let path = window.location.pathname.replace(/\/+$/, '/');  /* 確保 / 結尾保留 */
    let key;
    const segments = path.split('/').filter(Boolean);
    const last = segments[segments.length - 1] || '';
    if (path === '/' || last === '' || last === 'index.html') {
      key = 'index.html';
    } else if (last.endsWith('.html')) {
      key = last;
    } else {
      key = last + '/';
    }

    document.querySelectorAll('.site-nav__link, .mobile-menu__link').forEach(a => {
      const href = a.getAttribute('href') || '';
      let hrefKey;
      if (href === './' || href === '' || href === 'index.html') {
        hrefKey = 'index.html';
      } else if (href.endsWith('/')) {
        hrefKey = href.split('/').filter(Boolean).pop() + '/';
      } else {
        hrefKey = href;
      }
      if (hrefKey === key) a.classList.add('is-active');
    });
  }

  function initCopyrightYear() {
    document.querySelectorAll('[data-year]').forEach(el => {
      el.textContent = String(new Date().getFullYear());
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initHeaderScroll();
    initMobileMenu();
    initActiveNav();
    initCopyrightYear();

    document.dispatchEvent(new CustomEvent('components:ready'));
  });
})();
