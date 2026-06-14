import { Link } from 'react-router-dom';
import { PROJECTS } from '../lib/content';
import CanvasAnim from '../components/CanvasAnim';

export default function Projects() {
  return (
    <div className="wrap wide page-enter">
      <p className="eyebrow">002 &mdash; Projects</p>
      <h1 className="title">The actuator stack, in pieces.</h1>
      <div className="thermal">
        <CanvasAnim kind="thermal" id="thermal" />
        <div className="lbl">// thermal &mdash; heat is every actuator's enemy</div>
      </div>
      <div className="prose">
        <p className="lede" style={{ marginBottom: 14 }}>
          Each of these is one layer of the same problem &mdash; putting controllable, affordable torque into the world. A few are open; some live behind Phase.
        </p>
      </div>
      <div className="proj-list">
        {PROJECTS.map((p, idx) => (
          <Link key={p.slug} className="proj-card" to={`/projects/${p.slug}`}>
            <CanvasAnim kind="art" seed={idx * 2.3 + 1.7} className="proj-thumb" />
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
