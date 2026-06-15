import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  usePosts, useProjects, upsertPost, deletePost, upsertProject, deleteProject,
  move, resetAll, exportData, importData,
} from '../lib/store';
import {
  isAuthed, login, logout, changePassword, usingDefaultPassword,
} from '../lib/admin/auth';
import PostEditor from '../components/admin/PostEditor';
import ProjectEditor from '../components/admin/ProjectEditor';
import Banner from '../components/Banner';

function Login({ onIn }) {
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setErr('');
    const ok = await login(pw);
    setBusy(false);
    if (ok) onIn();
    else setErr('Incorrect password.');
  };

  return (
    <div className="admin-login">
      <form className="login-card" onSubmit={submit}>
        <p className="eyebrow">// restricted</p>
        <h1 className="login-h1">Admin.</h1>
        <p className="login-sub">Enter the password to manage posts and projects.</p>
        <input
          type="password"
          className="ainput"
          value={pw}
          autoFocus
          placeholder="password"
          onChange={(e) => setPw(e.target.value)}
        />
        {err && <div className="aerror">{err}</div>}
        <button type="submit" className="abtn primary full" disabled={busy}>
          {busy ? 'Checking\u2026' : 'Unlock'}
        </button>
        <Link to="/" className="login-back">&larr; back to site</Link>
      </form>
    </div>
  );
}

function ListRow({ item, kind, idx, total, onEdit }) {
  const title = item.title || item.name;
  const sub = kind === 'post' ? item.dek : item.stack;
  const del = () => {
    if (window.confirm(`Delete "${title}"? This cannot be undone.`)) {
      kind === 'post' ? deletePost(item.slug) : deleteProject(item.slug);
    }
  };
  const toggleHidden = () => upsertPost(item.slug, { ...item, hidden: !item.hidden });
  return (
    <div className={`arow-item${item.hidden ? ' is-hidden' : ''}`}>
      <div className="arow-thumb">
        <Banner item={item} fallbackSeed={idx * 2.3 + 1.7} className="arow-thumb-canvas" />
      </div>
      <div className="arow-main">
        <div className="arow-title">{title}</div>
        <div className="arow-sub">{sub}</div>
        <div className="arow-meta">
          <span className="mono">/{item.slug}</span>
          {kind === 'post' && item.date && <span>{item.date}</span>}
          {kind === 'post' && item.hidden && <span className="atag hidden">hidden</span>}
          {item.image ? <span className="atag photo">photo</span> : item.art ? <span className="atag anim">{item.art}</span> : <span className="atag anim">generative</span>}
        </div>
      </div>
      <div className="arow-ctrls">
        <button className="aicon" title="Move up" disabled={idx === 0} onClick={() => move(kind, item.slug, -1)}>&uarr;</button>
        <button className="aicon" title="Move down" disabled={idx === total - 1} onClick={() => move(kind, item.slug, 1)}>&darr;</button>
        {kind === 'post' && (
          <button className="abtn ghost sm" onClick={toggleHidden}>{item.hidden ? 'Show' : 'Hide'}</button>
        )}
        <button className="abtn ghost sm" onClick={() => onEdit(item)}>Edit</button>
        <button className="abtn ghost sm danger" onClick={del}>Delete</button>
      </div>
    </div>
  );
}

