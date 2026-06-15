import { useEffect, useMemo, useState } from 'react';
import CanvasAnim from '../components/CanvasAnim';
import { ANIMATIONS as GALLERY, HINTS } from '../lib/animations';

const FILTERS = ['all', 'new', 'ascii', 'pixel'];

export default function Lab() {
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);

  const items = useMemo(() => {
    if (filter === 'all') return GALLERY;
    if (filter === 'new') return GALLERY.filter(g => g.isNew);
    return GALLERY.filter(g => g.type === filter);
  }, [filter]);

  const newCount = GALLERY.filter(g => g.isNew).length;

  useEffect(() => {
    if (!selected) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') setSelected(null); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [selected]);

  return (
    <div className="lab-page page-enter">
      <div className="lab-head">
        <p className="eyebrow">&#47;&#47; the lab</p>
        <h1 className="title lab-h1">Animation lab.</h1>
        <p className="lablede">
          A live gallery of the generative banners I build for posts &mdash; pixel art and ASCII,
          all running in real time. Some are waiting on essays I haven&rsquo;t written yet; they were
          too nice to leave hidden. <strong>Everything reacts to your mouse</strong> &mdash; click any tile to open it full-screen.
        </p>

        <div className="topicbar lab-filters">
          <span className="topiclabel">&#47;&#47; filter</span>
          {FILTERS.map(f => (
            <button
              key={f}
              className={`topicbtn${filter === f ? ' active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'new' ? `new (${newCount})` : f}
            </button>
          ))}
        </div>
      </div>

      <div className="lab-grid">
        {items.map((g) => (
          <button
            key={g.id}
            type="button"
            className="lab-tile"
            onClick={() => setSelected(g)}
          >
            <CanvasAnim kind="postart" seed={g.id} className="lab-canvas" />
            <span className="lab-cap">
              <span className="lab-name">{g.name}</span>
              <span className="lab-tagrow">
                <span className={`lab-type ${g.type}`}>{g.type}</span>
                {g.isNew && <span className="lab-new">new</span>}
              </span>
            </span>
          </button>
        ))}
      </div>

      {selected && (
        <div className="lab-modal" onClick={() => setSelected(null)}>
          <button className="lab-close" onClick={() => setSelected(null)} aria-label="close">esc &#10005;</button>
          <div className="lab-stage" onClick={e => e.stopPropagation()}>
            <CanvasAnim kind="postart" seed={selected.id} className="lab-fullcanvas" />
            <div className="lab-info">
              <div className="lab-info-head">
                <h2 className="lab-info-name">{selected.name}</h2>
                <span className="lab-tagrow">
                  <span className={`lab-type ${selected.type}`}>{selected.type}</span>
                  {selected.isNew && <span className="lab-new">new</span>}
                </span>
              </div>
              <p className="lab-blurb">{selected.blurb}</p>
              <p className="lab-witty">{selected.witty}</p>
              <p className="lab-hint">{HINTS[selected.id] || 'move your mouse over it'} &middot; esc to close</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
