import { useRef, useState } from 'react';
import CanvasAnim from '../CanvasAnim';
import { ANIMATIONS } from '../../lib/animations';
import { readImageScaled, approxDataUrlKB } from '../../lib/image';

// value: { art?: string, image?: string }
export default function BannerPicker({ value, onChange }) {
  const initialTab = value?.image ? 'photo' : 'animation';
  const [tab, setTab] = useState(initialTab);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef(null);

  const chooseArt = (id) => onChange({ art: id, image: '' });

  const onPhoto = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setBusy(true);
    try {
      const dataUrl = await readImageScaled(file, 1600, 0.82);
      onChange({ art: '', image: dataUrl });
    } catch (err) {
      alert('Could not load image: ' + err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="banpick">
      <div className="banpick-tabs">
        <button type="button" className={`bptab${tab === 'animation' ? ' active' : ''}`} onClick={() => setTab('animation')}>
          Animation
        </button>
        <button type="button" className={`bptab${tab === 'photo' ? ' active' : ''}`} onClick={() => setTab('photo')}>
          Photo
        </button>
      </div>

      {tab === 'animation' ? (
        <div className="banpick-grid">
          {ANIMATIONS.map((a) => (
            <button
              key={a.id}
              type="button"
              className={`banpick-tile${value?.art === a.id ? ' sel' : ''}`}
              onClick={() => chooseArt(a.id)}
              title={a.name}
            >
              <CanvasAnim kind="postart" seed={a.id} className="banpick-canvas" />
              <span className="banpick-name">{a.name}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="banpick-photo">
          {value?.image ? (
            <div className="banpick-preview">
              <img src={value.image} alt="banner preview" />
              <div className="banpick-photo-actions">
                <span className="meta">~{approxDataUrlKB(value.image)} KB</span>
                <button type="button" className="abtn ghost" onClick={() => fileRef.current?.click()}>Replace</button>
                <button type="button" className="abtn ghost danger" onClick={() => onChange({ art: '', image: '' })}>Remove</button>
              </div>
            </div>
          ) : (
            <button type="button" className="banpick-drop" onClick={() => fileRef.current?.click()} disabled={busy}>
              {busy ? 'Processing\u2026' : 'Click to upload a banner photo'}
            </button>
          )}
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={onPhoto} />
        </div>
      )}
    </div>
  );
}
