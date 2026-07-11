
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
    /* 以完整路徑比對(而非只比最後一段),否則細節頁如 /plumbing-service/drain.../
       的 last 段(drain）永遠對不到父層連結（plumbing-service/）。
       所有路徑先換算成「相對站台根」再比對——站台根 = 所有連結中最短的解析路徑(即 Home)。
       如此無論站台掛在網域根、子路徑或 file:// 底下,Home 的相對路徑都會是 ''、只在首頁命中,
       不會因為 startsWith('/…/') 把 Home 誤標成全站 active。 */
    const norm = p => {
      p = p.replace(/index\.html$/, '');
      return p.endsWith('/') ? p : p + '/';
    };
    const abs = href => {
      try { return norm(new URL(href, window.location.href).pathname); }
      catch (e) { return null; }
    };

    const links = Array.from(document.querySelectorAll(
      '.site-nav__link, .site-dropdown__link, .mobile-menu__link, .mobile-menu__sublink'
    ));

    /* 站台根 = 最短的連結路徑(Home) */
    let root = norm(window.location.pathname);
    links.forEach(a => {
      const p = a.getAttribute('href') && abs(a.getAttribute('href'));
      if (p && p.length < root.length) root = p;
    });
    const rel = p => (p.startsWith(root) ? p.slice(root.length) : p);
    const current = rel(norm(window.location.pathname));

    links.forEach(a => {
      const href = a.getAttribute('href');
      if (!href) return;
      const p = abs(href);
      if (p == null) return;
      const linkPath = rel(p);
      /* 相對站台根:完全相同,或目前頁位於其下(''=Home,只在首頁命中) */
      if (linkPath === current || (linkPath !== '' && current.startsWith(linkPath))) {
        a.classList.add('is-active');
      }
    });

    /* 下拉子項命中時,父層(桌機 nav 連結 / 手機 toggle)也標記 active */
    document.querySelectorAll('.site-nav__item--has-dropdown').forEach(item => {
      if (item.querySelector('.site-dropdown__link.is-active')) {
        item.querySelector('.site-nav__link')?.classList.add('is-active');
      }
    });
    document.querySelectorAll('.mobile-menu__group').forEach(group => {
      if (group.querySelector('.mobile-menu__sublink.is-active')) {
        group.querySelector('.mobile-menu__toggle')?.classList.add('is-active');
      }
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
