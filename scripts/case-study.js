import { projects } from './render.js';
import { spinnerSets, activeSpinners, spinOnHover } from './spinners.js';

let currentProject = null;

function renderSection(section, spinSet) {
  const type = section.type || 'text';

  if (type === 'html') {
    return section.text;
  }

  if (type === 'intro') {
    return `<p class="case-intro">${section.text}</p>`;
  }

  if (type === 'quote') {
    const attr = section.attr ? `<span class="quote-attr">— ${section.attr}</span>` : '';
    return `<div class="case-quote">"${section.text}"${attr}</div>`;
  }

  if (type === 'stats') {
    const statsHTML = section.items.map(s => {
      const colorClass = s.color ? ` ${s.color}` : '';
      return `<div class="case-stat"><div class="stat-number${colorClass}">${s.value}</div><div class="stat-label">${s.label}</div></div>`;
    }).join('');
    return `<div class="case-stats">${statsHTML}</div>`;
  }

  if (type === 'list') {
    const restingGlyph = section.resting || '>';
    const itemsHTML = section.items.map(item =>
      `<li data-spinner="${spinSet}"><span class="list-glyph">${restingGlyph}</span><span>${item}</span></li>`
    ).join('');
    return `<ul class="case-list">${itemsHTML}</ul>`;
  }

  // Default: text
  const refHTML = section.imgRef
    ? ` <span class="img-ref" data-img="${section.imgRef.id}" data-spinner="${spinSet}"><span class="list-glyph">\u229E</span> ${section.imgRef.filename}</span>`
    : '';
  return `<p>${section.text}${refHTML}</p>`;
}

function buildCaseHTML(project) {
  const cs = project.caseStudy;
  const artClass = project.artPlaceholder;
  const spinSet = project.spinnerSet || 'braille';

  const paragraphsHTML = cs.sections.map(s => renderSection(s, spinSet)).join('');

  const finderHTML = cs.finderFiles.map((f, i) => `
    <div class="finder-file${i === 0 ? ' selected' : ''}" data-finder-img="${i + 1}" data-spinner="${spinSet}">
      <div class="file-icon"><div class="file-icon-ph"><span class="list-glyph">${f.type}</span></div></div>
      <span class="file-name">${f.name}</span>
      <span class="file-size">${f.size}</span>
      <span class="file-date">${f.date}</span>
    </div>
  `).join('');

  const metaHTML = cs.meta.map(m => `
    <div class="case-meta-item">
      <span class="meta-label">${m.label}</span>
      <span class="meta-value"${m.color ? ` style="color:${m.color}"` : ''}>${m.value}</span>
    </div>
  `).join('');

  const firstImg = cs.images[0];

  return `
    <div class="mac-window case-popup">
      <div class="mac-titlebar">
        <div class="mac-btn-close" id="case-close"></div>
        <div class="mac-title">${project.windowTitle} \u2014 case study</div>
      </div>
      <div class="mac-content">
        <div class="case-body">
          <div class="case-hero">
            <div class="project-art ${artClass}">
              <div class="scan${project.scanClass ? ' ' + project.scanClass : ''}"></div>
              <div class="project-overlay">
                <div class="overlay-text">
                  <div class="overlay-title">${cs.heroTitle}</div>
                  <div class="overlay-sub">${cs.heroSub}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="case-split">
            <div class="case-text-col">
              <h2>${cs.title}</h2>
              ${paragraphsHTML}
            </div>

            <div class="case-preview-col">
              <div class="case-preview-img" id="preview-img">
                <div class="preview-ph" id="preview-ph">${firstImg ? firstImg.placeholder : ''}</div>
              </div>
              <div class="case-preview-caption" id="preview-caption">
                <div class="caption-fn" id="cap-fn">${firstImg ? firstImg.filename : ''}</div>
                <div class="caption-desc" id="cap-desc">${firstImg ? firstImg.caption : ''}</div>
                <div class="caption-idx" id="cap-idx">${firstImg ? '1 / ' + cs.images.length : ''}</div>
              </div>
            </div>
          </div>

          <div class="case-finder">
            <div class="finder-toolbar">
              <span class="finder-path">${cs.finderPath}</span>
            </div>
            <div class="finder-list">
              ${finderHTML}
            </div>
          </div>

          <div class="case-meta">
            ${metaHTML}
          </div>
        </div>
      </div>
    </div>
  `;
}

function showPreview(imgId) {
  if (!currentProject) return;
  const img = currentProject.caseStudy.images.find(i => i.id === imgId);
  if (!img) return;

  const phEl = document.getElementById('preview-ph');
  const fnEl = document.getElementById('cap-fn');
  const descEl = document.getElementById('cap-desc');
  const idxEl = document.getElementById('cap-idx');

  if (phEl) phEl.innerHTML = img.placeholder;
  if (fnEl) fnEl.textContent = img.filename;
  if (descEl) descEl.textContent = img.caption;
  if (idxEl) idxEl.textContent = `${img.id} / ${currentProject.caseStudy.images.length}`;

  document.querySelectorAll('.img-ref').forEach(r => r.classList.remove('ref-active'));
  const active = document.querySelector(`.img-ref[data-img="${imgId}"]`);
  if (active) active.classList.add('ref-active');

  document.querySelectorAll('.finder-file').forEach(f => f.classList.remove('selected'));
  const finderFile = document.querySelector(`.finder-file[data-finder-img="${imgId}"]`);
  if (finderFile) finderFile.classList.add('selected');
}

let caseNudgeTimers = [];

