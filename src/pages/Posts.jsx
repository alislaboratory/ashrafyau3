import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { usePosts } from '../lib/store';
import Banner from '../components/Banner';
import Tags from '../components/Tags';

const MONTHS = ['', 'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

function monthKey(date) {
  const m = date.match(/(\d{4}).*?(\d{2})/);
  return m ? `${m[1]}-${m[2]}` : date;
}

function monthLabel(key) {
  const [y, mo] = key.split('-');
  return `${MONTHS[parseInt(mo, 10)] || mo} ${y}`;
}

export default function Posts() {
  const all = usePosts();
  const POSTS = useMemo(() => all.filter(p => !p.hidden), [all]);
  const [topic, setTopic] = useState('all');

  const topics = useMemo(() => {
    const set = new Set();
    POSTS.forEach(p => (p.topics || []).forEach(t => set.add(t)));
    return ['all', ...[...set].sort((a, b) => a.localeCompare(b))];
  }, [POSTS]);

  const groups = useMemo(() => {
    const filtered = topic === 'all'
      ? POSTS
      : POSTS.filter(p => (p.topics || []).includes(topic));
    const map = new Map();
    filtered.forEach(p => {
      const k = monthKey(p.date);
      if (!map.has(k)) map.set(k, []);
      map.get(k).push(p);
    });
    return [...map.entries()].sort((a, b) => b[0].localeCompare(a[0]));
  }, [topic, POSTS]);

  return (
    <div className="wrap wide page-enter postlist">
      <p className="eyebrow">003 &mdash; Posts</p>
      <h1 className="title">Posts.</h1>

      <div className="topicbar">
        <span className="topiclabel">// topic</span>
        {topics.map(t => (
          <button
            key={t}
            className={`topicbtn${topic === t ? ' active' : ''}`}
            onClick={() => setTopic(t)}
          >
            {t === 'all' ? 'all' : t}
          </button>
        ))}
      </div>

      {groups.map(([key, posts], gi) => (
        <details key={key} className="monthgroup" open={gi === 0}>
          <summary className="monthsum">
            <span className="monthname">{monthLabel(key)}</span>
            <span className="monthcount">{posts.length} post{posts.length > 1 ? 's' : ''}</span>
            <span className="monthchev" aria-hidden="true">&rsaquo;</span>
          </summary>
          <div className="monthbody">
            {posts.map(p => (
              <Link key={p.slug} className="postitem" to={`/posts/${p.slug}`}>
                <Banner item={p} className="pi-banner" />
                <h2 className="pi-title" style={{ margin: 0 }}>{p.title}</h2>
                <p className="pi-dek">{p.dek}</p>
                <div className="pi-foot">
                  <Tags tags={p.tags} />
                  <span className="meta">{p.date}</span>
                </div>
              </Link>
            ))}
          </div>
        </details>
      ))}

      {groups.length === 0 && (
        <p className="meta" style={{ marginTop: 28 }}>No posts under that topic yet.</p>
      )}
    </div>
  );
}
