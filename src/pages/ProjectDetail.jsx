import { Link, useParams } from 'react-router-dom';
import { useProjects } from '../lib/store';
import Banner from '../components/Banner';
import NotFound from './NotFound';

export default function ProjectDetail() {
  const { slug } = useParams();
  const PROJECTS = useProjects();
  const idx = PROJECTS.findIndex(x => x.slug === slug);
  if (idx < 0) return <NotFound />;
  const p = PROJECTS[idx];

  return (
    <div className="wrap page-enter">
      <Link className="backlink" to="/projects">&larr; all projects</Link>
      <p className="eyebrow">Project</p>
      <h1 className="title">{p.name}</h1>
      <div className="pstack" style={{ marginBottom: 6 }}>{p.stack}</div>
      <Banner item={p} fallbackSeed={idx * 2.3 + 1.7} fallbackKind="art" className="proj-banner" />
      <div className="prose"><p className="lede">{p.desc}</p></div>
      <div className="hr" />
      <div className="about-grid">
        <div className="rk">Status</div><div className="rv">{p.status}</div>
        <div className="rk">Stack</div><div className="rv">{p.stack}</div>
        <div className="rk">Source</div>
        <div className="rv">
          {p.repo ? (
            <a className="lnk" href={p.repo} target="_blank" rel="noopener">
              {p.repo.replace('https://', '')} &#8599;
            </a>
          ) : 'Internal to Phase Robotics &mdash; not public.'}
        </div>
      </div>
      {!p.image && !p.art && (
        <p className="meta" style={{ marginTop: 24 }}>
          The image above is placeholder generative pixel art &mdash; renders/photos to come.
        </p>
      )}
      <div className="hr" />
      <Link className="backlink" to="/projects" style={{ margin: 0 }}>&larr; all projects</Link>
    </div>
  );
}
