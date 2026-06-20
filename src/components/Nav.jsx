import Logo from './Logo';
import ScrambleLink from './ScrambleLink';

export default function Nav() {
  return (
    <nav className="nav">
      <Logo />
      <div className="navlinks">
        <ScrambleLink to="/about">About</ScrambleLink>
        <ScrambleLink to="/projects">Projects</ScrambleLink>
        <ScrambleLink to="/posts">Posts</ScrambleLink>
        <span className="soc">
          <a href="https://github.com/alislaboratory" target="_blank" rel="noopener noreferrer">gh&#8599;</a>
          <a href="https://www.linkedin.com/in/ali-ashrafy-711a6a295/" target="_blank" rel="noopener noreferrer">in&#8599;</a>
          <a href="https://x.com/maciint0sh" target="_blank" rel="noopener noreferrer">x&#8599;</a>
          <a href="https://www.instagram.com/alibuildsthings/reels/" target="_blank" rel="noopener noreferrer">ig&#8599;</a>
        </span>
      </div>
    </nav>
  );
}
