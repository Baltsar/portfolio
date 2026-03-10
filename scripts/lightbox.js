let lightboxProject = null;
let lightboxCurrentId = null;

function buildLightboxHTML(img, images) {
  const idx = images.findIndex(i => i.id === img.id);
  const total = images.length;
  const hasPrev = idx > 0;
  const hasNext = idx < total - 1;

  // Media slot left empty for videos — filled via injectLightboxVideo after render
  const mediaHTML = img.src
    ? `<img class="lb-image" src="${img.src}" alt="${img.filename}">`
    : img.videoSrc
      ? `<div class="lb-video-slot"></div>`
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

function injectLightboxVideo(el, videoSrc) {
  const slot = el.querySelector('.lb-video-slot');
  if (!slot) return;
  const video = document.createElement('video');
  video.autoplay = true;
  video.loop = true;
  video.muted = true;
  video.setAttribute('playsinline', '');
  video.className = 'lb-video';
  video.src = videoSrc.webm || videoSrc.mp4;
  slot.replaceWith(video);
  video.load();
  video.play().catch(() => {});
}

function renderLightbox(imgId) {
  if (!lightboxProject) return;
  const images = lightboxProject.caseStudy.images;
  const img = images.find(i => i.id === imgId);
  if (!img) return;

  lightboxCurrentId = imgId;
  const el = document.getElementById('case-lightbox');

  // Pause any existing video before replacing
  const existingVideo = el.querySelector('video');
  if (existingVideo) existingVideo.pause();

  el.innerHTML = buildLightboxHTML(img, images);

  // Inject video via createElement (innerHTML drops <source> children)
  if (img.videoSrc) injectLightboxVideo(el, img.videoSrc);

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

  // Mobile swipe-down to close
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

  // Render content while still hidden — avoids layout thrash on show
  renderLightbox(imgId);
  document.body.style.overflow = 'hidden';
  document.addEventListener('keydown', onLightboxKey);
  el.addEventListener('click', onBackdropClick);

  // Show after content is painted (rAF ensures content is flushed first)
  requestAnimationFrame(() => {
    el.classList.add('is-open');
  });
}

export function closeLightbox() {
  const el = document.getElementById('case-lightbox');
  if (!el) return;

  el.classList.remove('is-open');
  document.body.style.overflow = '';
  document.removeEventListener('keydown', onLightboxKey);
  el.removeEventListener('click', onBackdropClick);

  // Clear content after CSS fade-out finishes (150ms matches transition)
  el.addEventListener('transitionend', function cleanup() {
    if (!el.classList.contains('is-open')) {
      const vid = el.querySelector('video');
      if (vid) vid.pause();
      el.innerHTML = '';
      lightboxProject = null;
      lightboxCurrentId = null;
    }
    el.removeEventListener('transitionend', cleanup);
  });
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
  if (!document.getElementById('case-lightbox')) {
    const el = document.createElement('div');
    el.id = 'case-lightbox';
    document.body.appendChild(el);
  }
}
