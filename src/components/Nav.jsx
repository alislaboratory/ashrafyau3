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
          <a href="https://www.linkedin.com/" target="_blank" rel="noopener">in&#8599;</a>
          <a href="https://x.com/" target="_blank" rel="noopener">x&#8599;</a>
          <a href="https://www.instagram.com/" target="_blank" rel="noopener">ig&#8599;</a>
        </span>
      </div>
    </nav>
  );
}
