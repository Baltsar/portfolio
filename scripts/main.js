import { initGrain } from './grain.js';
import { initDrag } from './drag.js';
import { initLayoutToggle } from './layout-toggle.js';
import { initCaseStudy } from './case-study.js';
import { initExport } from './export.js';
import { initSpinners } from './spinners.js';
import { initTerminal } from './terminal.js';
import { initLightbox } from './lightbox.js';

document.addEventListener('DOMContentLoaded', () => {
  initGrain();
  initDrag();
  initLayoutToggle();
  initLightbox();
  initCaseStudy();
  initExport();
  initSpinners();
  initTerminal();
});
