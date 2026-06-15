import { useGateAnim } from '../hooks/useGateAnim';
import {
  createBanner, createPixelArt, createMotorArt,
  createHelixArt, createLifeArt, createThermal, createBlackHoleAscii,
  createGearsArt, createScopeArt, createCircuitArt, createSwarmArt, createPlasmaArt,
  createMatrixArt, createNeuralArt, createTerminalArt, createStarfieldArt,
  createFireArt, createMazeArt, createCubeArt, createTunnelArt,
  createMetaballsArt, createRippleArt, createLissajousArt, createVoronoiArt,
  createJuliaArt, createLorenzArt, createPhyllotaxisArt, createAutomataArt, createSnakeArt,
  createSandArt, createPendulumArt, createGlobeArt, createFireworksArt, createKaleidoArt,
} from '../lib/art';

const factories = {
  banner: (seed) => (canvas) => createBanner(canvas, seed),
  art: (seed) => (canvas) => createPixelArt(canvas, seed),
  motor: (canvas) => createMotorArt(canvas),
  helix: (canvas) => createHelixArt(canvas),
  life: (canvas) => createLifeArt(canvas),
  gears: (canvas) => createGearsArt(canvas),
  scope: (canvas) => createScopeArt(canvas),
  circuit: (canvas) => createCircuitArt(canvas),
  swarm: (canvas) => createSwarmArt(canvas),
  plasma: (canvas) => createPlasmaArt(canvas),
  matrix: (canvas) => createMatrixArt(canvas),
  neural: (canvas) => createNeuralArt(canvas),
  terminal: (canvas) => createTerminalArt(canvas),
  starfield: (canvas) => createStarfieldArt(canvas),
  fire: (canvas) => createFireArt(canvas),
  maze: (canvas) => createMazeArt(canvas),
  cube: (canvas) => createCubeArt(canvas),
  tunnel: (canvas) => createTunnelArt(canvas),
  metaballs: (canvas) => createMetaballsArt(canvas),
  ripple: (canvas) => createRippleArt(canvas),
  lissajous: (canvas) => createLissajousArt(canvas),
  voronoi: (canvas) => createVoronoiArt(canvas),
  julia: (canvas) => createJuliaArt(canvas),
  lorenz: (canvas) => createLorenzArt(canvas),
  phyllotaxis: (canvas) => createPhyllotaxisArt(canvas),
  automata: (canvas) => createAutomataArt(canvas),
  snake: (canvas) => createSnakeArt(canvas),
  sand: (canvas) => createSandArt(canvas),
  pendulum: (canvas) => createPendulumArt(canvas),
  globe: (canvas) => createGlobeArt(canvas),
  fireworks: (canvas) => createFireworksArt(canvas),
  kaleido: (canvas) => createKaleidoArt(canvas),
  thermal: (canvas) => createThermal(canvas),
  blackhole: (canvas) => createBlackHoleAscii(canvas),
};

const POSTART = [
  'motor', 'helix', 'life', 'gears', 'scope', 'circuit', 'swarm', 'plasma',
  'matrix', 'neural', 'terminal', 'starfield', 'blackhole', 'thermal',
  'fire', 'maze', 'cube', 'tunnel', 'metaballs', 'ripple', 'lissajous', 'voronoi',
  'julia', 'lorenz', 'phyllotaxis', 'automata', 'snake', 'sand', 'pendulum', 'globe', 'fireworks', 'kaleido',
];

export default function CanvasAnim({ kind, seed, className, id }) {
  const factory = kind === 'banner' ? factories.banner(seed)
    : kind === 'art' ? factories.art(seed)
    : kind === 'postart' ? (
        POSTART.includes(seed) ? factories[seed] : factories.art(3)
      )
    : factories[kind];

  const ref = useGateAnim(factory, [kind, seed]);
  return <canvas ref={ref} className={className} id={id} aria-hidden="true" />;
}
