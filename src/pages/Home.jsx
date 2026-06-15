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
          </Link>
          <Link to="/projects">
            <div className="k">002 &mdash; built</div>
            <div className="v">Projects <span className="arr">&rarr;</span></div>
          </Link>
          <Link to="/posts">
            <div className="k">003 &mdash; writing</div>
            <div className="v">Posts <span className="arr">&rarr;</span></div>
          </Link>
        </div>
      </div>
    </div>
  );
}
