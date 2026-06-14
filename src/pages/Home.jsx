import { Link } from 'react-router-dom';
import FluidHero from '../components/FluidHero';

export default function Home() {
  return (
    <div className="page-enter">
      <FluidHero />
      <div className="home-strip">
        <div className="home-grid">
          <Link to="/about">
            <div className="k">001 &mdash; who</div>
            <div className="v">About <span className="arr">&rarr;</span></div>
            <p>Medicine and machines, run in parallel. The short version of what I do and why.</p>
          </Link>
          <Link to="/projects">
            <div className="k">002 &mdash; built</div>
            <div className="v">Projects <span className="arr">&rarr;</span></div>
            <p>Motor drivers, haptics, biopotential hardware. The actuator stack, in pieces.</p>
          </Link>
          <Link to="/posts">
            <div className="k">003 &mdash; writing</div>
            <div className="v">Posts <span className="arr">&rarr;</span></div>
            <p>Notes on robotics, motors and why the body is the bottleneck.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
