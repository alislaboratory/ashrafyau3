import { useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { createAquarium, drawMountains } from '../lib/art';
import { spectrum } from '../lib/utils';
import { gateAnim } from '../lib/gateAnim';

export default function Footer() {
  const canvasRef = useRef(null);
  const modeRef = useRef('other');
  const stateRef = useRef({
    ctx: null, W: 0, H: 0, base: null, raf: 0, egg: null, aq: null, aqGate: null,
  });
  const location = useLocation();
  const isHome = location.pathname === '/';

  const clearAll = useCallback(() => {
    const s = stateRef.current;
    if (s.aqGate) { s.aqGate.stop(); s.aqGate = null; }
    s.aq = null;
    if (s.raf) { cancelAnimationFrame(s.raf); s.raf = 0; }
    s.egg = null;
  }, []);

  const paintMountain = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const s = stateRef.current;
    drawMountains(canvas);
    s.ctx = canvas.getContext('2d');
    const r = canvas.getBoundingClientRect();
    s.W = r.width;
    s.H = r.height;
    s.base = s.ctx.getImageData(0, 0, canvas.width, canvas.height);
  }, []);

  const tick = useCallback((now) => {
    const s = stateRef.current;
    if (!s.egg || modeRef.current !== 'other') return;
    const e = now - s.egg.t0;
    const ASC = 1500, BUR = 1300;
    s.ctx.putImageData(s.base, 0, 0);
    const lx = s.W * 0.52, ly = s.H * 0.60, ax = s.W * 0.47, ay = s.H * 0.13;
    if (e < ASC) {
      const p = e / ASC, ep = 1 - (1 - p) * (1 - p);
      const x = lx + (ax - lx) * ep + Math.sin(p * 7) * 7;
      const y = ly + (ay - ly) * ep;
      for (let k = 0; k < 9; k++) {
        const ty = y + 8 + k * 5 * (1 + p);
        const a = (1 - k / 9) * 0.9 * (0.6 + 0.4 * Math.sin(now * 0.03 + k));
        s.ctx.fillStyle = `rgba(255,${190 - k * 16},60,${a})`;
        s.ctx.fillRect(x - 1.5 + Math.sin(k + now * 0.02) * 2, ty, 3, 4);
      }
      s.ctx.fillStyle = '#fff';
      s.ctx.fillRect(x - 2, y - 7, 4, 9);
      s.ctx.fillStyle = '#bcd2ff';
      s.ctx.fillRect(x - 2, y - 7, 4, 3);
    } else if (e < ASC + BUR) {
      if (!s.egg.lit) {
        s.egg.lit = true;
        for (let i = 0; i < 30; i++) {
          const a = Math.random() * Math.PI * 2;
          const sp = 50 + Math.random() * 150;
          s.egg.sparks.push({ vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, c: spectrum(Math.random()) });
        }
      }
      const be = (e - ASC) / 1000, life = 1 - (e - ASC) / BUR;
      const gg = s.ctx.createRadialGradient(ax, ay, 0, ax, ay, 160);
      gg.addColorStop(0, `rgba(160,120,255,${0.30 * life})`);
      gg.addColorStop(1, 'rgba(160,120,255,0)');
      s.ctx.fillStyle = gg;
      s.ctx.fillRect(ax - 160, ay - 160, 320, 320);
      s.ctx.globalAlpha = Math.max(0, life);
      for (const sp of s.egg.sparks) {
        const px = ax + sp.vx * be, py = ay + sp.vy * be + 46 * be * be;
        s.ctx.fillStyle = sp.c;
        s.ctx.fillRect(px, py, 2.6, 2.6);
      }
      s.ctx.globalAlpha = 1;
    } else {
      s.ctx.putImageData(s.base, 0, 0);
      s.egg = null;
      return;
    }
    s.raf = requestAnimationFrame(tick);
  }, []);

  const launchRocket = useCallback(() => {
    const s = stateRef.current;
    if (s.egg || !s.base || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    s.ctx = canvasRef.current.getContext('2d');
    s.egg = { t0: performance.now(), sparks: [], lit: false };
    s.raf = requestAnimationFrame(tick);
  }, [tick]);

  const onClick = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const r = canvas.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    if (modeRef.current === 'home') {
      const s = stateRef.current;
      if (s.aq?.feed) s.aq.feed(x, y);
    } else {
      launchRocket();
    }
  }, [launchRocket]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    clearAll();
    modeRef.current = isHome ? 'home' : 'other';
    if (isHome) {
      const s = stateRef.current;
      s.aq = createAquarium(canvas);
      s.aqGate = gateAnim(canvas, s.aq);
    } else {
      paintMountain();
    }
    return clearAll;
  }, [isHome, clearAll, paintMountain]);

  useEffect(() => {
    let footTO = 0;
    const onResize = () => {
      clearTimeout(footTO);
      footTO = setTimeout(() => {
        if (modeRef.current === 'other') paintMountain();
      }, 200);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [paintMountain]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.code !== 'Space' && e.key !== ' ') return;
      const tag = e.target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target?.isContentEditable) return;
      if (modeRef.current !== 'home') return;
      const s = stateRef.current;
      if (s.aq?.summonShark) {
        e.preventDefault();
        s.aq.summonShark();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <footer>
      <canvas
        className="foot-art"
        ref={canvasRef}
        aria-hidden="true"
        style={{ cursor: 'pointer' }}
        onClick={onClick}
      />
      <div className="foot-in">
        <div>
          <div className="fbrand">ali_laboratory</div>
          <div className="fmeta">Sydney &middot; building actuators &middot; &copy; 2026</div>
        </div>
        <div className="foot-soc">
          <a href="https://github.com/alislaboratory" target="_blank" rel="noopener">GitHub</a>
          <a href="https://www.linkedin.com/" target="_blank" rel="noopener">LinkedIn</a>
          <a href="https://x.com/" target="_blank" rel="noopener">X</a>
          <a href="https://www.instagram.com/" target="_blank" rel="noopener">Instagram</a>
        </div>
      </div>
    </footer>
  );
}
