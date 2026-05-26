/* ============================================================
   services.js — Service 內頁專屬互動
   - Scroll-triggered entrance animations（與首頁同節奏）
   - FAQ 手風琴 + Trust bar / Service-areas / Related cards 進場
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initFAQ();
});

function initScrollAnimations() {
  if (!window.gsap || !window.ScrollTrigger) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  gsap.registerPlugin(ScrollTrigger);

  const ENTER = { opacity: 0, y: 16, duration: 0.5, ease: 'power2.out' };

  /* 個別元素 fade-up */
  [
    '.article__intro',
    '.article__services',
    '.article__closing',
    '.service-nav',
    '.areas-mini__inner',
    '.faq__title',
    '.final-cta__inner',
  ].forEach(sel => {
    const el = document.querySelector(sel);
    if (!el) return;
    gsap.from(el, {
      ...ENTER,
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
    });
  });

  /* 群組 stagger */
  [
    ['.trust-bar', '.trust-bar__item'],
    ['.faq__list', '.faq-item'],
  ].forEach(([rootSel, itemSel]) => {
    const root = document.querySelector(rootSel);
    if (!root) return;
    const items = root.querySelectorAll(itemSel);
    if (items.length === 0) return;
    gsap.from(items, {
      ...ENTER,
      stagger: 0.06,
      scrollTrigger: { trigger: root, start: 'top 85%', once: true },
    });
  });
}

/* Floating CTA 配色：等 footer 注入後才能完整偵測背景區塊 */
document.addEventListener('components:ready', () => {
  if (window.initFloatingCtaBg) initFloatingCtaBg();
});
