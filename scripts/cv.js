import { prepareWithSegments, layoutNextLine } from '@chenglou/pretext';

// ── A4 geometry ───────────────────────────────────────────────────
const A4_W   = 794;
const A4_H   = 1123;
const PAD_X  = 60;
const PAD_Y  = 52;
const CONT_W = A4_W - 2 * PAD_X;   // 674
const CONT_H = A4_H - 2 * PAD_Y;   // 1019

const CARD_W  = 196;
const CARD_ML = 26;
const CARD_MR = 10;

// ── Attacker constants ────────────────────────────────────────────
const ATCK_W      = 36;
const ATCK_H      = 27;
const ATCK_MARGIN = 5;
const ATCK_GLYPHS = [
  // Arrows
  '←','→','↑','↓','↗','↘','↙','↖',
  // Blocks & fills
  '▓','▒','░','█','▊','▌','▖','▘','▚','▞',
  // Circles & spinners
  '◐','◑','◒','◓','○','●','◔','◕',
  // Triangles
  '◢','◣','◤','◥','▲','▼',
  // Box corners
  '╔','╗','╚','╝',
  // Terminal craft originals
  '⌐','⊕','⊗','⌘','⚙','✎','⌦','⌫',
  // Braille spinners
  '⠋','⠙','⠸','⠴','⠦','⠇',
];
const SPIN_CHARS = ['↑','↗','→','↘','↓','↙','←','↖'];
let spinInterval = null;
let spinIdx      = 0;
const ATCK_COLORS = [
  { bg: '#faf3e6',              border: '#8a7352',              text: '#1a1408' },
  { bg: 'rgba(0,51,255,0.1)',   border: 'rgba(0,51,255,0.45)',  text: '#0033ff' },
  { bg: 'rgba(51,255,51,0.08)', border: 'rgba(26,140,26,0.5)',  text: '#1a5c1a' },
];

// ── Fonts ─────────────────────────────────────────────────────────
const MONO    = 'IBM Plex Mono';
const DISPLAY = 'Space Mono';

function fontStr(sizePx, b = {}) {
  const variant = b.bold ? 'bold ' : b.italic ? 'italic ' : '';
  return `${variant}${sizePx}px ${b.display ? DISPLAY : MONO}`;
}

// ── Card state (content-area coordinates) ─────────────────────────
// Default: upper-right corner — leaves a wide ~450px left column for text
let cardX   = CONT_W - CARD_W;
let cardTop = 0;
let cardH   = 0;

function positionCard(el) {
  el.style.left = (PAD_X + cardX)   + 'px';
  el.style.top  = (PAD_Y + cardTop) + 'px';
}

// ── Attacker state ────────────────────────────────────────────────
const attackers     = [];
let   attackMode    = false;
let   attackFrame   = null;
let   lastAttackT   = 0;
let   attackRenderN = 0;

// ── Generalized segment system ────────────────────────────────────
// Returns horizontal ranges available for text at content-area y.
// multiCol=true  → body text: ALL available columns (left + right of obstacles)
// multiCol=false → headings/titles: ONLY the leftmost column (no right-column bleed)
function getTextSegments(y, multiCol = true) {
  const excl = [];

  // Photo card
  if (cardH > 0 && y >= cardTop && y < cardTop + cardH) {
    excl.push([Math.max(0, cardX - CARD_ML), Math.min(CONT_W, cardX + CARD_W + CARD_MR)]);
  }

  // Attackers (a.x/a.y in content-area coords)
  for (const a of attackers) {
    if (y >= a.y && y < a.y + a.h) {
      excl.push([Math.max(0, a.x - ATCK_MARGIN), Math.min(CONT_W, a.x + a.w + ATCK_MARGIN)]);
    }
  }

  if (!excl.length) return [{ x: 0, w: CONT_W }];

  // Sort + merge overlapping exclusion intervals
  excl.sort((a, b) => a[0] - b[0]);
  const merged = [[...excl[0]]];
  for (let i = 1; i < excl.length; i++) {
    const last = merged[merged.length - 1];
    if (excl[i][0] <= last[1]) { if (excl[i][1] > last[1]) last[1] = excl[i][1]; }
    else merged.push([...excl[i]]);
  }

  // Gaps = available text columns
  const segs = [];
  let x = 0;
  for (const [a, b] of merged) {
    if (a > x) segs.push({ x, w: a - x });
    x = b;
  }
  if (x < CONT_W) segs.push({ x, w: CONT_W - x });

  const filtered = segs.filter(s => s.w >= 40);

  // Headings/titles: only use the leftmost available segment — never bleed right
  return multiCol ? filtered : filtered.slice(0, 1);
}

