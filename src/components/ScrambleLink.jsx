import { useRef } from 'react';
import { NavLink } from 'react-router-dom';

const GL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&@*<>/\\=+'.split('');
const COL = ['#5b6cff', '#7b5cff', '#a15cff', '#d65cff', '#4cd6ff'];

export default function ScrambleLink({ to, children, end }) {
  const label = typeof children === 'string' ? children : String(children);
  const timerRef = useRef(null);
  const elRef = useRef(null);

  function stop() {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    if (elRef.current) elRef.current.textContent = label;
  }

  function onEnter() {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (timerRef.current) clearInterval(timerRef.current);
    let frame = 0;
    const len = label.length;
    timerRef.current = setInterval(() => {
      frame++;
      const rev = Math.floor(frame / 2);
      let html = '';
      for (let i = 0; i < len; i++) {
        if (i < rev) html += `<span style="color:var(--ink)">${label[i]}</span>`;
        else {
          const c = COL[(Math.random() * COL.length) | 0];
          const g = GL[(Math.random() * GL.length) | 0];
          html += `<span style="color:${c}">${g}</span>`;
        }
      }
      if (elRef.current) elRef.current.innerHTML = html;
      if (rev >= len) {
        clearInterval(timerRef.current);
        timerRef.current = null;
        if (elRef.current) elRef.current.textContent = label;
      }
    }, 34);
  }

  return (
    <NavLink to={to} end={end} onMouseEnter={onEnter} onMouseLeave={stop} onPointerUp={stop}>
      <span ref={elRef} style={{ pointerEvents: 'none' }}>{label}</span>
    </NavLink>
  );
}
