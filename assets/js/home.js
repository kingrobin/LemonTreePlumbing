/* ============================================================
   home.js — 首頁專屬互動
   GSAP entrance + 呼叫共用 component init
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Hero entrance animation (GSAP)
  if (window.gsap) {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.9 } });
    tl.from('.hero__eyebrow', { y: 20, opacity: 0 })
      .from('.hero__h1',      { y: 30, opacity: 0 }, '-=0.6')
      .from('.hero__cta',     { y: 20, opacity: 0 }, '-=0.5')
      .from('.trust-bar__item', { y: 20, opacity: 0, stagger: 0.12 }, '-=0.4');
  }

  // Testimonials slider — dots 隨可見卡數自動計算
  initSlider('.testimonials__inner', { auto: true });

  // FAQ accordion
  initFAQ();
});

/* Floating CTA 配色：footer (injected) data-bg 載入後才能完整偵測 */
document.addEventListener('components:ready', () => {
  initFloatingCtaBg();
});
