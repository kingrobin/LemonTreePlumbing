/* ============================================================
   global.js — 全站共用
   - Component injector (components/*.inc → #inject-XXX)
   - Header scroll effect
   - Mobile menu
   ============================================================ */

(function () {
  'use strict';

  /* ---------- Base path (for nested pages e.g. /services/foo.html) ----------
     首頁 <body> 無 data-base → 維持原行為
     內頁 <body data-base="../"> → 所有 fetch + 注入後相對連結前綴 ../
  ============================================================ */
  function basePath() {
    return document.body.dataset.base || '';
  }

  /* 將注入內容中所有相對 href/src 加上 base 前綴
     跳過：http(s)://、//、/、#、tel:、mailto:、data: */
  function rewriteRelativeLinks(host) {
    const base = basePath();
    if (!base) return;
    const isAbsolute = (v) => /^(https?:|\/\/|\/|#|tel:|mailto:|data:)/i.test(v);
    host.querySelectorAll('[href]').forEach(el => {
      const v = el.getAttribute('href');
      if (v && !isAbsolute(v)) el.setAttribute('href', base + v);
    });
    host.querySelectorAll('[src]').forEach(el => {
      const v = el.getAttribute('src');
      if (v && !isAbsolute(v)) el.setAttribute('src', base + v);
    });
  }

  /* ---------- Component injector ---------- */
  async function injectComponent(targetId, url) {
    const host = document.getElementById(targetId);
    if (!host) return;
    try {
      const bust = '?v=' + Date.now();
      const res = await fetch(basePath() + url + bust, { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to load ' + url + ': ' + res.status);
      host.innerHTML = await res.text();
      rewriteRelativeLinks(host);
    } catch (err) {
      console.error(err);
    }
  }

  /* ---------- Header scroll effect ----------
     首頁：依 scrollY 切換 is-scrolled（透明 → 白底）
     內頁（body[data-base]）：永遠 is-scrolled，不切換
  ============================================================ */
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
      let hrefKey;
      if (href === './' || href === '' || href === 'index.html') {
        hrefKey = 'index.html';                              /* 視為 home */
      } else if (href.endsWith('/')) {
        hrefKey = href.split('/').filter(Boolean).pop() + '/';
      } else {
        hrefKey = href;
      }
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