// ── CV content blocks ─────────────────────────────────────────────
const BLOCKS = [
  { text: 'Gustaf Garnow',
    scale: 2.4, bold: true, display: true,
    color: 'rgba(26,20,8,1)', mt: 0, mb: 0.65 },

  { text: 'Creative Technologist · Digital Producer · AI-Native',
    scale: 1.05, color: 'rgba(26,20,8,0.55)', mt: 0, mb: 1.1 },

  { text: 'Stockholm, Sweden · gustaf.garnow@gmail.com · github.com/Baltsar · linkedin.com/in/gustafgarnow',
    scale: 0.88, color: 'rgba(26,20,8,0.55)', mt: 0, mb: 0 },

  { type: 'spacer', em: 1.6 },
  { type: 'hr', thick: true },
  { type: 'spacer', em: 2.5 },

  { text: 'EXPERIENCE', scale: 0.85, bold: true, display: true,
    color: 'rgba(26,20,8,0.4)', letterSpacing: '0.16em', mt: 0, mb: 1.1 },
  { type: 'spacer', em: 0.55 },

  { text: 'Creative Technologist & Digital Producer',
    scale: 1.03, bold: true, display: true,
    color: 'rgba(26,20,8,1)', date: '2026 – Present', mt: 0, mb: 0.28 },
  { text: 'Freelance · Stockholm',
    scale: 0.9, italic: true, color: 'rgba(26,20,8,0.6)', mt: 0, mb: 0.45 },
  { text: "Building AI-native tools, shipping products, and running communities.\nShipped kammaren.nu (3:12 tax optimizer live with real users + regulatory monitoring microservice), gustafgarnow.com, and LunarAIstorm (AI agent social network, 48h build).\nFounded OpenSverige — Sweden's largest AI builder community.\nWorks daily with Claude, Claude Code, Cursor, OpenAI Codex, and agent frameworks (OpenClaw, Hermes/Nous Research).\nBuilds with MCP protocols, Discord bots, APIs, Vite, and GitHub.\nAvailable for projects at the intersection of design, AI, and shipping.",
    scale: 1, color: 'rgba(26,20,8,0.88)', mt: 0, mb: 1.4 },

  { text: 'Digital Producer',
    scale: 1.03, bold: true, display: true,
    color: 'rgba(26,20,8,1)', date: '2017 – 2025', mt: 0, mb: 0.28 },
  { text: 'Pension & Finance · Stockholm',
    scale: 0.9, italic: true, color: 'rgba(26,20,8,0.6)', mt: 0, mb: 0.45 },
  { text: "Led digital production for a major Swedish pension provider — 7 years in a regulated environment.\nDelivered 100+ campaigns: display, print, email, and motion graphics.\nBuilt scalable templates and creative systems for recurring campaigns.\nTracked CTR, open rates, and conversions. Maintained brand guidelines and WCAG compliance.\nMade complex pension products comprehensible for everyday Swedes.",
    scale: 1, color: 'rgba(26,20,8,0.88)', mt: 0, mb: 2 },

  { text: 'PROJECTS', scale: 0.85, bold: true, display: true,
    color: 'rgba(26,20,8,0.4)', letterSpacing: '0.16em', mt: 0, mb: 1.1 },
  { type: 'spacer', em: 0.55 },

  { text: 'Kammaren · kammaren.nu',
    scale: 1.03, bold: true, display: true,
    color: 'rgba(26,20,8,1)', date: '2026 – Present', mt: 0, mb: 0.28 },
  { text: "Alla andra automatiserar din bokföring — vi kör en deterministisk state machine som bevisar att varje krona är korrekt, hashad, och revisionsklar innan den lämnar ditt bolag.\nMulti-agent system (CEO, Finance, Auditor, Researcher) for Swedish AB owners.\n3:12 tax optimizer shipped and live — saves owners 50–200k SEK/year.\nBAS 2026 bookkeeping · deterministic VAT · SHA-256 audit trail.\nAccounting firm engaged for independent validation.",
    scale: 1, color: 'rgba(26,20,8,0.88)', mt: 0, mb: 1.4 },

  { text: 'OpenSverige · opensverige.se',
    scale: 1.03, bold: true, display: true,
    color: 'rgba(26,20,8,1)', date: '2026 – Present', mt: 0, mb: 0.28 },
  { text: "Sweden's first community for builders working with AI agents.\n150+ Discord members. Monthly IRL meetups, workshops, and hackathons in Stockholm.\nWe fail fast, build in the open, and ship tools for small businesses and the community.\nMixed bag of ambitions — startup founders, angel investors, hobbyists, and builders.\nFree and open source. Builders, not talkers.",
    scale: 1, color: 'rgba(26,20,8,0.88)', mt: 0, mb: 1.4 },

  { text: 'LunarAIstorm · lunaraistorm.se',
    scale: 1.03, bold: true, display: true,
    color: 'rgba(26,20,8,1)', date: '2026', mt: 0, mb: 0.28 },
  { text: "Swedish social network for AI agents, built in 48 hours. Inspired by Lunarstorm.\nAgents blog, chat, and interact autonomously.\nFrontend lead, design, and OPSEC. Co-built with OpenSverige community members.",
    scale: 1, color: 'rgba(26,20,8,0.88)', mt: 0, mb: 2 },

  { text: 'SKILLS', scale: 0.85, bold: true, display: true,
    color: 'rgba(26,20,8,0.4)', letterSpacing: '0.16em', mt: 0, mb: 1.1 },
  { type: 'spacer', em: 0.55 },

  { text: 'AI & Dev    Claude · Claude Code · Cursor · Codex · MCP · OpenClaw · Hermes (Nous Research) · Discord Bots · APIs · GitHub · Vite · Node.js',
    scale: 0.78, color: 'rgba(26,20,8,0.88)', mt: 0, mb: 0.65 },
  { text: 'Design      Figma · Photoshop · Illustrator · After Effects · Premiere · InDesign',
    scale: 0.78, color: 'rgba(26,20,8,0.88)', mt: 0, mb: 0.65 },
  { text: 'Languages   Swedish (native) · English (professional)',
    scale: 0.78, color: 'rgba(26,20,8,0.88)', mt: 0, mb: 2 },

  { text: 'EDUCATION', scale: 0.85, bold: true, display: true,
    color: 'rgba(26,20,8,0.4)', letterSpacing: '0.16em', mt: 0, mb: 1.1 },
  { type: 'spacer', em: 0.55 },

  { text: 'Digital Content Design',
    scale: 1.03, bold: true, display: true,
    color: 'rgba(26,20,8,1)', date: '2014 – 2016', mt: 0, mb: 0.28 },
  { text: 'Medieinstitutet · Stockholm',
    scale: 0.9, italic: true, color: 'rgba(26,20,8,0.6)', mt: 0, mb: 0.45 },
  { text: 'Digital production, interactive media, and visual communication. Foundation for 10+ years in design — before starting to ship.',
    scale: 1, color: 'rgba(26,20,8,0.88)', mt: 0, mb: 0 },
];

