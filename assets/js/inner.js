/* inner.js — 內頁共用進場動畫（參考 home.js）
   每個 querySelector 皆防呆：缺少的區塊自動略過，所以一支檔可服務所有內頁。*/

document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();

  /* 依頁面實際存在的元件條件初始化（避免在沒有該區塊的頁面報錯）*/
  /* testimonials：只有 slider 變體要初始化；grid 變體（reviews）是靜態網格，不可掛 slider */
  if (document.querySelector('.testimonials__inner') &&
      !document.querySelector('.testimonials--grid') && window.initSlider) {
    initSlider('.testimonials__inner', { auto: true });
  }
  /* lightbox：gallery 頁是 .masonry，其餘內頁的小圖庫是 .gallery__grid */
  if (window.initLightbox) {
    if (document.querySelector('.masonry')) initLightbox('.masonry');
    else if (document.querySelector('.gallery__grid')) initLightbox('.gallery__grid');
  }
  if (document.querySelector('.faq') && window.initFAQ) {
    initFAQ();
  }
});

/* ---------- 捲動進場（與 home 同強度：opacity0 + y16，top 85%、once）---------- */
function initScrollAnimations() {
  if (!window.gsap || !window.ScrollTrigger) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  gsap.registerPlugin(ScrollTrigger);

  const ENTER = { opacity: 0, y: 16, duration: 0.5, ease: 'power2.out' };

  /* 單一區塊淡入 */
  [
    '.about-story__media',
    '.about-story__title',
    '.about-story__text',
    '.contact-cta',
    '.gallery__content',
    '.work-grid__inner',
    '.service-areas__content',
    '.svc-showcase__head',
    '.svc-note',
    '.sd-panel',
    '.sd-aside',
    '.sd-precision',
    '.area-intro__aside',
    '.cta-band__inner',
    '.fleet-band__title',
    '.testimonials__title',
    '.testimonials__intro',
    '.testimonials__slider',
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

  /* grid / 列表：子項目 stagger 淡入 */
  [
    ['.trust-bar',            '.trust-bar__item'],
    ['.area-features',        '.area-feature'],
    ['.gallery__grid',        '.gallery__item'],
    ['.service-grid',         '.service-card'],
    ['.services-block__grid', '.service-card'],
    ['.svc-tiles',            '.svc-tile'],
    ['.svc-cards',            '.svc-card'],
    ['.sd-strip',             '.sd-strip__item'],
    ['.sd-features',          '.sd-feature'],
    ['.service-areas__list',  '.area-link'],
    ['.areas-mini__list',     '.areas-mini__link'],
    ['.testimonials__badges', 'li'],
    ['.faq__list',            '.faq-item'],
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

  /* 地圖（hub）：scale 進場，與 home service-areas__map 一致 */
  const map = document.querySelector('.service-areas__map');
  if (map) {
    gsap.from(map, {
      opacity: 0, scale: 0.95, duration: 0.55, ease: 'power2.out',
      scrollTrigger: { trigger: map, start: 'top 85%', once: true },
    });
  }
}

document.addEventListener('components:ready', () => {
  if (window.initFloatingCtaBg) initFloatingCtaBg();
});
