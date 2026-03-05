export const spinnerSets = {
  braille: ['\u280B','\u2819','\u2839','\u2838','\u283C','\u2834','\u2826','\u2827','\u2807','\u280F'],
  arrows:  ['\u2191','\u2197','\u2192','\u2198','\u2193','\u2199','\u2190','\u2196'],
  blocks:  ['\u2596','\u2598','\u259D','\u2597','\u259A','\u259E','\u2588','\u2593','\u2592','\u2591'],
  classic: ['|','/','-','\\','|','/','-','\\'],
};

export const activeSpinners = new WeakMap();

// Always-spinning open button system
class AlwaysSpinner {
  constructor(glyph, chars) {
    this.glyph = glyph;
    this.chars = chars;
    this.frame = Math.floor(Math.random() * chars.length);
    this.speed = 250; // slow idle
    this.timer = null;
    this.hovering = false;
  }

  start() {
    this.tick();
  }

  tick() {
    this.glyph.textContent = this.chars[this.frame % this.chars.length];
    this.frame++;
    this.timer = setTimeout(() => this.tick(), this.speed);
  }

  setHover(on) {
    this.hovering = on;
    this.speed = on ? 50 : 250;
  }

  destroy() {
    if (this.timer) clearTimeout(this.timer);
  }
}

// For case study list glyphs — hover spin + idle nudge
export function spinOnHover(el, glyph, chars, resting) {
  el.addEventListener('mouseenter', () => {
    if (activeSpinners.has(el)) clearInterval(activeSpinners.get(el));
    let frame = 0;
    const total = 10 + Math.floor(Math.random() * 6);
    const iv = setInterval(() => {
      if (frame < total) {
        glyph.textContent = chars[frame % chars.length];
        frame++;
      } else {
        glyph.textContent = resting;
        clearInterval(iv);
        activeSpinners.delete(el);
      }
    }, 60);
    activeSpinners.set(el, iv);
  });

  el.addEventListener('mouseleave', () => {
    if (activeSpinners.has(el)) {
      clearInterval(activeSpinners.get(el));
      activeSpinners.delete(el);
    }
    glyph.textContent = resting;
  });
}

const spinners = [];

export function initSpinners() {
  document.querySelectorAll('.open-btn[data-spinner]').forEach(btn => {
    const glyph = btn.querySelector('.open-glyph');
    if (!glyph) return;
    const setName = btn.dataset.spinner || 'braille';
    const chars = spinnerSets[setName] || spinnerSets.braille;

    const spinner = new AlwaysSpinner(glyph, chars);
    // Random start delay so they don't sync
    setTimeout(() => spinner.start(), Math.random() * 1000);
    spinners.push(spinner);

    btn.addEventListener('mouseenter', () => spinner.setHover(true));
    btn.addEventListener('mouseleave', () => spinner.setHover(false));
  });
}
