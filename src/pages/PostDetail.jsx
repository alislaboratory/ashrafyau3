import { Link, useParams } from 'react-router-dom';
import { usePosts } from '../lib/store';
import Banner from '../components/Banner';
import Tags from '../components/Tags';
import NotFound from './NotFound';

export default function PostDetail() {
  const { slug } = useParams();
  const POSTS = usePosts();
  const p = POSTS.find(x => x.slug === slug);
  if (!p || p.hidden) return <NotFound />;

  return (
    <div className="wrap page-enter">
      <Link className="backlink" to="/posts">&larr; all posts</Link>
      <p className="eyebrow">{p.date}</p>
      <h1 className="title">{p.title}</h1>
      <p className="pi-dek" style={{ marginBottom: 22 }}>{p.dek}</p>
      <div className="pi-foot" style={{ marginBottom: 28 }}>
        <Tags tags={p.tags} />
      </div>
      <Banner item={p} className="post-banner" />
      <div className="post-body" dangerouslySetInnerHTML={{ __html: p.body }} />
      <div className="hr" />
      <Link className="backlink" to="/posts" style={{ margin: 0 }}>&larr; all posts</Link>
    </div>
  );
}
