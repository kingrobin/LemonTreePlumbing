
document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initFAQ();
});

function initScrollAnimations() {
  if (!window.gsap || !window.ScrollTrigger) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  gsap.registerPlugin(ScrollTrigger);

  const ENTER = { opacity: 0, y: 16, duration: 0.5, ease: 'power2.out' };

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

document.addEventListener('components:ready', () => {
  if (window.initFloatingCtaBg) initFloatingCtaBg();
});
