import { Link } from 'react-router-dom';
import { POSTS } from '../lib/content';
import CanvasAnim from '../components/CanvasAnim';
import Tags from '../components/Tags';

function PostBanner({ post }) {
  if (post.art) return <CanvasAnim kind="postart" seed={post.art} className="pi-banner" />;
  return <CanvasAnim kind="banner" seed={post.seed} className="pi-banner" />;
}

export default function Posts() {
  return (
    <div className="wrap wide page-enter postlist">
      <p className="eyebrow">003 &mdash; Posts</p>
      <h1 className="title">Notes on the bottleneck.</h1>
      <div className="prose">
        <p className="lede" style={{ marginBottom: 30 }}>
          Writing about why the body &mdash; not the brain &mdash; is the hard part of robotics, and the motors that gate the whole thing.
        </p>
      </div>
      {POSTS.map(p => (
        <Link key={p.slug} className="postitem" to={`/posts/${p.slug}`}>
          <PostBanner post={p} />
          <h2 className="pi-title" style={{ margin: 0 }}>{p.title}</h2>
          <p className="pi-dek">{p.dek}</p>
          <div className="pi-foot">
            <Tags tags={p.tags} />
            <span className="meta">{p.date}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
