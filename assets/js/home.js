/* ============================================================
   home.js — 首頁專屬互動
   GSAP scroll/hover animations etc.
   ============================================================ */

/* ---------- Testimonials slider (dots + scroll-snap + mouse drag) ---------- */
function initTestimonialsSlider() {
  const list = document.getElementById('testimonialList');
  const dots = document.getElementById('testimonialDots');
  if (!list || !dots) return;

  const cards = Array.from(list.querySelectorAll('.testimonial-card'));
  if (cards.length === 0) return;

  // 3 dots, each represents a "page" of cards
  const PAGE_COUNT = 3;
  const cardsPerPage = Math.ceil(cards.length / PAGE_COUNT);

  // Build dots
  dots.innerHTML = Array.from({ length: PAGE_COUNT }, (_, i) =>
    `<li><button class="testimonials__dot${i === 0 ? ' is-active' : ''}" type="button" data-page="${i}" aria-label="Review page ${i + 1}"></button></li>`
  ).join('');

  const dotEls = Array.from(dots.querySelectorAll('.testimonials__dot'));

  function setActive(pageIdx) {
    dotEls.forEach((d, i) => d.classList.toggle('is-active', i === pageIdx));
  }

  // Click dot → scroll to first card of that page
  dotEls.forEach(d => {
    d.addEventListener('click', () => {
      const pageIdx = Number(d.dataset.page);
      const cardIdx = Math.min(pageIdx * cardsPerPage, cards.length - 1);
      cards[cardIdx].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
      setActive(pageIdx);
    });
  });

  // Update active dot on scroll based on which page the visible card is in
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
        const cardIdx = cards.indexOf(entry.target);
        if (cardIdx >= 0) {
          const pageIdx = Math.min(Math.floor(cardIdx / cardsPerPage), PAGE_COUNT - 1);
          setActive(pageIdx);
        }
      }
    });
  }, { root: list, threshold: [0.6] });

  cards.forEach(c => io.observe(c));

  /* ----- 滑鼠滾輪：讓頁面正常垂直捲動，不被 slider 攔截橫向滾動 ----- */
  list.addEventListener('wheel', (e) => {
    // 若使用者用 Shift+wheel 或 trackpad 橫向 swipe（deltaX 主導），允許 slider 橫滾
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault();
      window.scrollBy({ top: e.deltaY, left: 0 });
    }
  }, { passive: false });

  /* ----- Mouse drag-to-scroll ----- */
  let isDown = false;
  let startX = 0;
  let startScroll = 0;
  let moved = 0;

  list.addEventListener('mousedown', (e) => {
    isDown = true;
    moved = 0;
    startX = e.pageX;
    startScroll = list.scrollLeft;
    list.classList.add('is-dragging');
  });

  list.addEventListener('mouseleave', () => {
    if (isDown) endDrag();
  });

  window.addEventListener('mouseup', () => {
    if (isDown) endDrag();
  });

  list.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const dx = e.pageX - startX;
    moved = Math.abs(dx);
    list.scrollLeft = startScroll - dx;
  });

  // Prevent click on cards if user just dragged
  list.addEventListener('click', (e) => {
    if (moved > 5) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, true);

  function endDrag() {
    isDown = false;
    list.classList.remove('is-dragging');
  }
}

/* ---------- FAQ accordion ---------- */
function initFAQ() {
  const items = document.querySelectorAll('.faq-item');
  items.forEach(item => {
    const header = item.querySelector('.faq-item__header');
    if (!header) return;
    header.addEventListener('click', () => {
      const isOpen = item.classList.toggle('is-open');
      header.setAttribute('aria-expanded', String(isOpen));
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // Hero entrance animation (GSAP)
  if (window.gsap) {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.9 } });
    tl.from('.hero__eyebrow', { y: 20, opacity: 0 })
      .from('.hero__h1',      { y: 30, opacity: 0 }, '-=0.6')
      .from('.hero__cta',     { y: 20, opacity: 0 }, '-=0.5')
      .from('.hero__trust-item', { y: 20, opacity: 0, stagger: 0.12 }, '-=0.4');
  }

  initTestimonialsSlider();
  initFAQ();
});
