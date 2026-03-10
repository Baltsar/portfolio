let lightboxProject = null;
let lightboxCurrentId = null;

function buildLightboxHTML(img, images) {
  const idx = images.findIndex(i => i.id === img.id);
  const total = images.length;
  const hasPrev = idx > 0;
  const hasNext = idx < total - 1;

  const mediaHTML = img.src
    ? `<img class="lb-image" src="${img.src}" alt="${img.filename}">`
    : `<div class="lb-placeholder">${img.placeholder}</div>`;

  return `
    <div class="lb-inner">
      <button class="lb-close" id="lb-close" aria-label="Stäng">×</button>
      <div class="lb-media">
        ${mediaHTML}
      </div>
      <div class="lb-caption">
        <div class="lb-caption-fn">${img.filename}</div>
        <div class="lb-caption-desc">${img.caption}</div>
        <div class="lb-caption-idx">${idx + 1} / ${total}</div>
      </div>
      <div class="lb-nav">
        <button class="lb-prev${hasPrev ? '' : ' lb-nav-hidden'}" id="lb-prev" aria-label="Föregående">◀</button>
        <button class="lb-next${hasNext ? '' : ' lb-nav-hidden'}" id="lb-next" aria-label="Nästa">▶</button>
      </div>
    </div>
  `;
}

function renderLightbox(imgId) {
  if (!lightboxProject) return;
  const images = lightboxProject.caseStudy.images;
  const img = images.find(i => i.id === imgId);
  if (!img) return;

  lightboxCurrentId = imgId;
  const el = document.getElementById('case-lightbox');
  el.innerHTML = buildLightboxHTML(img, images);

  // Close button
  document.getElementById('lb-close').addEventListener('click', closeLightbox);

  // Prev / Next
  const prevBtn = document.getElementById('lb-prev');
  const nextBtn = document.getElementById('lb-next');
  if (prevBtn && !prevBtn.classList.contains('lb-nav-hidden')) {
    prevBtn.addEventListener('click', () => {
      const idx = images.findIndex(i => i.id === lightboxCurrentId);
      if (idx > 0) renderLightbox(images[idx - 1].id);
    });
  }
  if (nextBtn && !nextBtn.classList.contains('lb-nav-hidden')) {
    nextBtn.addEventListener('click', () => {
      const idx = images.findIndex(i => i.id === lightboxCurrentId);
      if (idx < images.length - 1) renderLightbox(images[idx + 1].id);
    });
  }

  // Click backdrop to close (listener added once in openLightbox, not here)

  // Mobile swipe-down to close (only when at top)
  let lbTouchStartY = 0;
  let lbTouchStartTime = 0;
  const inner = el.querySelector('.lb-inner');
  if (inner) {
    inner.addEventListener('touchstart', (e) => {
      lbTouchStartY = e.touches[0].clientY;
      lbTouchStartTime = Date.now();
    }, { passive: true });
    inner.addEventListener('touchend', (e) => {
      const dy = e.changedTouches[0].clientY - lbTouchStartY;
      const dt = Date.now() - lbTouchStartTime;
      if (dy > 80 && dt < 300) closeLightbox();
    }, { passive: true });
  }
}

function onBackdropClick(e) {
  if (e.target === document.getElementById('case-lightbox')) closeLightbox();
}

export function openLightbox(imgId, project) {
  lightboxProject = project;
  const el = document.getElementById('case-lightbox');
  if (!el) return;
  el.classList.add('is-open');
  document.body.style.overflow = 'hidden';
  renderLightbox(imgId);
  document.addEventListener('keydown', onLightboxKey);
  el.addEventListener('click', onBackdropClick);
}

export function closeLightbox() {
  const el = document.getElementById('case-lightbox');
  if (!el) return;
  el.classList.remove('is-open');
  el.innerHTML = '';
  lightboxProject = null;
  lightboxCurrentId = null;
  document.body.style.overflow = '';
  document.removeEventListener('keydown', onLightboxKey);
  el.removeEventListener('click', onBackdropClick);
}

function onLightboxKey(e) {
  if (!lightboxProject) return;
  const images = lightboxProject.caseStudy.images;
  const idx = images.findIndex(i => i.id === lightboxCurrentId);
  if (e.key === 'Escape') {
    closeLightbox();
  } else if (e.key === 'ArrowLeft' && idx > 0) {
    renderLightbox(images[idx - 1].id);
  } else if (e.key === 'ArrowRight' && idx < images.length - 1) {
    renderLightbox(images[idx + 1].id);
  }
}

export function initLightbox() {
  // Ensure the lightbox container exists in the DOM
  if (!document.getElementById('case-lightbox')) {
    const el = document.createElement('div');
    el.id = 'case-lightbox';
    document.body.appendChild(el);
  }
}
