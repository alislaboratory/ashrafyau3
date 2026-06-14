import CanvasAnim from '../components/CanvasAnim';

export default function About() {
  return (
    <div className="wrap page-enter">
      <p className="eyebrow">001 &mdash; About</p>
      <h1 className="title">Medicine and machines,<br />run in parallel.</h1>
      <div className="prose">
        <p className="lede">I'm Ali &mdash; a medical student who builds robots in the other half of the day. The two aren't a contradiction to me; they're the same instinct pointed at the same place: bodies, and how to repair and extend them.</p>
        <p>By day I'm in the BMedSci/MD program at UNSW. The rest of the time I'm the founder of <strong>Phase Robotics</strong>, where I'm building the actuator stack &mdash; motors, drivers, gearboxes and the firmware that ties them together &mdash; because the part most robots are missing is the one nobody sells.</p>
        <p>On the research side I work on machine learning for clinical prediction &mdash; most recently a model for estimating rotator-cuff retear risk from a long-running surgical registry. I like problems that sit on the seam between the clinic and the workshop, where a better sensor or a better model changes what's possible to do to a person, safely.</p>
      </div>
      <div className="hr" />
      <p className="eyebrow">Where I've worked</p>
      <div className="about-grid">
        <div className="rk">Founder</div><div className="rv"><b>Phase Robotics</b> &mdash; high-performance robotic actuators, vertically integrated. The long arc points at autonomous surgical robotics.</div>
        <div className="rk">Software</div><div className="rv"><b>Redback Racing</b> &mdash; Formula Student. Autonomous path-planning and perception for the driverless platform.</div>
        <div className="rk">Software</div><div className="rv"><b>BlueSat UNSW</b> &mdash; student satellite and space-systems team. Software contributor.</div>
        <div className="rk">Research</div><div className="rv"><b>Clinical ML</b> &mdash; predictive modelling on surgical outcomes; first-author work in progress.</div>
      </div>
      <div className="hr" />
      <div className="prose">
        <p>I think in terms of optionality and compounding &mdash; building things with real ownership rather than slotting into someone else's pathway. Outside the lab you'll find me in the water, at the wall (bouldering), or chasing my pilot's licence. I read widely; lately a lot of engineering history and Stoic philosophy.</p>
        <p className="meta">Reach me on <a className="lnk" href="https://www.linkedin.com/" target="_blank" rel="noopener">LinkedIn</a>, <a className="lnk" href="https://x.com/" target="_blank" rel="noopener">X</a> or <a className="lnk" href="https://github.com/alislaboratory" target="_blank" rel="noopener">GitHub</a>.</p>
      </div>
      <figure className="bhole-fig">
        <CanvasAnim kind="blackhole" id="bhole" />
        <figcaption className="bhole-cap">// still pointed at the hard problems</figcaption>
      </figure>
    </div>
  );
}
