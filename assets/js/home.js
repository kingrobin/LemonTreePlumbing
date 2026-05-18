/* ============================================================
   home.js — 首頁專屬互動
   GSAP entrance + 呼叫共用 component init
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Hero entrance animation (GSAP)
  if (window.gsap) {
    const tl = gsap.timeline({ defaults: { ease: 'power2.out', duration: 0.5 } });
    tl.from('.hero__eyebrow', { y: 16, opacity: 0 })
      .from('.hero__h1',      { y: 20, opacity: 0 }, '-=0.35')
      .from('.hero__cta',     { y: 16, opacity: 0 }, '-=0.3')
      .from('.trust-bar__item', { y: 16, opacity: 0, stagger: 0.07 }, '-=0.25');
  }

  // Scroll-triggered entrance animations for other sections
  initScrollAnimations();

  // Testimonials slider — dots 隨可見卡數自動計算
  initSlider('.testimonials__inner', { auto: true });

  // Gallery lightbox — 點圖開大圖
  initLightbox('.gallery__grid');

  // FAQ accordion
  initFAQ();
});

/* ---------- Scroll-triggered entrance animations ----------
   每個 section 進入 viewport 時 fade + 輕微 translateY 進場
   ============================================================ */
function initScrollAnimations() {
  if (!window.gsap || !window.ScrollTrigger) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  gsap.registerPlugin(ScrollTrigger);

  const ENTER = { opacity: 0, y: 16, duration: 0.5, ease: 'power2.out' };

  /* 個別元素 fade-up */
  [
    '.services-block__tagline',
    '.services-block__header',
    '.service-areas__content',
    '.why__title',
    '.why__mascot',
    '.testimonials__title',
    '.testimonials__intro',
    '.testimonials__slider',
    '.gallery__content',
  ].forEach(sel => {
    const el = document.querySelector(sel);
    if (!el) return;
    gsap.from(el, {
      ...ENTER,
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
    });
  });

  /* 群組 stagger fade-up */
  [
    ['.services-block__grid', '.service-card'],
    ['.why__features',        '.why-feature'],
    ['.testimonials__badges', 'li'],
    ['.gallery__grid',        '.gallery__item'],
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

  /* Services headline em — underline 隨 scroll 進度左右展開（往上捲會倒退） */
  const ems = document.querySelectorAll('.services-block__headline-em');
  if (ems.length) {
    gsap.fromTo(ems,
      { backgroundSize: '0% 0.375rem' },
      {
        backgroundSize: '100% 0.375rem',
        ease: 'none',                    /* scrub 需要 linear */
        stagger: 0.2,
        scrollTrigger: {
          trigger: '.services-block__headline',
          start: 'top 80%',
          end:   'top 30%',
          scrub: 0.5,                    /* 0.5s smoothing；true = 直接綁 */
        },
      }
    );
  }

  /* Service-areas map — 額外加輕微 scale */
  const map = document.querySelector('.service-areas__map');
  if (map) {
    gsap.from(map, {
      opacity: 0,
      scale: 0.95,
      duration: 0.55,
      ease: 'power2.out',
      scrollTrigger: { trigger: map, start: 'top 85%', once: true },
    });
  }

  /* FAQ title — 個別 fade-up */
  const faqTitle = document.querySelector('.faq__title');
  if (faqTitle) {
    gsap.from(faqTitle, {
      ...ENTER,
      scrollTrigger: { trigger: faqTitle, start: 'top 85%', once: true },
    });
  }
}

/* Floating CTA 配色：footer (injected) data-bg 載入後才能完整偵測 */
document.addEventListener('components:ready', () => {
  initFloatingCtaBg();
});