// ── Measure (pretext, no DOM) ─────────────────────────────────────
function measure(baseFontSize, lhMult) {
  let y = 0;
  for (const b of BLOCKS) {
    if (b.type === 'spacer') { y += b.em * baseFontSize; continue; }
    if (b.type === 'hr')     { y += b.thick ? 2 : 1;    continue; }

    const fs      = baseFontSize * b.scale;
    const lh      = fs * lhMult;
    const font    = fontStr(fs, b);
    // Only plain body/skills text wraps into multiple columns.
    // Headings, titles (bold/display), org subtitles (italic) stay left-only.
    const multiCol = !b.bold && !b.display && !b.italic;
    y += (b.mt || 0) * fs;

    for (const part of b.text.split('\n')) {
      if (part === '') { y += lh * 0.45; continue; }
      const prep   = prepareWithSegments(part, font);
      let   cursor = { segmentIndex: 0, graphemeIndex: 0 };

      for (let iter = 0; iter < 3000; iter++) {
        const segs = getTextSegments(y, multiCol);
        if (!segs.length) { y += lh; continue; }
        let done = false;
        for (const seg of segs) {
          const line = layoutNextLine(prep, cursor, seg.w);
          if (!line) { done = true; break; }
          cursor = line.end;
        }
        if (done) { y += lh; break; }
        y += lh;
      }
    }
    y += (b.mb || 0) * fs;
  }
  return y;
}

