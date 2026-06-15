import { useEffect, useRef } from 'react';
import { Fluid } from '../lib/fluid';

export default function FluidHero() {
  const heroRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const hero = heroRef.current;
    const canvas = canvasRef.current;
    if (!hero || !canvas) return;
    Fluid.start(hero, canvas);
    return () => Fluid.stop();
  }, []);

  return (
    <section className="hero" ref={heroRef}>
      <canvas id="fluid" ref={canvasRef} aria-hidden="true" />
      <div className="hero-clear" />
      <div className="hero-glow" />
      <div className="hero-center">
        <h1 className="hero-name">Ali Ashrafy</h1>
        <p className="hero-sub">
          Med student &middot; engineer &middot; researcher. Building robots.
        </p>
      </div>
      <div className="hero-hint">
        move to stir &middot; click to burst <span className="blink">_</span>
      </div>
    </section>
  );
}
