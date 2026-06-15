export function gateAnim(canvas, ctrl) {
  let raf = 0, playing = false, alive = true;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function loop(now) {
    if (!playing || !alive) return;
    ctrl.frame(now || performance.now());
    if (!reduced) raf = requestAnimationFrame(loop);
  }
  function play() {
    if (playing || !alive) return;
    playing = true;
    if (reduced) { ctrl.frame(performance.now()); playing = false; }
    else raf = requestAnimationFrame(loop);
  }
  function pause() {
    playing = false;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  }
  const io = new IntersectionObserver(
    es => { es.forEach(e => e.isIntersecting ? play() : pause()); },
    { threshold: 0.04 }
  );
  io.observe(canvas);
  const onR = () => { ctrl.resize(); if (reduced) ctrl.frame(performance.now()); };
  window.addEventListener('resize', onR);

  const rel = (e) => {
    const r = canvas.getBoundingClientRect();
    return [(e.clientX - r.left) / Math.max(1, r.width), (e.clientY - r.top) / Math.max(1, r.height)];
  };
  const onMove = (e) => { if (ctrl.pointer) { const [x, y] = rel(e); ctrl.pointer(x, y, true); } };
  const onLeave = () => { if (ctrl.pointer) ctrl.pointer(0.5, 0.5, false); };
  const onDown = (e) => {
    if (ctrl.pointer) { const [x, y] = rel(e); ctrl.pointer(x, y, true); }
    if (ctrl.pointerDown) { const [x, y] = rel(e); ctrl.pointerDown(x, y); }
    if (reduced && ctrl.frame) ctrl.frame(performance.now());
  };
  const hasPointer = !!(ctrl.pointer || ctrl.pointerDown);
  if (hasPointer) {
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerleave', onLeave);
    canvas.addEventListener('pointerdown', onDown);
    canvas.style.touchAction = 'none';
  }

  ctrl.resize();
  return {
    stop() {
      alive = false;
      pause();
      io.disconnect();
      window.removeEventListener('resize', onR);
      if (hasPointer) {
        canvas.removeEventListener('pointermove', onMove);
        canvas.removeEventListener('pointerleave', onLeave);
        canvas.removeEventListener('pointerdown', onDown);
      }
    },
  };
}
