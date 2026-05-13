const STORAGE_KEY = 'moved-modal-dismissed';
const DESTINATION = 'https://headless.design/portfolio';

export function initMovedModal() {
  const backdrop = document.getElementById('moved-backdrop');
  if (!backdrop) return;

  if (sessionStorage.getItem(STORAGE_KEY) === '1') return;

  const closeBtn = document.getElementById('moved-close');
  const stayBtn = document.getElementById('moved-stay');
  const primaryBtn = backdrop.querySelector('.moved-cta-primary');

  const open = () => {
    backdrop.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => primaryBtn?.focus({ preventScroll: true }));
  };

  const close = () => {
    backdrop.classList.remove('is-open');
    document.body.style.overflow = '';
    sessionStorage.setItem(STORAGE_KEY, '1');
  };

  closeBtn?.addEventListener('click', close);
  stayBtn?.addEventListener('click', close);

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) close();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && backdrop.classList.contains('is-open')) close();
  });

  primaryBtn?.addEventListener('click', () => {
    sessionStorage.setItem(STORAGE_KEY, '1');
  });

  setTimeout(open, 420);
}
