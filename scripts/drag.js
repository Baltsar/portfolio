export function initDrag() {
  const windows = document.querySelectorAll('.mac-window');
  const area = document.getElementById('windows-area');

  windows.forEach(win => {
    const titlebar = win.querySelector('.mac-titlebar');
    const handle = win.querySelector('.drag-handle');
    const barDrag = win.querySelector('.bar-drag');
    let isDragging = false;
    let startX, startY, origLeft, origTop;
    let rafId = null;
    let moveX = 0, moveY = 0;

    function onPointerDown(e) {
      if (area && area.classList.contains('grid-mode')) return;

      isDragging = true;
      win.classList.add('is-dragging');

      // Bring to front
      windows.forEach(w => w.classList.remove('z-front'));
      win.classList.add('z-front');

      const rect = win.getBoundingClientRect();
      const areaRect = area ? area.getBoundingClientRect() : { left: 0, top: 0 };

      startX = e.clientX;
      startY = e.clientY;
      origLeft = rect.left - areaRect.left;
      origTop = rect.top - areaRect.top;

      win.style.right = 'auto';
      win.style.left = origLeft + 'px';
      win.style.top = origTop + 'px';
      win.style.transform = 'none';

      e.preventDefault();
      win.setPointerCapture(e.pointerId);
    }

    function onPointerMove(e) {
      if (!isDragging) return;
      moveX = e.clientX - startX;
      moveY = e.clientY - startY;

      if (!rafId) {
        rafId = requestAnimationFrame(() => {
          win.style.transform = `translate(${moveX}px, ${moveY}px)`;
          rafId = null;
        });
      }
    }

    function onPointerUp() {
      if (!isDragging) return;
      isDragging = false;
      win.classList.remove('is-dragging');

      win.style.left = (origLeft + moveX) + 'px';
      win.style.top = (origTop + moveY) + 'px';
      win.style.transform = '';
      moveX = 0;
      moveY = 0;

      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    }

    // Drag from titlebar, old drag-handle, or new bar-drag
    [titlebar, handle, barDrag].forEach(el => {
      if (el) el.addEventListener('pointerdown', onPointerDown);
    });

    win.addEventListener('pointermove', onPointerMove);
    win.addEventListener('pointerup', onPointerUp);
    win.addEventListener('lostpointercapture', onPointerUp);

    win.addEventListener('click', () => {
      windows.forEach(w => w.classList.remove('z-front'));
      win.classList.add('z-front');
    });
  });
}
