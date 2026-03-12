/**
 * Loading styleguide — alla spinner-set + init för .open-btn och .inline-glyph.
 * Självständig så ni kan kopiera till andra projekt.
 */

const spinnerSets = {
  braille: ['\u280B','\u2819','\u2839','\u2838','\u283C','\u2834','\u2826','\u2827','\u2807','\u280F'],
  arrows:  ['\u2191','\u2197','\u2192','\u2198','\u2193','\u2199','\u2190','\u2196'],
  blocks:  ['\u2596','\u2598','\u259D','\u2597','\u259A','\u259E','\u2588','\u2593','\u2592','\u2591'],
  classic: ['|','/','-','\\','|','/','-','\\'],
  dots:    ['\u28FE','\u28FD','\u28FB','\u28BF','\u287F','\u28DF','\u28AF','\u28B7'],
  moon:    ['\u25D0','\u25D3','\u25D1','\u25D2'],
  line:    ['\u2581','\u2582','\u2583','\u2584','\u2585','\u2586','\u2587','\u2588','\u2587','\u2586','\u2585','\u2584','\u2583','\u2582'],
  hex:     ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F'],
  quarter: ['\u25DC','\u25E0','\u25DD','\u25DF','\u25DE','\u25DE','\u25DD','\u25E0'],
  triangle: ['\u25E2','\u25E3','\u25E4','\u25E5'],
  square:  ['\u25F1','\u25F2','\u25F3','\u25F0'],
  binary:  ['0','1'],
  dice:    ['\u2680','\u2681','\u2682','\u2683','\u2684','\u2685'],
  circle:  ['\u25F4','\u25F7','\u25F6','\u25F5'],
  grow:    ['\u258F','\u258E','\u258D','\u258C','\u258B','\u258A','\u2589','\u2588'],
};

function escapeForJs(c) {
  if (c === '\\') return "'\\\\'";
  if (c === "'") return "'\\''";
  if (c.length === 1 && c.charCodeAt(0) > 127)
    return "'\\u" + c.charCodeAt(0).toString(16).padStart(4, '0') + "'";
  return "'" + c + "'";
}

/** Copyable usage snippet — one per variant. */
export function getUsageSnippet(name) {
  const chars = spinnerSets[name] || spinnerSets.moon;
  const arr = '[' + chars.map(escapeForJs).join(',') + ']';
  return `// ${name} — paste into your project
const chars = ${arr};
let i = 0;
const id = setInterval(() => {
  element.textContent = chars[i % chars.length];
  i++;
}, 100);
// stop when done: clearInterval(id);`;
}

/** Copyable data line for one set (for spinnerSets object). */
export function getDataSnippet(name) {
  const chars = spinnerSets[name];
  if (!chars) return '';
  return `  ${name}: [${chars.map(escapeForJs).join(',')}],`;
}

class AlwaysSpinner {
  constructor(glyph, chars, options = {}) {
    this.glyph = glyph;
    this.chars = chars;
    this.frame = Math.floor(Math.random() * chars.length);
    this.speed = options.speed ?? 250;
    this.timer = null;
    this.hovering = false;
    this.onHoverSpeed = options.onHoverSpeed ?? 50;
  }

  start() {
    this.tick();
  }

  tick() {
    this.glyph.textContent = this.chars[this.frame % this.chars.length];
    this.frame++;
    const speed = this.hovering ? this.onHoverSpeed : this.speed;
    this.timer = setTimeout(() => this.tick(), speed);
  }

  setHover(on) {
    this.hovering = on;
  }

  destroy() {
    if (this.timer) clearTimeout(this.timer);
  }
}

function initOpenBtnSpinners() {
  document.querySelectorAll('.open-btn[data-spinner]').forEach(btn => {
    const glyph = btn.querySelector('.open-glyph');
    if (!glyph) return;
    const setName = btn.dataset.spinner || 'braille';
    const chars = spinnerSets[setName] || spinnerSets.braille;
    const spinner = new AlwaysSpinner(glyph, chars);
    setTimeout(() => spinner.start(), Math.random() * 800);
    btn.addEventListener('mouseenter', () => spinner.setHover(true));
    btn.addEventListener('mouseleave', () => spinner.setHover(false));
  });
}

function initInlineGlyphs() {
  document.querySelectorAll('.inline-glyph[data-spinner]').forEach(el => {
    const setName = el.dataset.spinner || 'braille';
    const chars = spinnerSets[setName] || spinnerSets.braille;
    const spinner = new AlwaysSpinner(el, chars, { speed: 80, onHoverSpeed: 80 });
    setTimeout(() => spinner.start(), Math.random() * 200);
  });
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

function flashCopyLabel(btn) {
  const label = btn.querySelector('.copy-label') || btn;
  const was = label.textContent;
  label.textContent = 'Kopierat!';
  setTimeout(() => { label.textContent = was; }, 1200);
}

function initCopyButtons() {
  document.querySelectorAll('[data-copy-data]').forEach(btn => {
    const name = btn.dataset.copyData;
    btn.addEventListener('click', async () => {
      if (await copyToClipboard(getDataSnippet(name))) flashCopyLabel(btn);
    });
  });
  document.querySelectorAll('[data-copy-usage]').forEach(btn => {
    const name = btn.dataset.copyUsage;
    btn.addEventListener('click', async () => {
      if (await copyToClipboard(getUsageSnippet(name))) flashCopyLabel(btn);
    });
  });
  const fullPre = document.getElementById('sg-full-set');
  const fullBtn = document.getElementById('sg-copy-full');
  if (fullPre && fullBtn) {
    const lines = ['const spinnerSets = {'];
    for (const name of Object.keys(spinnerSets)) {
      lines.push(getDataSnippet(name));
    }
    lines.push('};');
    fullPre.querySelector('code').textContent = lines.join('\n');
    fullBtn.addEventListener('click', async () => {
      if (await copyToClipboard(lines.join('\n'))) flashCopyLabel(fullBtn);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initOpenBtnSpinners();
  initInlineGlyphs();
  initCopyButtons();
});
