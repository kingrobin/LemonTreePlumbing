/* ============================================================
   components.js — 全站共用互動
   Exports: window.initSlider, window.initFAQ, window.initFloatingCtaBg
   ============================================================ */

/* ---------- Slider (drag + scroll-snap + optional dots) ----------
   用法:
     initSlider(rootEl, { pageCount: 3 })   // 固定分頁數
     initSlider(rootEl, { auto: true })     // 根據視窗自動算可見卡數 → dots
   options:
     pageCount      — 固定分頁數
     auto           — 自動模式：根據 track 寬 / 卡片寬算可見數，動態 dots
     dragThreshold  — 視為拖曳的 px 閾值（預設 5）
============================================================ */
function initSlider(rootEl, opts = {}) {
  const root = typeof rootEl === 'string' ? document.querySelector(rootEl) : rootEl;
  if (!root) return;
  const track = root.querySelector('.slider__track');
  if (!track) return;

  const dragThreshold = opts.dragThreshold ?? 5;
  const isAuto = opts.auto === true;
  const items = Array.from(track.children);
  const dotsEl = root.querySelector('.slider__dots');

  let itemsPerPage = 1;
  let pageCount = 0;
  let dotEls = [];
  let io = null;
  let scrollLockUntil = 0;                    /* timestamp — IO 在此之前不要動 active dot */

  function computePages() {
    if (isAuto) {
      const trackWidth = track.clientWidth;
      if (trackWidth <= 0 || items.length === 0) return { perPage: 1, pages: 0 };
      const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap || 0);
      const cardWidth = items[0].offsetWidth + gap;
      const perPage = Math.max(1, Math.round(trackWidth / cardWidth));
      return { perPage, pages: Math.ceil(items.length / perPage) };
    }
    const pages = opts.pageCount || 0;
    return { perPage: pages > 0 ? Math.ceil(items.length / pages) : 1, pages };
  }

  function setActive(pageIdx) {
    dotEls.forEach((d, i) => d.classList.toggle('is-active', i === pageIdx));
  }

  function renderDots() {
    const computed = computePages();
    itemsPerPage = computed.perPage;
    pageCount = computed.pages;

    if (io) { io.disconnect(); io = null; }

    if (!dotsEl) return;

    if (pageCount <= 1) {
      dotsEl.innerHTML = '';
      dotEls = [];
      return;
    }

    dotsEl.innerHTML = Array.from({ length: pageCount }, (_, i) =>
      `<li><button class="slider__dot${i === 0 ? ' is-active' : ''}" type="button" data-page="${i}" aria-label="Page ${i + 1}"></button></li>`
    ).join('');
    dotEls = Array.from(dotsEl.querySelectorAll('.slider__dot'));

    dotEls.forEach(d => {
      d.addEventListener('click', () => {
        const pageIdx = Number(d.dataset.page);
        const itemIdx = Math.min(pageIdx * itemsPerPage, items.length - 1);
        scrollLockUntil = Date.now() + 700;   /* 鎖定 700ms，避免 smooth scroll 中途的 IO 觸發跳 dot */
        items[itemIdx].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
        setActive(pageIdx);
      });
    });

    io = new IntersectionObserver((entries) => {
      if (Date.now() < scrollLockUntil) return;
      /* 找出 intersection ratio 最高的卡片，避免中途多張同時觸發造成抖動 */
      let best = null;
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
          if (!best || entry.intersectionRatio > best.intersectionRatio) best = entry;
        }
      });
      if (!best) return;
      const itemIdx = items.indexOf(best.target);
      if (itemIdx >= 0) {
        const pageIdx = Math.min(Math.floor(itemIdx / itemsPerPage), pageCount - 1);
        setActive(pageIdx);
      }
    }, { root: track, threshold: [0.6, 0.9] });
    items.forEach(c => io.observe(c));
  }

  renderDots();

  /* ---- 視窗 resize 時，auto 模式重新生成 dots ---- */
  if (isAuto) {
    let resizeTimer = null;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(renderDots, 150);
    });
  }

  /* ---- 滑鼠滾輪：讓頁面正常垂直捲動，不被 slider 攔截 ---- */
  track.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault();
      window.scrollBy({ top: e.deltaY, left: 0 });
    }
  }, { passive: false });

  /* ---- Mouse drag-to-scroll ---- */
  let isDown = false;
  let startX = 0;
  let startScroll = 0;
  let moved = 0;

  track.addEventListener('mousedown', (e) => {
    isDown = true;
    moved = 0;
    startX = e.pageX;
    startScroll = track.scrollLeft;
    track.classList.add('is-dragging');
  });

  track.addEventListener('mouseleave', () => { if (isDown) endDrag(); });
  window.addEventListener('mouseup',   () => { if (isDown) endDrag(); });

  track.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const dx = e.pageX - startX;
    moved = Math.abs(dx);
    track.scrollLeft = startScroll - dx;
  });

  // 拖曳後阻止 click（防止誤觸卡片連結）
  track.addEventListener('click', (e) => {
    if (moved > dragThreshold) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, true);

  function endDrag() {
    isDown = false;
    track.classList.remove('is-dragging');
  }
}


