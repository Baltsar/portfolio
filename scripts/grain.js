export function initGrain() {
  const c = document.getElementById('grain');
  if (!c) return;
  const ctx = c.getContext('2d');

  function resize() {
    c.width = innerWidth;
    c.height = innerHeight;
  }
  resize();
  addEventListener('resize', resize);

  let last = 0;
  function grain(t) {
    if (t - last > 80) {
      const d = ctx.createImageData(c.width, c.height);
      const b = d.data;
      for (let i = 0; i < b.length; i += 4) {
        const v = Math.random() * 255;
        b[i] = b[i + 1] = b[i + 2] = v;
        b[i + 3] = 255;
      }
      ctx.putImageData(d, 0, 0);
      last = t;
    }
    requestAnimationFrame(grain);
  }
  requestAnimationFrame(grain);
}
