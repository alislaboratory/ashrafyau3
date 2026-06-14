import { useEffect, useRef } from 'react';
import { setupCanvas } from '../lib/utils';

const PET = [
  { ang: -90, len: 1.00, w: 0.30 },
  { ang: -50, len: 0.86, w: 0.25 },
  { ang: -130, len: 0.86, w: 0.25 },
  { ang: -16, len: 0.66, w: 0.21 },
  { ang: -164, len: 0.66, w: 0.21 },
];

export default function Logo() {
  const canvasRef = useRef(null);
  const brandRef = useRef(null);
  const stateRef = useRef({ ctx: null, W: 0, H: 0, raf: 0, hover: false, t0: performance.now(), hStart: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const brand = brandRef.current;
    if (!canvas || !brand) return;

    const s = stateRef.current;

    function petal(px, py, cx, by, R, bloom) {
      let best = 0, idx = -1, a01 = 0;
      for (let pi = 0; pi < PET.length; pi++) {
        const p = PET[pi];
        const a = p.ang * Math.PI / 180;
        const dx = px - cx, dy = py - by;
        const al = dx * Math.cos(a) + dy * Math.sin(a);
        const pe = -dx * Math.sin(a) + dy * Math.cos(a);
        const L = p.len * R * bloom, Wd = p.w * R;
        if (al >= 0 && al <= L) {
          const hw = Wd * (1 - (al / L) * 0.8);
          if (Math.abs(pe) <= hw) {
            const cov = 1 - Math.abs(pe) / (hw + 0.001);
            if (cov > best) { best = cov; idx = pi; a01 = al / (p.len * R); }
          }
        }
      }
      return { v: best, idx, a: a01 };
    }

    function seedMask(px, py, cx, cy, R) {
      const ny = (py - cy) / R;
      if (ny < -0.78 || ny > 0.82) return 0;
      const tt = (ny + 0.78) / 1.6;
      const taper = Math.sin(Math.PI * tt);
      const hw = R * 0.30 * taper * (0.55 + 0.45 * tt);
      return Math.abs(px - cx) <= hw ? 1 - Math.abs(px - cx) / (hw + 0.001) : 0;
    }

    function size() {
      const r = setupCanvas(canvas);
      s.ctx = r.ctx; s.W = r.W; s.H = r.H;
    }

    function draw(now) {
      const t = (now - s.t0) / 1000;
      s.ctx.clearRect(0, 0, s.W, s.H);
      const R = Math.min(s.W, s.H) * 0.50;
      const cx = s.W / 2, cy = s.H * 0.50, base = cy + R * 0.16;
      let bloom = 0;
      if (s.hover) {
        const e = Math.min(1, (now - s.hStart) / 620);
        bloom = 1 - Math.pow(1 - e, 3);
      }
      const pulse = s.hover ? (1 + 0.05 * Math.sin(t * 5)) : 1;
      const step = Math.max(1, Math.round(Math.min(s.W, s.H) / 20));
      if (bloom > 0.02) {
        for (let y = step / 2; y < s.H; y += step) {
          for (let x = step / 2; x < s.W; x += step) {
            const m = petal(x, y, cx, base, R * pulse, bloom);
            if (m.v < 0.16) continue;
            const rr = m.a;
            let col;
            if (rr < 0.30) col = [255, 216, 120];
            else if (rr < 0.62) col = [255, 140, 196];
            else col = [205, 100, 224];
            const sh = 0.82 + 0.18 * Math.sin(t * 4 + m.idx);
            s.ctx.globalAlpha = Math.min(1, bloom * 1.3 * sh);
            s.ctx.fillStyle = `rgb(${col[0]},${col[1]},${col[2]})`;
            s.ctx.fillRect(Math.round(x - step / 2), Math.round(y - step / 2), Math.ceil(step), Math.ceil(step));
          }
        }
      }
      const seedA = Math.max(0, 1 - bloom * 1.7);
      if (seedA > 0.02) {
        for (let y = step / 2; y < s.H; y += step) {
          for (let x = step / 2; x < s.W; x += step) {
            const m = seedMask(x, y, cx, cy, R);
            if (m < 0.16) continue;
            const g = 18 + Math.round((1 - m) * 22);
            s.ctx.globalAlpha = seedA;
            s.ctx.fillStyle = `rgb(${g},${g},${g + 4})`;
            s.ctx.fillRect(Math.round(x - step / 2), Math.round(y - step / 2), Math.ceil(step), Math.ceil(step));
          }
        }
      }
      if (bloom > 0.55) {
        s.ctx.globalAlpha = (bloom - 0.55) / 0.45;
        s.ctx.fillStyle = '#ffd86e';
        s.ctx.beginPath();
        s.ctx.arc(cx, base, R * 0.16, 0, Math.PI * 2);
        s.ctx.fill();
      }
      s.ctx.globalAlpha = 1;
    }

    function loop(now) {
      draw(now);
      if (s.hover) s.raf = requestAnimationFrame(loop);
    }

    function onEnter() {
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
        s.hover = true; draw(performance.now()); s.hover = false;
        return;
      }
      s.hover = true;
      s.hStart = performance.now();
      if (!s.raf) s.raf = requestAnimationFrame(loop);
    }

    function onLeave() {
      s.hover = false;
      if (s.raf) { cancelAnimationFrame(s.raf); s.raf = 0; }
      draw(performance.now());
    }

    function onResize() { size(); draw(performance.now()); }

    size();
    draw(performance.now());
    brand.addEventListener('mouseenter', onEnter);
    brand.addEventListener('mouseleave', onLeave);
    window.addEventListener('resize', onResize);
    return () => {
      brand.removeEventListener('mouseenter', onEnter);
      brand.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('resize', onResize);
      if (s.raf) cancelAnimationFrame(s.raf);
    };
  }, []);

  return (
    <a className="brand" href="#/" aria-label="Ali — home" ref={brandRef}>
      <canvas id="logo" ref={canvasRef} aria-hidden="true" />
    </a>
  );
}