/* ---------- FAQ accordion (一次只開一項) ---------- */
function initFAQ(rootSel = document) {
  const root = typeof rootSel === 'string' ? document.querySelector(rootSel) : rootSel;
  if (!root) return;
  const items = Array.from(root.querySelectorAll('.faq-item'));
  items.forEach(item => {
    const header = item.querySelector('.faq-item__header');
    if (!header) return;
    header.addEventListener('click', () => {
      const willOpen = !item.classList.contains('is-open');
      items.forEach(other => {
        other.classList.toggle('is-open', other === item && willOpen);
        const otherHeader = other.querySelector('.faq-item__header');
        if (otherHeader) otherHeader.setAttribute('aria-expanded', String(other === item && willOpen));
      });
    });
  });
}

/* ---------- Floating CTA — 依背後 section 的 data-bg 切換配色 ---------- */
function initFloatingCtaBg() {
  const cta = document.querySelector('.floating-cta');
  if (!cta) return;
  const sections = Array.from(document.querySelectorAll('[data-bg]'));
  if (sections.length === 0) return;

  function update() {
    const rect = cta.getBoundingClientRect();
    const probeY = rect.top + rect.height / 2;
    let match = null;
    for (const sec of sections) {
      const r = sec.getBoundingClientRect();
      if (r.top <= probeY && r.bottom > probeY) { match = sec; break; }
    }
    cta.classList.remove('floating-cta--on-yellow', 'floating-cta--on-dark', 'floating-cta--on-light');
    if (match) cta.classList.add('floating-cta--on-' + match.dataset.bg);
  }

  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { update(); ticking = false; });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
}

/* ---------- Lightbox (click image → fullscreen overlay) ----------
   用法: initLightbox('.gallery__grid')  — 掃描內部所有 <img> 當作 slides
   - 點縮圖開大圖；同一張 src 直接放大顯示
   - ESC / 點 backdrop / × 關閉
   - 左右鍵 / ‹ › 切換；切換時預載相鄰圖
============================================================ */
function initLightbox(scopeSel) {
  const scope = document.querySelector(scopeSel);
  if (!scope) return;
  const triggers = Array.from(scope.querySelectorAll('img'));
  if (triggers.length === 0) return;

  const sources = triggers.map(img => ({ src: img.src, alt: img.alt || '' }));
  let current = 0;

  const lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.setAttribute('aria-hidden', 'true');
  lb.innerHTML = `
    <button class="lightbox__close" aria-label="Close">&times;</button>
    <button class="lightbox__nav lightbox__nav--prev" aria-label="Previous">&lsaquo;</button>
    <button class="lightbox__nav lightbox__nav--next" aria-label="Next">&rsaquo;</button>
    <div class="lightbox__stage"><img class="lightbox__img" alt=""></div>
  `;
  document.body.appendChild(lb);

  const imgEl = lb.querySelector('.lightbox__img');
  const stage = lb.querySelector('.lightbox__stage');

  function render() {
    const s = sources[current];
    imgEl.src = s.src;
    imgEl.alt = s.alt;
  }
  function preload() {
    [(current + 1) % sources.length, (current - 1 + sources.length) % sources.length]
      .forEach(i => { const p = new Image(); p.src = sources[i].src; });
  }
  function open(i) {
    current = i;
    render();
    lb.classList.add('is-open');
    lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    preload();
  }
  function close() {
    lb.classList.remove('is-open');
    lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  /* 前後翻頁時跳過被隱藏的圖（gallery 頁篩選用；全可見時行為不變）*/
  function step(dir) {
    for (let n = 0; n < sources.length; n++) {
      current = (current + dir + sources.length) % sources.length;
      if (triggers[current].offsetParent !== null) break;
    }
    render(); preload();
  }
  function next() { step(1); }
  function prev() { step(-1); }

  triggers.forEach((img, i) => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => open(i));
  });

  lb.addEventListener('click', (e) => {
    if (e.target === lb || e.target === stage) close();
  });
  lb.querySelector('.lightbox__close').addEventListener('click', close);
  lb.querySelector('.lightbox__nav--next').addEventListener('click', next);
  lb.querySelector('.lightbox__nav--prev').addEventListener('click', prev);

  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('is-open')) return;
    if (e.key === 'Escape')     close();
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft')  prev();
  });
}

// Expose for other scripts
window.initSlider         = initSlider;
window.initFAQ            = initFAQ;
window.initFloatingCtaBg  = initFloatingCtaBg;
window.initLightbox       = initLightbox;
