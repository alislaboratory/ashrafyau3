export const AURORA = [[91,108,255],[123,92,255],[161,92,255],[214,92,255],[92,214,255]];

export function lerpC(a, b, t) {
  return [a[0]+(b[0]-a[0])*t, a[1]+(b[1]-a[1])*t, a[2]+(b[2]-a[2])*t];
}

export function spectrum(t) {
  t = Math.max(0, Math.min(0.9999, t));
  const seg = t * (AURORA.length - 1), i = seg | 0, f = seg - i;
  const c = lerpC(AURORA[i], AURORA[i + 1], f);
  return `rgb(${c[0]|0},${c[1]|0},${c[2]|0})`;
}

export function specArr(t) {
  t = Math.max(0, Math.min(0.9999, t));
  const seg = t * (AURORA.length - 1), i = seg | 0, f = seg - i;
  return lerpC(AURORA[i], AURORA[i + 1], f);
}

export function setupCanvas(canvas) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const rect = canvas.getBoundingClientRect();
  const W = Math.max(2, Math.round(rect.width)), H = Math.max(2, Math.round(rect.height));
  canvas.width = W * dpr; canvas.height = H * dpr;
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, W, H };
}

export function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
}

export function tagRow(tags) {
  return `<div class="tags">${tags.map(t => `<span class="tag">${esc(t)}</span>`).join('')}</div>`;
}
