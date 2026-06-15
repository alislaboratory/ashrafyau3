export const PROJECTS = [
  { name:"Lunar Drive V2", slug:"lunar-drive-v2", stack:"ESP32-S3 \u00b7 DRV8316C \u00b7 AS5047P \u00b7 ESP-IDF / FOC",
    desc:"A compact, integrated motor-driver board for field-oriented torque control of BLDC actuators. Closed-loop on a 14-bit magnetic encoder, built around the Phase Robotics actuator stack. The second generation fixed the SPI routing fault that bricked five v1 boards and moved firmware onto ESP-IDF for real-time current control.",
    status:"In development", live:true, repo:null },
  { name:"detentOne", slug:"detentone", stack:"FOC \u00b7 haptics \u00b7 magnetic encoder",
    desc:"A single-axis closed-loop haptic device \u2014 programmable detents, endstops and textures rendered in software on a brushless motor. A small testbed for the control work that makes a robotic joint feel like a real, intentional mechanism rather than a stepper clicking through poses.",
    status:"Open source", live:false, repo:"https://github.com/alislaboratory/detentOne" },
  { name:"CARDio", slug:"cardio", stack:"PCB \u00b7 analog front-end \u00b7 biopotential",
    desc:"A cardiac monitoring board: low-noise analog front-end and PCB for acquiring biopotential signals. My scope here was the hardware \u2014 instrumentation amplification, filtering and layout for a clean signal chain off the body.",
    status:"Open source", live:false, repo:"https://github.com/alislaboratory/CARDio" },
];