function Settings() {
  const [pw1, setPw1] = useState('');
  const [pw2, setPw2] = useState('');
  const [msg, setMsg] = useState('');
  const fileRef = useRef(null);

  const savePw = async () => {
    setMsg('');
    if (pw1.length < 4) return setMsg('Password must be at least 4 characters.');
    if (pw1 !== pw2) return setMsg('Passwords do not match.');
    await changePassword(pw1);
    setPw1(''); setPw2('');
    setMsg('Password updated.');
  };

  const doExport = () => {
    const blob = new Blob([exportData()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ashrafyau-content.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const doImport = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const text = await file.text();
      importData(text);
      setMsg('Content imported.');
    } catch (err) {
      setMsg('Import failed: ' + err.message);
    }
  };

  const doReset = () => {
    if (window.confirm('Reset ALL content back to the original built-in defaults? Your changes will be lost.')) {
      resetAll();
      setMsg('Reset to defaults.');
    }
  };

  return (
    <div className="asettings">
      <section className="acard">
        <h3 className="acard-h">Change password</h3>
        {usingDefaultPassword() && (
          <p className="awarn">You are using the default password. Change it.</p>
        )}
        <div className="arow">
          <label className="afield"><span className="alabel">New password</span>
            <input type="password" className="ainput" value={pw1} onChange={(e) => setPw1(e.target.value)} /></label>
          <label className="afield"><span className="alabel">Confirm</span>
            <input type="password" className="ainput" value={pw2} onChange={(e) => setPw2(e.target.value)} /></label>
        </div>
        <button className="abtn primary" onClick={savePw}>Update password</button>
      </section>

      <section className="acard">
        <h3 className="acard-h">Backup &amp; restore</h3>
        <p className="acard-sub">
          Content lives in this browser&rsquo;s local storage. Export a JSON file to back it up,
          move it to another device, or commit it to the repo.
        </p>
        <div className="abtn-row">
          <button className="abtn ghost" onClick={doExport}>Export JSON</button>
          <button className="abtn ghost" onClick={() => fileRef.current?.click()}>Import JSON</button>
          <button className="abtn ghost danger" onClick={doReset}>Reset to defaults</button>
        </div>
        <input ref={fileRef} type="file" accept="application/json" hidden onChange={doImport} />
      </section>

      {msg && <div className="anote">{msg}</div>}
    </div>
  );
}

export default function Admin() {
  const [authed, setAuthed] = useState(isAuthed());
  const [tab, setTab] = useState('posts');
  const [editing, setEditing] = useState(null); // { kind, item|null }
  const posts = usePosts();
  const projects = useProjects();

  if (!authed) return <Login onIn={() => setAuthed(true)} />;

  if (editing) {
    const close = () => setEditing(null);
    if (editing.kind === 'post') {
      return (
        <div className="admin-page">
          <PostEditor
            post={editing.item}
            onSave={(slug, data) => { upsertPost(slug, data); close(); }}
            onCancel={close}
          />
        </div>
      );
    }
    return (
      <div className="admin-page">
        <ProjectEditor
          project={editing.item}
          onSave={(slug, data) => { upsertProject(slug, data); close(); }}
          onCancel={close}
        />
      </div>
    );
  }

  return (
    <div className="admin-page">
      <header className="admin-top">
        <div className="admin-brand">
          <span className="mono">ali_admin</span>
          <Link to="/" className="admin-viewlink">view site &#8599;</Link>
        </div>
        <nav className="admin-tabs">
          <button className={`atab${tab === 'posts' ? ' active' : ''}`} onClick={() => setTab('posts')}>Posts <span className="acount">{posts.length}</span></button>
          <button className={`atab${tab === 'projects' ? ' active' : ''}`} onClick={() => setTab('projects')}>Projects <span className="acount">{projects.length}</span></button>
          <button className={`atab${tab === 'settings' ? ' active' : ''}`} onClick={() => setTab('settings')}>Settings</button>
        </nav>
        <button className="abtn ghost sm" onClick={() => { logout(); setAuthed(false); }}>Log out</button>
      </header>

      {tab === 'settings' ? (
        <Settings />
      ) : (
        <div className="admin-list">
          <div className="admin-list-head">
            <h1 className="admin-h1">{tab === 'posts' ? 'Posts' : 'Projects'}</h1>
            <button className="abtn primary" onClick={() => setEditing({ kind: tab === 'posts' ? 'post' : 'project', item: null })}>
              + New {tab === 'posts' ? 'post' : 'project'}
            </button>
          </div>
          <div className="arows">
            {(tab === 'posts' ? posts : projects).map((item, idx, arr) => (
              <ListRow
                key={item.slug}
                item={item}
                kind={tab === 'posts' ? 'post' : 'project'}
                idx={idx}
                total={arr.length}
                onEdit={(it) => setEditing({ kind: tab === 'posts' ? 'post' : 'project', item: it })}
              />
            ))}
            {(tab === 'posts' ? posts : projects).length === 0 && (
              <p className="meta">Nothing here yet. Create your first {tab === 'posts' ? 'post' : 'project'}.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
