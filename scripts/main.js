import { initGrain } from './grain.js';
import { initDrag } from './drag.js';
import { initLayoutToggle } from './layout-toggle.js';
import { initCaseStudy } from './case-study.js';
import { initExport } from './export.js';
import { initSpinners } from './spinners.js';

document.addEventListener('DOMContentLoaded', () => {
  initGrain();
  initDrag();
  initLayoutToggle();
  initCaseStudy();
  initExport();
  initSpinners();
});