// ── Render ────────────────────────────────────────────────────────
function renderBlocks(baseFontSize, lhMult) {
  const layer = document.getElementById('cv-text-layer');
  const frag  = document.createDocumentFragment();
  let   y     = 0;
  const mk    = tag => document.createElement(tag);

  for (const b of BLOCKS) {
    if (b.type === 'spacer') { y += b.em * baseFontSize; continue; }

    if (b.type === 'hr') {
      const h  = b.thick ? 2 : 1;
      const bg = b.thick ? 'rgba(138,115,82,0.55)' : 'rgba(196,169,122,0.38)';
      const hr = mk('div');
      hr.style.cssText = `position:absolute;left:${PAD_X}px;top:${PAD_Y+y}px;width:${CONT_W}px;height:${h}px;background:${bg}`;
      frag.appendChild(hr);
      y += h; continue;
    }

    const fs       = baseFontSize * b.scale;
    const lh       = fs * lhMult;
    const font     = fontStr(fs, b);
    const color    = b.color || 'rgba(26,20,8,0.88)';
    const lsCSS    = b.letterSpacing ? `letter-spacing:${b.letterSpacing};text-transform:uppercase;` : '';
    const itCSS    = b.italic ? 'font-style:italic;' : '';
    const multiCol = !b.bold && !b.display && !b.italic;
    y += (b.mt || 0) * fs;

    if (b.date) {
      const dfs  = baseFontSize * 0.85;
      const dfnt = fontStr(dfs, { italic: true });
      const ds   = mk('span');
      // Fixed to the full right margin — titles are left-column only so
      // they never reach this far right, no overlap possible
      ds.style.cssText = `position:absolute;font:${dfnt};font-style:italic;color:rgba(26,20,8,0.38);right:${PAD_X}px;top:${PAD_Y+y}px;white-space:nowrap;`;
      ds.textContent = b.date;
      frag.appendChild(ds);
    }

    for (const part of b.text.split('\n')) {
      if (part === '') { y += lh * 0.45; continue; }
      const prep   = prepareWithSegments(part, font);
      let   cursor = { segmentIndex: 0, graphemeIndex: 0 };

      for (let iter = 0; iter < 3000; iter++) {
        const segs = getTextSegments(y, multiCol);
        if (!segs.length) { y += lh; continue; }
        let done = false;
        for (const seg of segs) {
          const line = layoutNextLine(prep, cursor, seg.w);
          if (!line) { done = true; break; }
          cursor = line.end;
          const sp = mk('span');
          sp.style.cssText = `position:absolute;font:${font};color:${color};${lsCSS}${itCSS}left:${PAD_X+seg.x}px;top:${PAD_Y+y}px;white-space:nowrap;`;
          sp.textContent = line.text;
          frag.appendChild(sp);
        }
        if (done) { y += lh; break; }
        y += lh;
      }
    }
    y += (b.mb || 0) * fs;
  }

  layer.replaceChildren(frag);
}

