import { useState } from 'react';
import RichText from './RichText';
import BannerPicker from './BannerPicker';
import { slugExists } from '../../lib/store';

const slugify = (s) =>
  s.toLowerCase().trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

const defaultDate = () => {
  const d = new Date();
  return `${d.getFullYear()} \u00b7 ${String(d.getMonth() + 1).padStart(2, '0')}`;
};

const emptyPost = () => ({
  slug: '', title: '', dek: '', tags: [], topics: [], date: defaultDate(),
  art: 'motor', image: '', body: '<p class="lede"></p>', hidden: false,
});

export default function PostEditor({ post, onSave, onCancel }) {
  const isNew = !post;
  const [form, setForm] = useState(() => ({ ...emptyPost(), ...(post || {}) }));
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [error, setError] = useState('');

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const onTitle = (v) => {
    setForm((f) => ({ ...f, title: v, slug: slugTouched ? f.slug : slugify(v) }));
  };

  const submit = () => {
    setError('');
    const title = form.title.trim();
    const slug = (form.slug || slugify(title)).trim();
    if (!title) return setError('Title is required.');
    if (!slug) return setError('Slug is required.');
    if (slugExists('post', slug, post?.slug)) return setError('That slug is already in use.');

    const cleaned = {
      slug,
      title,
      dek: form.dek.trim(),
      tags: Array.isArray(form.tags) ? form.tags : String(form.tags).split(',').map((t) => t.trim()).filter(Boolean),
      topics: Array.isArray(form.topics) ? form.topics : String(form.topics).split(',').map((t) => t.trim()).filter(Boolean),
      date: form.date.trim() || defaultDate(),
      body: form.body,
      hidden: !!form.hidden,
    };
    if (form.image) cleaned.image = form.image;
    else cleaned.art = form.art || 'motor';

    try {
      onSave(post?.slug || null, cleaned);
    } catch (e) {
      setError('Save failed — likely storage is full from large images. Try a smaller photo. (' + e.message + ')');
    }
  };

  const tagsStr = Array.isArray(form.tags) ? form.tags.join(', ') : form.tags;
  const topicsStr = Array.isArray(form.topics) ? form.topics.join(', ') : form.topics;

  return (
    <div className="aeditor">
      <div className="aeditor-head">
        <h2 className="aeditor-title">{isNew ? 'New post' : 'Edit post'}</h2>
        <div className="aeditor-actions">
          <button type="button" className="abtn ghost" onClick={onCancel}>Cancel</button>
          <button type="button" className="abtn primary" onClick={submit}>Save post</button>
        </div>
      </div>

      {error && <div className="aerror">{error}</div>}

      <label className="afield">
        <span className="alabel">Title</span>
        <input className="ainput" value={form.title} onChange={(e) => onTitle(e.target.value)} placeholder="Post title" />
      </label>

      <div className="arow">
        <label className="afield">
          <span className="alabel">Slug</span>
          <input
            className="ainput mono"
            value={form.slug}
            onChange={(e) => { setSlugTouched(true); set('slug', slugify(e.target.value)); }}
            placeholder="post-slug"
          />
        </label>
        <label className="afield" style={{ maxWidth: 200 }}>
          <span className="alabel">Date</span>
          <input className="ainput mono" value={form.date} onChange={(e) => set('date', e.target.value)} placeholder="2026 · 06" />
        </label>
      </div>

      <label className="afield">
        <span className="alabel">Dek <em>(one-line summary)</em></span>
        <textarea className="ainput" rows={2} value={form.dek} onChange={(e) => set('dek', e.target.value)} />
      </label>

      <label className="afield achk">
        <span className="alabel">Visibility</span>
        <label className="aswitch">
          <input type="checkbox" checked={!!form.hidden} onChange={(e) => set('hidden', e.target.checked)} />
          <span>Hidden &mdash; keep as a draft, not shown on the site</span>
        </label>
      </label>

      <div className="arow">
        <label className="afield">
          <span className="alabel">Tags <em>(comma-separated)</em></span>
          <input className="ainput" value={tagsStr} onChange={(e) => set('tags', e.target.value)} placeholder="motors, FOC, control" />
        </label>
        <label className="afield">
          <span className="alabel">Topics <em>(for filtering)</em></span>
          <input className="ainput" value={topicsStr} onChange={(e) => set('topics', e.target.value)} placeholder="robots, AI, meta" />
        </label>
      </div>

      <div className="afield">
        <span className="alabel">Banner</span>
        <BannerPicker value={{ art: form.art, image: form.image }} onChange={(v) => setForm((f) => ({ ...f, art: v.art, image: v.image }))} />
      </div>

      <div className="afield">
        <span className="alabel">Body</span>
        <RichText value={form.body} onChange={(v) => set('body', v)} />
      </div>

      <div className="aeditor-foot">
        <button type="button" className="abtn ghost" onClick={onCancel}>Cancel</button>
        <button type="button" className="abtn primary" onClick={submit}>Save post</button>
      </div>
    </div>
  );
}
