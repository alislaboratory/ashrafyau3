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
  ctrl.resize();
  return {
    stop() {
      alive = false;
      pause();
      io.disconnect();
      window.removeEventListener('resize', onR);
    },
  };
}