// ── Binary search ─────────────────────────────────────────────────
function bs(lo, hi, step, ok) {
  while (hi - lo > step) { const m = (lo+hi)/2; if (ok(m)) lo=m; else hi=m; }
  return lo;
}

let currentFontSize = 9;
let currentLhMult   = 1.5;
let rafPending      = false;
let fitTimer        = null;

function scheduleRender() {
  if (attackMode) return;
  if (rafPending)  return;
  rafPending = true;
  requestAnimationFrame(() => {
    rafPending = false;
    cardH = document.getElementById('photo-card').offsetHeight;
    renderBlocks(currentFontSize, currentLhMult);
  });
}

function runFit() {
  if (attackMode) return;
  cardH = document.getElementById('photo-card').offsetHeight;
  const a4el = document.getElementById('cv-a4');

  const sdot   = document.getElementById('status-dot');
  const stxt   = document.getElementById('status-text');
  const fstats = document.getElementById('footer-stats');

  if (sdot) sdot.classList.remove('done');
  if (stxt) stxt.textContent = 'computing…';

  // Phase 1: largest fontSize in [MIN_FS, 16] that fits A4.
  // MIN_FS = 9 ensures text is always readable — never sacrifice legibility.
  const MIN_FS = 16;
  const fontSize = bs(MIN_FS, 24, 0.05, fs => measure(fs, 1.2) <= CONT_H);

  // Phase 2: largest lhMult within available space.
  // If content at MIN_FS+lh1.2 still overflows A4, expand the page height
  // rather than shrinking the font further.
  const neededH = measure(fontSize, 1.2);
  const phaseH  = neededH > CONT_H ? neededH : CONT_H;
  const lhMult  = bs(1.2, neededH > CONT_H ? 1.5 : 1.85, 0.01, lh => measure(fontSize, lh) <= phaseH);

  currentFontSize = fontSize;
  currentLhMult   = lhMult;
  renderBlocks(fontSize, lhMult);

  // Expand cv-a4 if content overflows standard A4 height
  const actualH = measure(fontSize, lhMult);
  if (actualH > CONT_H) {
    a4el.style.minHeight = (PAD_Y * 2 + Math.ceil(actualH) + 24) + 'px';
  } else {
    a4el.style.minHeight = '';
  }

  document.documentElement.style.setProperty('--cv-fs', fontSize.toFixed(2) + 'px');
  document.documentElement.style.setProperty('--cv-lh', lhMult.toFixed(3));

  const fill = Math.round(actualH / CONT_H * 100);
  if (sdot)   sdot.classList.add('done');
  if (stxt)   stxt.textContent = `${fontSize.toFixed(1)}pt · lh ${lhMult.toFixed(2)} · fill ${fill}%`;
  if (fstats) fstats.textContent = `@chenglou/pretext · canvas measurement + rendering · ${fontSize.toFixed(1)}pt · lh ${lhMult.toFixed(2)} · fill ${fill}%`;
}

// ── Attack system ─────────────────────────────────────────────────
function spawnOne() {
  const glyph = ATCK_GLYPHS[Math.floor(Math.random() * ATCK_GLYPHS.length)];
  const color = ATCK_COLORS[Math.floor(Math.random() * ATCK_COLORS.length)];
  const speed = 0.055 + Math.random() * 0.065;
  const angle = Math.random() * 2 * Math.PI;

  const a = {
    x:  Math.random() * (CONT_W - ATCK_W),
    y:  Math.random() * (CONT_H - ATCK_H),
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    w: ATCK_W, h: ATCK_H,
    glyph, color, bounces: 0, el: null,
  };

  const el = document.createElement('div');
  el.className   = 'cv-attacker';
  el.textContent = glyph;
  el.style.cssText = `left:${PAD_X+a.x}px;top:${PAD_Y+a.y}px;background:${color.bg};border-color:${color.border};color:${color.text};`;
  document.getElementById('cv-a4').appendChild(el);
  a.el = el;
  attackers.push(a);
}