export const POSTS = [
  { slug:"brain-solved-body-not", title:"We solved the brain and forgot the body",
    dek:"AI raced ahead on cognition and left the physical world untouched. Robotics is the unpaid bill coming due.",
    tags:["AI","robotics","embodiment"], topics:["AI","robots"], date:"2026 \u00b7 06", art:"neural",
    body:`
<p class="lede">The last decade poured almost all of its genius into the brain \u2014 models that reason, write, plan and predict. Meanwhile the body of intelligence, the part that actually touches the world, barely moved. The banner above is the brain we built; the gap is the body we didn't.</p>
<p>It's a strange asymmetry. We can rent a model that drafts a legal argument, yet there is no robot that can reliably fold laundry in an unfamiliar room. The cognition is superhuman in narrow ways; the embodiment is below a toddler. That mismatch isn't a footnote \u2014 it's the whole frontier.</p>
<div class="pull">A mind with no hands is a very expensive opinion. Intelligence only changes the physical world once it can act on it.</div>
<p>The reason is that bits were always easier than atoms. Training a model is a closed, fast, forgiving loop. Acting in the world is open, slow and unforgiving \u2014 every grasp fights friction, every step fights gravity, every mistake is real. So we did the easy half first and called it progress.</p>
<p>I think the next era is paying down that debt: giving the brain a body good enough to be worth its intelligence. And the body, in the end, comes down to actuators \u2014 which is exactly why I work on the unglamorous half.</p>
<p class="meta">Placeholder post \u2014 a longer argument on embodiment is coming.</p>` },
  { slug:"atoms-harder-than-bits", title:"Atoms are harder than bits",
    dek:"Software got eaten first because it was the soft target. The physical economy is the harder, larger prize still sitting untouched.",
    tags:["meta","AI","economics"], topics:["meta","AI"], date:"2026 \u00b7 06", art:"matrix",
    body:`
<p class="lede">Every digital revolution so far has had the same quiet advantage: it operated on bits. Bits are weightless, copyable, instant and forgiving. The banner above is that world \u2014 endless, frictionless information. The trouble is that almost nothing we actually need is made of bits.</p>
<p>Atoms are the opposite in every dimension. They have mass, they wear out, they exist in exactly one place at a time, and they punish every mistake with real consequences. That's why software ate the world of information and then stopped at the edge of the physical one. It reached the shore and couldn't swim.</p>
<div class="pull">We automated the easy half of the economy and declared victory. The half made of atoms is bigger \u2014 and it's still almost entirely manual.</div>
<p>This is also why I'm skeptical of the idea that intelligence alone finishes the job. A smarter model still can't lift a beam, suture a wound or assemble a car. Those require a body in the world, paying the atom tax in friction, heat and wear. The bottleneck was never thinking. It was doing.</p>
<p>So the interesting work, to me, is on the atom side: the actuators and machines that let intelligence finally act on matter. Harder, slower, less glamorous \u2014 and precisely for that reason, more wide open.</p>
<p class="meta">Placeholder post \u2014 a fuller piece on the atoms-vs-bits divide to follow.</p>` },
  { slug:"optionality-and-ownership", title:"Optionality is the only moat I trust",
    dek:"A note on building things you own, keeping doors open, and why compounding beats credentials.",
    tags:["meta","strategy","building"], topics:["meta"], date:"2026 \u00b7 05", art:"terminal",
    body:`
<p class="lede">I think about my own path the way I think about a system: what keeps the most doors open, and what compounds. The banner above is a machine booting itself, line by line \u2014 which is roughly how I'd like to build a life and a company.</p>
<p>The default path optimises for legibility: a clean title, a known ladder, a predictable next rung. It's comfortable and it's also fragile, because all the value lives in someone else's hands. The moment the ladder moves, you move with it.</p>
<div class="pull">Credentials are someone else's permission. Ownership is leverage that keeps compounding while you sleep.</div>
<p>Optionality is the opposite bet. Build things with real ownership \u2014 skills, code, hardware, equity \u2014 that keep paying out and keep opening new moves. Most of them won't matter. A few will compound into something far larger than the effort that started them. You only need to be right occasionally if the upside is uncapped and the downside is bounded.</p>
<p>That's the logic behind doing medicine and robotics at once, behind open-sourcing some work and holding other parts close. Not indecision \u2014 a deliberate refusal to collapse the option space too early.</p>
<p class="meta">Placeholder post \u2014 a longer reflection on optionality and compounding is coming.</p>` },
  { slug:"cost-of-an-undo-button", title:"The cost of not having an undo button",
    dek:"Bits forgive and atoms don't. Designing for a world with no undo changes everything about how you build.",
    tags:["systems","robotics","design"], topics:["meta","robots"], date:"2026 \u00b7 04", art:"starfield",
    body:`
<p class="lede">Software is built on undo. Crash and restart, revert the commit, roll back the deploy. The physical world ships without that button. The banner above is a reminder of the scale we're moving into \u2014 one where every action lands somewhere real and stays there.</p>
<p>This single difference reshapes engineering. In code, a bug is a wrong state you can fix. In hardware, a bug is a cracked gearbox, a magnet smoke-tested past its Curie point, or a person hurt. There's no Ctrl-Z on a snapped tendon or a stripped output shaft.</p>
<div class="pull">Bits let you fail fast and fix later. Atoms make you fail slow, because every failure is permanent and physical.</div>
<p>So you design differently. You build in margins instead of assertions. You make systems degrade gracefully instead of crashing cleanly. You test the thing that can't be undone the hardest, because the cost of being wrong isn't a stack trace \u2014 it's a torn-down build, a burnt board, or worse.</p>
<p>It's also why the physical frontier has been left for last, and why I find it the most honest place to work. The world keeps score in atoms, and it never forgets.</p>
<p class="meta">Placeholder post \u2014 a deeper piece on designing without undo is coming.</p>` },
  { slug:"teleop-is-a-stepping-stone", title:"Teleoperation is a stepping stone, not a destination",
    dek:"Putting a human in the loop is how we bootstrap dexterous robots \u2014 but the goal is to make that human optional.",
    tags:["AI","teleop","manipulation"], topics:["AI","robots"], date:"2026 \u00b7 01", art:"blackhole",
    body:`
<p class="lede">Right now the most capable robot hands in the world have a human quietly attached to them. Teleoperation \u2014 a person driving the robot in real time \u2014 is how the hardest manipulation gets done today. It's brilliant, and it's temporary.</p>
<p>The banner above is the thing we're orbiting: real autonomy, dense and gravitational, pulling the whole field toward it. Teleop is how we get close enough to fall in. Every teleoperated grasp is also a demonstration \u2014 a labelled example of how a real body solved a real task \u2014 and that data is the fuel for the policies meant to replace the human driver.</p>
<div class="pull">Teleop isn't the product. It's the scaffolding you build the autonomy on, and then take down.</div>
<p>The risk is mistaking the scaffolding for the building. A robot that only works with a human in the loop hasn't solved manipulation; it has relocated the human. The real milestone is when the policy learned from all that teleoperation can hold the loop by itself \u2014 and the operator can walk away.</p>
<p>Underneath all of it, though, the same hardware problem remains. You can't teleoperate or autonomously control a hand that doesn't physically exist. The actuator comes first; the intelligence to drive it comes after.</p>
<p class="meta">Placeholder post \u2014 a fuller piece on teleop-to-autonomy is coming.</p>` },
  { slug:"backlash-eats-torque", title:"Backlash is where good torque goes to die",
    dek:"You can build a perfect motor and still ship a sloppy joint. The gearbox is where most of the feel quietly leaks away.",
    tags:["gearbox","mechanical","precision"], topics:["robots"], date:"2026 \u00b7 06", art:"gears",
    body:`
<p class="lede">A motor makes torque; a gearbox makes it useful. Almost every robot joint trades the motor's high speed for the joint's high torque through gears \u2014 and that trade is where a clean, intentional mechanism turns into a vague one.</p>
<p>The villain is backlash: the tiny dead zone where the input gear turns but the output doesn't, because the teeth haven't taken up contact yet. Reverse direction and you fall through that gap before anything happens. The banner above is two gears meshing; the magic and the menace both live right where their teeth touch.</p>
<div class="pull">A joint with backlash can be strong and still feel cheap. The hand notices the slop long before it notices the strength.</div>
<p>This is why gear choice is really a feel choice. Spur gears are simple and lossy. Planetary sets pack torque into a small volume but stack tolerances. Harmonic drives give near-zero backlash and beautiful precision \u2014 at a price that makes them a luxury good. Cycloidal drives sit in an interesting middle, shock-tolerant and stiff, which is why I keep circling back to them for the actuator.</p>
<p>The honest goal isn't zero backlash at any cost. It's choosing where to spend it: enough precision that the loop can feel the world through the gearbox, without paying harmonic-drive money for every joint.</p>
<p class="meta">Placeholder post \u2014 a fuller teardown with measured backlash numbers is coming.</p>` },
  { slug:"reading-a-motor-on-a-scope", title:"You can hear a control loop on an oscilloscope",
    dek:"Tuning an actuator is mostly listening. The current waveform tells you everything the maths is too polite to say.",
    tags:["control","FOC","debugging"], topics:["robots"], date:"2026 \u00b7 05", art:"scope",
    body:`
<p class="lede">When a control loop misbehaves, the equations rarely tell you why. The oscilloscope does. A few probes on the phase currents and you can watch the loop think \u2014 and watch it panic.</p>
<p>The banner above is the view I live in while tuning: a smooth sine that should stay smooth, and a switching waveform underneath it. A well-tuned current loop draws a clean, rounded sinusoid. Push the gains too high and the trace grows fur \u2014 fast oscillation riding on top, the loop fighting itself. Too low and it sags, lazy and late, lagging every command.</p>
<div class="pull">A datasheet tells you what a part should do. A scope tells you what your firmware actually did, at the microsecond it did it.</div>
<p>You learn to read it like a face. Ringing after a step means too much proportional gain. A slow creep to target means not enough integral. A periodic glitch locked to rotor position is almost always an encoder offset \u2014 the field pointing slightly off ninety degrees, bleeding torque into heat.</p>
<p>None of this is in the textbook derivation of FOC, and that's the point. The maths gets you to a loop that should work. The scope is where you find out which assumption was a lie.</p>
<p class="meta">Placeholder post \u2014 annotated captures from a real tuning session are on the way.</p>` },
  { slug:"driver-on-the-motor", title:"Put the driver on the motor",
    dek:"The cleanest cable is the one you never run. Integrating the power stage onto the actuator removes a whole class of problems.",
    tags:["pcb","integration","phase"], topics:["robots"], date:"2026 \u00b7 04", art:"circuit",
    body:`
<p class="lede">The traditional layout puts the motor in the joint and the driver in a box somewhere else, joined by a fat bundle of phase wires. Every robot I've taken apart pays a tax for that gap. The fix is almost rude in its simplicity: put the driver on the motor.</p>
<p>The banner above is a board doing its quiet work \u2014 pulses running down copper, pads switching, current finding its path. When that board lives millimetres from the windings instead of a cable run away, a lot of pain disappears at once.</p>
<div class="pull">Long phase wires are antennas, voltage drops and failure points pretending to be a connection. The best version of them is no version.</div>
<p>Integration buys you short, fat power paths with low inductance; an encoder that shares a rigid reference with the rotor instead of guessing across a coupling; and EMI that stays local instead of spraying down a cable into your sensitive analog. You trade it for a harder thermal problem \u2014 now the hot power stage shares a body with the hot motor \u2014 and for a denser, fussier board layout.</p>
<p>That trade is the whole bet behind Lunar Drive. Make the driver an integrated part of the actuator, not an accessory, and the rest of the robot gets simpler: power and a data bus in, controlled torque out.</p>
<p class="meta">Placeholder post \u2014 board photos and a layout walkthrough to follow.</p>` },
  { slug:"many-dumb-robots", title:"Many dumb robots beat one clever one",
    dek:"Robustness rarely comes from a smarter brain. More often it comes from many simple agents and the behaviour between them.",
    tags:["swarm","emergence","systems"], topics:["robots","meta"], date:"2026 \u00b7 03", art:"swarm",
    body:`
<p class="lede">The banner above is a swarm: a few dozen agents, each following the same three rules \u2014 don't crowd your neighbours, steer roughly where they steer, stay with the group. Nobody is in charge, and yet the flock holds together, splits around obstacles, and reforms.</p>
<p>I find this more instructive than most robotics demos. A single sophisticated robot is a single point of failure with excellent PR. Kill its planner, its one camera, its one leg, and the whole thing stops. A swarm degrades instead of dying \u2014 lose a few members and the behaviour barely flinches.</p>
<div class="pull">Centralised intelligence is impressive until something breaks. Distributed behaviour is unimpressive until everything else breaks and it keeps going.</div>
<p>The catch is that you don't program the flock; you program the bird and hope. Emergent systems are hard to specify and harder to guarantee \u2014 the behaviour you want has to fall out of local rules, and sometimes the behaviour you get is a surprise instead. That trade between robustness and predictability is the real design problem.</p>
<p>It's also a hint about where capable robots come from. Maybe not one mind in one body, but many cheap, capable bodies running simple loops \u2014 which is, not coincidentally, an argument for making the body cheap and capable.</p>
<p class="meta">Placeholder post \u2014 a deeper piece on decentralised control is coming.</p>` },
  { slug:"thermals-are-the-ceiling", title:"Heat is the real ceiling on torque",
    dek:"An actuator's peak torque is a marketing number. Its continuous torque is a thermal one \u2014 and thermal is the limit that actually bites.",
    tags:["thermals","actuators","limits"], topics:["robots"], date:"2026 \u00b7 02", art:"plasma",
    body:`
<p class="lede">Ask how much torque a motor makes and you'll get two answers. The big one is peak \u2014 what it does for a heroic second before something melts. The honest one is continuous \u2014 what it can hold forever without cooking. The gap between them is heat, and heat is the ceiling almost nobody quotes.</p>
<p>Torque costs current, and current dumps power into winding resistance as the square of itself. The banner above is that idea made visible \u2014 a field of energy with nowhere clean to go. Double the torque and you roughly quadruple the heat you have to shed. The motor doesn't fail because it ran out of magnetic force; it fails because the copper hit its temperature limit and the magnets started to give up.</p>
<div class="pull">Peak torque is what an actuator can promise. Continuous torque is what it can keep. Thermals decide which number you actually get to use.</div>
<p>This is why thermal design isn't a finishing touch \u2014 it's the spec. The path from winding to ambient, the potting compound, the contact to the housing, the housing to the world: every one of those is buying you continuous torque. A motor with a great heat path and a mediocre magnetic design will out-work a beautiful motor that can't shed its losses.</p>
<p>So when I think about the actuator, I think about it as a heat engine running backwards. The real question isn't how much torque it can make. It's how much it can make and survive.</p>
<p class="meta">Placeholder post \u2014 thermal captures and continuous-vs-peak curves to follow.</p>` },
  { slug:"field-oriented-control", title:"Field-oriented control is a very fast magnet trick",
    dek:"The algorithm that turns a brushless motor into a precise muscle, explained without drowning in the vector maths.",
    tags:["motors","FOC","control"], topics:["robots"], date:"2026 \u00b7 06", art:"motor",
    body:`
<p class="lede">A brushless motor is, mechanically, dumb. It is copper, iron and a few magnets. Everything that makes it feel like a precise, torque-controlled muscle happens in software, many thousands of times a second. That software is field-oriented control.</p>
<p>The core idea is almost embarrassingly simple once you see it. A motor makes torque when its magnetic field pushes on the rotor's magnets <strong>at right angles</strong>. Push along the rotor and you do nothing but waste current as heat. Push exactly 90 degrees ahead of it and every amp turns into torque. FOC is the trick of always pushing at that perfect angle, no matter how fast the rotor is spinning.</p>
<div class="pull">Stop thinking in terms of three fixed coils. Think in terms of one magnetic arrow you can point wherever you like \u2014 and you always point it 90 degrees ahead of the rotor.</div>
<p>To do that you need two things: to know exactly where the rotor is right now (that's the magnetic encoder), and to translate "point the field this way" back into the three real coil currents (that's the Clarke and Park transforms \u2014 really just rotating your frame of reference so the maths gets easy). Close that loop fast enough and the motor stops behaving like a motor and starts behaving like a torque source you can command directly.</p>
<p>That's the whole reason FOC matters for robotics. A joint you can command in torque, smoothly, with no cogging or lag, is a joint that can feel the world and react gently to it. The banner above is that rotating field made visible \u2014 the coloured glow sweeping around the stator is the commutation, the spinning core is the rotor chasing it.</p>
<p class="meta">This is a placeholder post \u2014 a fuller write-up with scope traces is coming.</p>` },
  { slug:"biology-is-engineering", title:"Biology is the engineering textbook we keep ignoring",
    dek:"Medicine and robotics keep handing each other answers. The body solved torque density, sensing and self-repair a long time ago.",
    tags:["biology","robotics","design"], topics:["biology","robots"], date:"2026 \u00b7 05", art:"helix",
    body:`
<p class="lede">Spend a day in anatomy and then a day at a workbench building a robot joint, and you start to feel slightly embarrassed. Almost every hard problem in actuator design has already been solved, beautifully, in tissue.</p>
<p>Muscle is an actuator with absurd power density that is also soft, backdrivable and self-repairing. Tendons route force around corners with near-zero backlash. Proprioception gives every joint a dense, distributed sense of its own position and load \u2014 the thing we bolt fragile encoders on to approximate. And the whole system rebuilds itself while running.</p>
<div class="pull">Evolution had a few billion years and no datasheet. It is worth reading its work before reinventing the joint.</div>
<p>I don't think the lesson is "copy biology" \u2014 wheels beat legs on smooth ground, and motors beat muscle for some jobs. The lesson is that biology is a catalogue of <strong>existence proofs</strong>. It tells you what is physically possible: how much force fits in this volume, how good sensing can get, how gracefully a system can degrade instead of failing hard.</p>
<p>That's also why I find medicine and robotics so hard to separate. Both are, in the end, about bodies \u2014 understanding them, repairing them, extending them. The double helix in the banner is the original design document.</p>
<p class="meta">Placeholder post \u2014 the long version, with specific muscle-vs-motor numbers, is in the works.</p>` },
  { slug:"emergence-simple-rules", title:"Simple rules, complex machines",
    dek:"A note on emergence \u2014 why the interesting behaviour of a robot almost never lives in any single line of its code.",
    tags:["systems","emergence","control"], topics:["meta","robots"], date:"2026 \u00b7 05", art:"life",
    body:`
<p class="lede">The banner above is Conway's Game of Life: four trivial rules about whether a cell lives or dies, and out of them come gliders, oscillators, structures that build other structures. Nobody programmed the glider. It just falls out.</p>
<p>I keep coming back to it because it's the cleanest demonstration of a thing that is true of every robot I've built: <strong>the interesting behaviour is rarely in any one line of code.</strong> It lives in the interaction \u2014 between control loops, between a body and its environment, between many simple agents following local rules.</p>
<div class="pull">Complexity you designed is fragile. Complexity that emerges from simple, local rules tends to be robust \u2014 because no single part is holding it all up.</div>
<p>A walking gait can emerge from springs and reflexes without a central planner dictating every footfall. A swarm can cover a space with no member knowing the whole map. Even a single actuator, closed in a tight feedback loop, produces behaviour \u2014 stiffness, compliance, the feel of a detent \u2014 that isn't written down anywhere as an instruction.</p>
<p>The design skill, then, isn't always specifying the behaviour you want. Often it's finding the simplest local rules whose interaction <em>happens</em> to be the behaviour you want \u2014 and being humble enough to let the system surprise you.</p>
<p class="meta">Placeholder post \u2014 a deeper piece on emergent control is coming.</p>` },
  { slug:"the-missing-actuator", title:"The missing $100 actuator",
    dek:"Every serious robotics company is quietly building its own motor. That's a tell. Here's the gap, and why I'm building the part nobody sells.",
    tags:["actuators","robotics","phase"], topics:["robots","meta"], date:"2026 \u00b7 06", seed:7,
    body:`
<p class="lede">If you want to build a robot today, the brain is solved and the body is not. You can rent a frontier model by the token. You cannot buy a good actuator off a shelf.</p>
<p>Try it. Go looking for a brushless, sensored, closed-loop rotary actuator \u2014 something with real torque density, an integrated driver, and a clean control interface \u2014 for under a hundred dollars. You won't find one. You'll find hobby gimbal motors with no gearbox, industrial servo modules that cost more than a used car, and a long tail of dev boards that each solve a quarter of the problem.</p>
<p>So what does everyone do? They build their own. <strong>Every serious robotics company is vertically integrating the actuator</strong> \u2014 not because they want to, but because there is no other option. Boston Dynamics, the humanoid startups, the quadruped labs, the teleop rigs: each one re-derives the same motor, the same driver, the same field-oriented control loop, the same encoder-mounting headache. That duplication is one of the loudest signals in hardware right now.</p>
<div class="pull">When the whole industry independently rebuilds the same component, the component is missing from the market \u2014 not from the bill of materials.</div>
<h2>Why it stays missing</h2>
<p>The actuator is hard precisely because it refuses to be one discipline. A good one is a motor, a gearbox, a power stage, a sensor and a real-time control problem fused into a single object the size of a yo-yo. Optimise the motor and you fight the thermals. Fix the thermals and you lose torque density. Add a gearbox and you import backlash. Close the loop and now firmware timing is your bottleneck. Each subsystem is a known problem; the integration is where the difficulty hides, and integration is exactly what a parts catalogue can't sell you.</p>
<p>The result is a market shaped like a barbell. Cheap and useless on one end, excellent and unaffordable on the other, and nothing in the fat middle where most robots actually live.</p>
<h2>Why I'm building one</h2>
<p>This is the thesis behind Phase. The actuator stack \u2014 motor, driver, gearbox, firmware \u2014 is the unsolved layer of robotics, and it's the layer that gates everything above it. I think of it the way compute looked before AWS: capable, but locked behind the willingness to build the whole thing yourself. The unlock isn't a better motor. It's a <strong>commoditised</strong> one: good enough to be boring, cheap enough to design around, and standard enough that the rest of the field stops paying the integration tax.</p>
<p>Lunar Drive is the driver. The next layers are the motor and the gearbox. The goal is unglamorous on purpose \u2014 make the part everyone is currently reinventing, so they can go spend their cleverness on the robot instead.</p>
<p>If the body is the bottleneck, the actuator is the bottleneck inside the bottleneck. That's the part worth building.</p>` },
  { slug:"robotics-revolution", title:"Robotics is the largest thing we will ever build",
    dek:"Software ate the world of bits. Robotics is what happens when intelligence finally gets hands \u2014 a bigger lever than anything before it.",
    tags:["robotics","thesis","longform"], topics:["meta","robots","AI"], date:"2026 \u00b7 05", seed:13,
    body:`
<p class="lede">Every revolution so far has moved information. Robotics is the first one that moves matter \u2014 and matter is where almost everything we care about actually lives.</p>
<p>The internet rearranged bits. It was world-changing and it was also, in a literal sense, weightless \u2014 it never lifted a beam, sutured a wound, planted a field or assembled a car. The economy it transformed sits on top of a physical one that has barely moved. Most human labour is still hands in the world: building, repairing, caring, growing, moving things from here to there.</p>
<p>Robotics is the moment intelligence reaches that layer. <strong>For the first time the cognitive overhang has a body to act through.</strong> We spent a decade making minds that can reason about the physical world; the next decade is about letting them touch it.</p>
<div class="pull">Software gave intelligence a voice. Robotics gives it hands. The second is the larger gift.</div>
<h2>Why the lever is bigger</h2>
<p>Think about what's gated on physical labour: housing, healthcare, manufacturing, agriculture, eldercare, infrastructure. These aren't niche markets \u2014 they're the floor of civilisation, and every one of them is constrained by the supply and cost of capable hands. A general-purpose physical worker doesn't optimise an industry. It re-prices the inputs to all of them at once.</p>
<p>The demographics make it non-optional. The rich world is ageing into a labour shortage it cannot hire its way out of. Either the work doesn't get done, or something does it. There isn't a third option that scales.</p>
<h2>Why it's also the hardest</h2>
<p>And this is the catch that keeps me honest: bits forgive, atoms don't. A bad inference is a wrong sentence; a bad actuator command is a broken gearbox or a hurt person. The physical world has no undo, runs in real time, and punishes every shortcut with friction, heat, wear and gravity. That's exactly why it's been left for last \u2014 and why the team that solves the body, not just the brain, ends up holding the largest lever anyone has ever built.</p>
<p>I'd rather work on the hard half.</p>` },
  { slug:"no-gimbal-motors", title:"Where are the robotics gimbal motors?",
    dek:"The whole field runs on motors designed to hold cameras steady. We're using drone parts to build robots, and the seams are starting to show.",
    tags:["motors","bldc","supply chain"], topics:["robots"], date:"2026 \u00b7 04", seed:21,
    body:`
<p class="lede">Open up almost any low-cost robot arm or quadruped and you'll find the same surprise: the motors were never designed for robotics. They were designed to keep a camera level.</p>
<p>Gimbal motors are everywhere in maker robotics for one reason \u2014 they're the only affordable, high-pole-count, smooth brushless motors that exist in volume. The drone industry needed them, scaled them, and drove the price down. So a generation of robot builders, myself included, reached for the part that was actually on the shelf.</p>
<p>But a gimbal motor is optimised for a job that is almost the opposite of a robot joint. <strong>A gimbal lives at near-zero speed, holding position against tiny disturbances, cooled by open airflow, with essentially no shock loading.</strong> A robot joint wants peak torque on demand, tolerance to impact, a sane way to bolt on a gearbox, and thermal headroom for a duty cycle that isn't "float gently in the breeze."</p>
<div class="pull">We didn't choose gimbal motors. We inherited them \u2014 because the part the field actually needs was never built.</div>
<h2>The seams</h2>
<ul>
  <li><strong>No mounting story.</strong> Gimbal motors expose a bare rotor and stator. Every builder invents their own way to attach an output, a gearbox and a bearing \u2014 and most of them are slightly wrong.</li>
  <li><strong>No integrated sensing.</strong> You're left bolting a magnetic encoder to the back and praying the magnet is concentric. Closed-loop control is only as good as that mechanical guess.</li>
  <li><strong>Thermals as an afterthought.</strong> Hold real torque in a stalled joint and a gimbal motor cooks. The datasheet never promised otherwise.</li>
  <li><strong>Wrong KV, wrong winding.</strong> Tuned for smooth slow rotation, not for the torque-at-low-speed profile a geared joint actually demands.</li>
</ul>
<h2>The opportunity hiding in the complaint</h2>
<p>Every one of those seams is a design spec. A motor built <em>for</em> a robotic joint \u2014 integrated encoder boss, defined output interface, thermal path, a winding chosen for geared torque \u2014 would make a whole category of problems disappear. That's not a moonshot; it's just nobody's product yet. The drone industry gave us a good-enough part and we've been grateful for it. Being grateful isn't the same as being well-served.</p>
<p>The next motor I care about isn't faster or cheaper than a gimbal motor. It's just honest about being a robot part.</p>` },
  { slug:"bldc-scaling-laws", title:"BLDC scaling laws, and why hands are so hard",
    dek:"Torque doesn't scale the way intuition says. The reason humanoid hands are brutal isn't software \u2014 it's the geometry of electric motors.",
    tags:["bldc","scaling","manipulation"], topics:["robots"], date:"2026 \u00b7 03", seed:31,
    body:`
<p class="lede">People assume the hard part of a robot hand is the control. It isn't \u2014 at least not first. The first wall you hit is physics: you cannot fit enough torque into a finger-sized motor, and the reason is geometry.</p>
<p>Here's the uncomfortable scaling fact. The torque a brushless motor can produce comes from force at the air gap acting over the rotor radius. Air-gap shear stress is roughly fixed by materials and cooling, so motor torque scales with the air-gap area times the radius \u2014 it grows with something close to the <strong>fourth power of the motor's linear size</strong>. Shrink a motor by half and you don't lose half the torque. You lose around fifteen-sixteenths of it.</p>
<div class="pull">Halve the diameter and torque doesn't halve \u2014 it collapses by roughly an order of magnitude. That's the tax on every small joint.</div>
<h2>Why this lands hardest on hands</h2>
<p>A humanoid hand needs many independent joints, each strong enough to grip and manipulate, packed into a volume the size of, well, a hand. Every one of those joints wants torque, and torque is exactly the quantity that punishes small size hardest. The leg of a robot can be big and the scaling works in your favour. A finger has nowhere to hide.</p>
<p>So you reach for a gearbox to trade speed for torque \u2014 and now you've imported the second tax:</p>
<ul>
  <li><strong>Backlash and friction</strong> that wreck the fine, low-force control manipulation actually needs.</li>
  <li><strong>Loss of backdrivability</strong>, so the hand can no longer feel what it's touching through the motor.</li>
  <li><strong>Volume and mass</strong> in precisely the place you have none to spare.</li>
</ul>
<h2>Locomotion is forgiving; manipulation is not</h2>
<p>This is why walking robots arrived before dexterous ones. Locomotion lives in the regime where motors are large, loads are gross, and the body is mostly fighting gravity in predictable ways. <strong>Manipulation lives in the regime where motors are small, forces are fine, and the scaling laws are actively hostile.</strong> The bottleneck in robotics is shifting from "can it move" to "can it handle" \u2014 and the handling problem is, at root, a small-actuator problem.</p>
<p>Which is the whole reason I keep coming back to the actuator. Crack high torque density in a sub-20mm package that stays backdrivable, and you don't improve hands incrementally \u2014 you move the wall. Everything above it in the stack has been waiting on that.</p>` },
];