function initCaseSpinners() {
  const items = [];

  // Img refs in text
  document.querySelectorAll('.case-popup .img-ref[data-spinner]').forEach(ref => {
    const glyph = ref.querySelector('.list-glyph');
    if (!glyph) return;
    const setName = ref.dataset.spinner;
    const chars = spinnerSets[setName] || spinnerSets.braille;
    const resting = '\u229E';

    items.push({ el: ref, glyph, chars, resting });
    spinOnHover(ref, glyph, chars, resting);
  });

  // Case list items — always spinning
  document.querySelectorAll('.case-popup .case-list li[data-spinner]').forEach((li, i) => {
    const glyph = li.querySelector('.list-glyph');
    if (!glyph) return;
    const setName = li.dataset.spinner;
    const chars = spinnerSets[setName] || spinnerSets.braille;
    let frame = Math.floor(Math.random() * chars.length);

    function tick() {
      glyph.textContent = chars[frame % chars.length];
      frame++;
      li._spinTimer = setTimeout(tick, 300);
    }
    // Stagger start
    setTimeout(tick, i * 80 + Math.random() * 200);
  });

  // Finder file rows
  document.querySelectorAll('.case-popup .finder-file[data-spinner]').forEach(row => {
    const glyph = row.querySelector('.list-glyph');
    if (!glyph) return;
    const setName = row.dataset.spinner;
    const chars = spinnerSets[setName] || spinnerSets.braille;
    const resting = glyph.textContent;

    items.push({ el: row, glyph, chars, resting });

    row.addEventListener('mouseenter', () => {
      if (activeSpinners.has(row)) clearInterval(activeSpinners.get(row));
      let frame = 0;
      const total = 8 + Math.floor(Math.random() * 4);
      const iv = setInterval(() => {
        if (frame < total) {
          glyph.textContent = chars[frame % chars.length];
          frame++;
        } else {
          glyph.textContent = resting;
          clearInterval(iv);
          activeSpinners.delete(row);
        }
      }, 55);
      activeSpinners.set(row, iv);
    });

    row.addEventListener('mouseleave', () => {
      if (activeSpinners.has(row)) {
        clearInterval(activeSpinners.get(row));
        activeSpinners.delete(row);
      }
      glyph.textContent = resting;
    });
  });

  // Idle nudge for case study items
  function nudgeCase() {
    if (items.length === 0) return;
    const item = items[Math.floor(Math.random() * items.length)];
    if (activeSpinners.has(item.el) || item.el.matches(':hover')) {
      scheduleCaseNudge();
      return;
    }
    let f = 0;
    const twitchLen = 2 + Math.floor(Math.random() * 3);
    const iv = setInterval(() => {
      if (f < twitchLen) {
        item.glyph.textContent = item.chars[Math.floor(Math.random() * item.chars.length)];
        f++;
      } else {
        item.glyph.textContent = item.resting;
        clearInterval(iv);
      }
    }, 65);
    scheduleCaseNudge();
  }

  function scheduleCaseNudge() {
    const tid = setTimeout(nudgeCase, 2000 + Math.random() * 4000);
    caseNudgeTimers.push(tid);
  }

  scheduleCaseNudge();
  scheduleCaseNudge();
}

function openCase(projectId) {
  const project = projects.find(p => p.id === projectId);
  if (!project) return;

  currentProject = project;
  const backdrop = document.getElementById('case-backdrop');
  backdrop.innerHTML = buildCaseHTML(project);
  backdrop.classList.add('is-open');
  document.body.style.overflow = 'hidden';

  // Close button
  const closeBtn = document.getElementById('case-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeCase);
  }

  // Image ref hover + click
  const isMobile = window.innerWidth <= 768;
  document.querySelectorAll('.case-popup .img-ref').forEach(ref => {
    const imgId = parseInt(ref.dataset.img);
    ref.addEventListener('click', (e) => {
      e.preventDefault();
      showPreview(imgId);
    });
    if (!isMobile) {
      ref.addEventListener('mouseenter', () => showPreview(imgId));
    }
  });

  // Finder file clicks
  document.querySelectorAll('.case-popup .finder-file').forEach(file => {
    const imgId = parseInt(file.dataset.finderImg);
    file.addEventListener('click', () => showPreview(imgId));
  });

  // Mark first ref as active
  const firstRef = document.querySelector('.case-popup .img-ref');
  if (firstRef) firstRef.classList.add('ref-active');

  // Init glyph spinners in case study
  initCaseSpinners();

  // Mobile tooltip tap support
  if (window.innerWidth <= 768) {
    document.querySelectorAll('.case-popup .term').forEach(term => {
      term.addEventListener('click', (e) => {
        e.stopPropagation();
        document.querySelectorAll('.case-popup .term.tip-active').forEach(t => {
          if (t !== term) t.classList.remove('tip-active');
        });
        term.classList.toggle('tip-active');
      });
    });
  }

  // Close on backdrop click
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) closeCase();
  });

  document.addEventListener('keydown', onEscape);
}

function onEscape(e) {
  if (e.key === 'Escape') closeCase();
}

function closeCase() {
  // Clear list spinner timers
  document.querySelectorAll('.case-popup .case-list li').forEach(li => {
    if (li._spinTimer) clearTimeout(li._spinTimer);
  });
  const backdrop = document.getElementById('case-backdrop');
  backdrop.classList.remove('is-open');
  backdrop.innerHTML = '';
  document.body.style.overflow = '';
  currentProject = null;
  document.removeEventListener('keydown', onEscape);
  // Clear nudge timers
  caseNudgeTimers.forEach(t => clearTimeout(t));
  caseNudgeTimers = [];
}

export function initCaseStudy() {
  document.querySelectorAll('.open-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const win = btn.closest('.mac-window');
      if (!win) return;
      const projectId = win.dataset.project;
      if (projectId) openCase(projectId);
    });
  });
}