function startSpin() {
  spinIdx = 0;
  if (spinInterval) clearInterval(spinInterval);
  spinInterval = setInterval(() => {
    spinIdx = (spinIdx + 1) % SPIN_CHARS.length;
    for (const el of document.querySelectorAll('.attack-spin')) {
      el.textContent = SPIN_CHARS[spinIdx];
    }
  }, 200);
}

function stopSpin() {
  if (spinInterval) { clearInterval(spinInterval); spinInterval = null; }
  for (const el of document.querySelectorAll('.attack-spin')) {
    el.textContent = SPIN_CHARS[0]; // reset to ↑
  }
}

function startAttack() {
  attackMode = true;
  for (let i = 0; i < 7; i++) setTimeout(spawnOne, i * 110);
  lastAttackT = performance.now();
  attackFrame = requestAnimationFrame(attackLoop);
  startSpin();
}

function stopAttack() {
  attackMode = false;
  if (attackFrame) { cancelAnimationFrame(attackFrame); attackFrame = null; }
  for (const a of attackers) a.el?.remove();
  attackers.length = 0;
  stopSpin();
  renderBlocks(currentFontSize, currentLhMult);
}

function attackLoop(t) {
  if (!attackMode) { attackFrame = null; return; }

  const dt = Math.min(t - lastAttackT, 40);
  lastAttackT = t;

  for (const a of attackers) {
    a.x += a.vx * dt;
    a.y += a.vy * dt;

    let hit = false;
    if (a.x < 0)            { a.x = 0;            a.vx =  Math.abs(a.vx); hit = true; }
    if (a.x + a.w > CONT_W) { a.x = CONT_W - a.w; a.vx = -Math.abs(a.vx); hit = true; }
    if (a.y < 0)            { a.y = 0;            a.vy =  Math.abs(a.vy); hit = true; }
    if (a.y + a.h > CONT_H) { a.y = CONT_H - a.h; a.vy = -Math.abs(a.vy); hit = true; }

    if (hit) {
      a.bounces++;
      if (a.bounces % 2 === 0) {
        a.glyph = ATCK_GLYPHS[Math.floor(Math.random() * ATCK_GLYPHS.length)];
        a.el.textContent = a.glyph;
      }
      a.color = ATCK_COLORS[Math.floor(Math.random() * ATCK_COLORS.length)];
      a.el.style.background  = a.color.bg;
      a.el.style.borderColor = a.color.border;
      a.el.style.color       = a.color.text;
    }

    a.el.style.left = (PAD_X + a.x) + 'px';
    a.el.style.top  = (PAD_Y + a.y) + 'px';
  }

  // Re-render text every 2nd frame so it flows around moving attackers
  if (++attackRenderN % 2 === 0) renderBlocks(currentFontSize, currentLhMult);

  attackFrame = requestAnimationFrame(attackLoop);
}

