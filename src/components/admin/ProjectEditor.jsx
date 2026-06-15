import { useState } from 'react';
import BannerPicker from './BannerPicker';
import { slugExists } from '../../lib/store';

const slugify = (s) =>
  s.toLowerCase().trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

const emptyProject = () => ({
  name: '', slug: '', stack: '', desc: '', status: 'In development',
  live: false, repo: '', art: '', image: '',
});

export default function ProjectEditor({ project, onSave, onCancel }) {
  const isNew = !project;
  const [form, setForm] = useState(() => ({ ...emptyProject(), ...(project || {}) }));
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [error, setError] = useState('');

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const onName = (v) => {
    setForm((f) => ({ ...f, name: v, slug: slugTouched ? f.slug : slugify(v) }));
  };

  const submit = () => {
    setError('');
    const name = form.name.trim();
    const slug = (form.slug || slugify(name)).trim();
    if (!name) return setError('Name is required.');
    if (!slug) return setError('Slug is required.');
    if (slugExists('project', slug, project?.slug)) return setError('That slug is already in use.');

    const cleaned = {
      name,
      slug,
      stack: form.stack.trim(),
      desc: form.desc.trim(),
      status: form.status.trim() || 'In development',
      live: !!form.live,
      repo: form.repo.trim() || null,
    };
    if (form.image) cleaned.image = form.image;
    else if (form.art) cleaned.art = form.art;

    try {
      onSave(project?.slug || null, cleaned);
    } catch (e) {
      setError('Save failed — likely storage is full from large images. Try a smaller photo. (' + e.message + ')');
    }
  };

  return (
    <div className="aeditor">
      <div className="aeditor-head">
        <h2 className="aeditor-title">{isNew ? 'New project' : 'Edit project'}</h2>
        <div className="aeditor-actions">
          <button type="button" className="abtn ghost" onClick={onCancel}>Cancel</button>
          <button type="button" className="abtn primary" onClick={submit}>Save project</button>
        </div>
      </div>

      {error && <div className="aerror">{error}</div>}

      <div className="arow">
        <label className="afield">
          <span className="alabel">Name</span>
          <input className="ainput" value={form.name} onChange={(e) => onName(e.target.value)} placeholder="Project name" />
        </label>
        <label className="afield" style={{ maxWidth: 260 }}>
          <span className="alabel">Slug</span>
          <input
            className="ainput mono"
            value={form.slug}
            onChange={(e) => { setSlugTouched(true); set('slug', slugify(e.target.value)); }}
            placeholder="project-slug"
          />
        </label>
      </div>

      <label className="afield">
        <span className="alabel">Stack <em>(short tech line)</em></span>
        <input className="ainput" value={form.stack} onChange={(e) => set('stack', e.target.value)} placeholder="ESP32 · FOC · magnetic encoder" />
      </label>

      <label className="afield">
        <span className="alabel">Description</span>
        <textarea className="ainput" rows={5} value={form.desc} onChange={(e) => set('desc', e.target.value)} />
      </label>

      <div className="arow">
        <label className="afield" style={{ maxWidth: 260 }}>
          <span className="alabel">Status</span>
          <input className="ainput" value={form.status} onChange={(e) => set('status', e.target.value)} placeholder="In development" />
        </label>
        <label className="afield achk">
          <span className="alabel">Live indicator</span>
          <label className="aswitch">
            <input type="checkbox" checked={form.live} onChange={(e) => set('live', e.target.checked)} />
            <span>Show pulsing green &ldquo;live&rdquo; status</span>
          </label>
        </label>
      </div>

      <label className="afield">
        <span className="alabel">Repo URL <em>(blank = private)</em></span>
        <input className="ainput mono" value={form.repo || ''} onChange={(e) => set('repo', e.target.value)} placeholder="https://github.com/..." />
      </label>

      <div className="afield">
        <span className="alabel">Banner <em>(optional — defaults to generative art)</em></span>
        <BannerPicker value={{ art: form.art, image: form.image }} onChange={(v) => setForm((f) => ({ ...f, art: v.art, image: v.image }))} />
      </div>

      <div className="aeditor-foot">
        <button type="button" className="abtn ghost" onClick={onCancel}>Cancel</button>
        <button type="button" className="abtn primary" onClick={submit}>Save project</button>
      </div>
    </div>
  );
}
