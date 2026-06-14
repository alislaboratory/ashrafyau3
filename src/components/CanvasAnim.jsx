import { useGateAnim } from '../hooks/useGateAnim';
import {
  createBanner, createPixelArt, createMotorArt,
  createHelixArt, createLifeArt, createThermal, createBlackHoleAscii,
} from '../lib/art';

const factories = {
  banner: (seed) => (canvas) => createBanner(canvas, seed),
  art: (seed) => (canvas) => createPixelArt(canvas, seed),
  motor: (canvas) => createMotorArt(canvas),
  helix: (canvas) => createHelixArt(canvas),
  life: (canvas) => createLifeArt(canvas),
  thermal: (canvas) => createThermal(canvas),
  blackhole: (canvas) => createBlackHoleAscii(canvas),
};

export default function CanvasAnim({ kind, seed, className, id }) {
  const factory = kind === 'banner' ? factories.banner(seed)
    : kind === 'art' ? factories.art(seed)
    : kind === 'postart' ? (
        seed === 'motor' ? factories.motor
        : seed === 'helix' ? factories.helix
        : seed === 'life' ? factories.life
        : factories.art(3)
      )
    : factories[kind];

  const ref = useGateAnim(factory, [kind, seed]);
  return <canvas ref={ref} className={className} id={id} aria-hidden="true" />;
}
