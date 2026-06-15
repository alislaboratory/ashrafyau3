import { Link } from 'react-router-dom';
import { useProjects } from '../lib/store';
import CanvasAnim from '../components/CanvasAnim';
import Banner from '../components/Banner';

export default function Projects() {
  const PROJECTS = useProjects();
  return (
    <div className="wrap wide page-enter">
      <p className="eyebrow">002 &mdash; Projects</p>
      <h1 className="title">Projects.</h1>
      <div className="thermal">
        <CanvasAnim kind="thermal" id="thermal" />
        <div className="lbl">// thermal &mdash; heat is every actuator's enemy</div>
      </div>
      <div className="proj-list">
        {PROJECTS.map((p, idx) => (
          <Link key={p.slug} className="proj-card" to={`/projects/${p.slug}`}>
            <Banner item={p} fallbackSeed={idx * 2.3 + 1.7} fallbackKind="art" className="proj-thumb" />
            <div className="proj-body">
              <div className="pname">{p.name} <span className="arr">&rarr;</span></div>
              <div className="pstack">{p.stack}</div>
              <div className={`status ${p.live ? 'live' : ''}`}>
                <span className="led" />{p.status}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