window.toggleAttack = function () {
  const zone    = document.getElementById('attack-zone-btn');
  const topBtn  = document.getElementById('atk-top-btn');
  const navBtn  = document.getElementById('attack-btn');
  const title   = document.getElementById('atk-title');
  const sub     = document.getElementById('atk-sub');
  const navLbl  = document.getElementById('attack-btn-label');
  const topLbl  = document.getElementById('atk-top-label');
  if (attackMode) {
    stopAttack();
    zone?.classList.remove('is-active');
    topBtn?.classList.remove('is-active');
    navBtn?.classList.remove('is-active');
    if (title)  title.textContent  = 'ATTACK MY CV';
    if (sub)    sub.textContent    = 'WARNING: initiates DVD mode · pretext flows around all obstacles in real-time';
    if (navLbl) navLbl.textContent = 'attack my CV';
    if (topLbl) topLbl.textContent = 'ATTACK MY CV';
  } else {
    startAttack();
    zone?.classList.add('is-active');
    topBtn?.classList.add('is-active');
    navBtn?.classList.add('is-active');
    if (title)  title.textContent  = 'STOP ATTACK.EXE';
    if (sub)    sub.textContent    = 'ABORT: click to stop all attackers and restore layout';
    if (navLbl) navLbl.textContent = 'stop attack';
    if (topLbl) topLbl.textContent = 'STOP ATTACK.EXE';
  }
};

// ── Drag ──────────────────────────────────────────────────────────
(function () {
  const cardEl = document.getElementById('photo-card');
  const handle = document.getElementById('pc-handle');
  const macWin = document.getElementById('cv-mac-win');

  positionCard(cardEl);
  cardH = cardEl.offsetHeight;

  let dragging = false, startX = 0, startY = 0, origX = 0, origY = 0;

  function getScale() {
    const m = (macWin.style.transform || '').match(/scale\(([^)]+)\)/);
    return m ? parseFloat(m[1]) : 1;
  }

  handle.addEventListener('pointerdown', e => {
    e.preventDefault();
    origX = cardX; origY = cardTop;
    startX = e.clientX; startY = e.clientY;
    dragging = true;
    cardEl.setPointerCapture(e.pointerId);
    cardEl.classList.add('is-dragging');
    document.body.style.userSelect = 'none';
    clearTimeout(fitTimer);
  });

  cardEl.addEventListener('pointermove', e => {
    if (!dragging) return;
    const s = getScale();
    cardX   = Math.max(0, Math.min(CONT_W - CARD_W, origX + (e.clientX - startX) / s));
    cardTop = Math.max(0, origY + (e.clientY - startY) / s);
    positionCard(cardEl);
    scheduleRender();
  });

  const stopDrag = () => {
    if (!dragging) return;
    dragging = false;
    cardEl.classList.remove('is-dragging');
    document.body.style.userSelect = '';
    clearTimeout(fitTimer);
    fitTimer = setTimeout(runFit, 350);
  };

  cardEl.addEventListener('pointerup',          stopDrag);
  cardEl.addEventListener('lostpointercapture', stopDrag);
})();

// ── Scale A4 to viewport ──────────────────────────────────────────
(function () {
  const wrap = document.getElementById('cv-win-wrap');
  const win  = document.getElementById('cv-mac-win');
  const scale = () => {
    const avail = innerWidth - 8;
    if (avail < A4_W) {
      const s = avail / A4_W;
      win.style.transform       = `scale(${s})`;
      win.style.transformOrigin = 'top center';
      wrap.style.minHeight      = (win.offsetHeight * s + 60) + 'px';
    } else {
      win.style.transform  = '';
      wrap.style.minHeight = '';
    }
  };
  addEventListener('resize', scale);
  setTimeout(scale, 50);
})();

// ── Grain ─────────────────────────────────────────────────────────
(function () {
  const c = document.getElementById('grain');
  if (!c) return;
  const x = c.getContext('2d');
  let w, h;
  const resize = () => { w = c.width = innerWidth; h = c.height = innerHeight; };
  const draw   = () => {
    const img = x.createImageData(w, h), p = img.data;
    for (let i = 0; i < p.length; i += 4) { const v = Math.random()*255|0; p[i]=p[i+1]=p[i+2]=v; p[i+3]=255; }
    x.putImageData(img, 0, 0);
    requestAnimationFrame(draw);
  };
  addEventListener('resize', resize);
  resize(); draw();
})();

window.printCV = function () {
  const t = document.title;
  document.title = 'Gustaf Garnow — CV';
  window.print();
  document.title = t;
};

document.fonts.ready.then(() => { setTimeout(runFit, 100); });
