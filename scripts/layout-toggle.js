export function initLayoutToggle() {
  const area = document.getElementById('windows-area');
  const btnChaos = document.getElementById('btn-chaos');
  const btnGrid = document.getElementById('btn-grid');

  if (!area || !btnChaos || !btnGrid) return;

  function setLayout(mode) {
    if (mode === 'grid') {
      area.classList.add('grid-mode');
      btnGrid.classList.add('active-view');
      btnChaos.classList.remove('active-view');
    } else {
      area.classList.remove('grid-mode');
      btnChaos.classList.add('active-view');
      btnGrid.classList.remove('active-view');
    }
  }

  btnChaos.addEventListener('click', () => setLayout('chaos'));
  btnGrid.addEventListener('click', () => setLayout('grid'));

  setLayout('grid');
}
