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
  { slug:"field-oriented-control", title:"Field-oriented control is a very fast magnet trick",
    dek:"The algorithm that turns a brushless motor into a precise muscle, explained without drowning in the vector maths.",
    tags:["motors","FOC","control"], date:"2026 \u00b7 06", art:"motor",
    body:`
<p class="lede">A brushless motor is, mechanically, dumb. It is copper, iron and a few magnets. Everything that makes it feel like a precise, torque-controlled muscle happens in software, many thousands of times a second. That software is field-oriented control.</p>
<p>The core idea is almost embarrassingly simple once you see it. A motor makes torque when its magnetic field pushes on the rotor's magnets <strong>at right angles</strong>. Push along the rotor and you do nothing but waste current as heat. Push exactly 90 degrees ahead of it and every amp turns into torque. FOC is the trick of always pushing at that perfect angle, no matter how fast the rotor is spinning.</p>
<div class="pull">Stop thinking in terms of three fixed coils. Think in terms of one magnetic arrow you can point wherever you like \u2014 and you always point it 90 degrees ahead of the rotor.</div>
<p>To do that you need two things: to know exactly where the rotor is right now (that's the magnetic encoder), and to translate "point the field this way" back into the three real coil currents (that's the Clarke and Park transforms \u2014 really just rotating your frame of reference so the maths gets easy). Close that loop fast enough and the motor stops behaving like a motor and starts behaving like a torque source you can command directly.</p>
<p>That's the whole reason FOC matters for robotics. A joint you can command in torque, smoothly, with no cogging or lag, is a joint that can feel the world and react gently to it. The banner above is that rotating field made visible \u2014 the coloured glow sweeping around the stator is the commutation, the spinning core is the rotor chasing it.</p>
<p class="meta">This is a placeholder post \u2014 a fuller write-up with scope traces is coming.</p>` },
  { slug:"biology-is-engineering", title:"Biology is the engineering textbook we keep ignoring",
    dek:"Medicine and robotics keep handing each other answers. The body solved torque density, sensing and self-repair a long time ago.",
    tags:["biology","robotics","design"], date:"2026 \u00b7 05", art:"helix",
    body:`
<p class="lede">Spend a day in anatomy and then a day at a workbench building a robot joint, and you start to feel slightly embarrassed. Almost every hard problem in actuator design has already been solved, beautifully, in tissue.</p>
<p>Muscle is an actuator with absurd power density that is also soft, backdrivable and self-repairing. Tendons route force around corners with near-zero backlash. Proprioception gives every joint a dense, distributed sense of its own position and load \u2014 the thing we bolt fragile encoders on to approximate. And the whole system rebuilds itself while running.</p>
<div class="pull">Evolution had a few billion years and no datasheet. It is worth reading its work before reinventing the joint.</div>
<p>I don't think the lesson is "copy biology" \u2014 wheels beat legs on smooth ground, and motors beat muscle for some jobs. The lesson is that biology is a catalogue of <strong>existence proofs</strong>. It tells you what is physically possible: how much force fits in this volume, how good sensing can get, how gracefully a system can degrade instead of failing hard.</p>
<p>That's also why I find medicine and robotics so hard to separate. Both are, in the end, about bodies \u2014 understanding them, repairing them, extending them. The double helix in the banner is the original design document.</p>
<p class="meta">Placeholder post \u2014 the long version, with specific muscle-vs-motor numbers, is in the works.</p>` },
  { slug:"emergence-simple-rules", title:"Simple rules, complex machines",
    dek:"A note on emergence \u2014 why the interesting behaviour of a robot almost never lives in any single line of its code.",
    tags:["systems","emergence","control"], date:"2026 \u00b7 05", art:"life",
    body:`
<p class="lede">The banner above is Conway's Game of Life: four trivial rules about whether a cell lives or dies, and out of them come gliders, oscillators, structures that build other structures. Nobody programmed the glider. It just falls out.</p>
<p>I keep coming back to it because it's the cleanest demonstration of a thing that is true of every robot I've built: <strong>the interesting behaviour is rarely in any one line of code.</strong> It lives in the interaction \u2014 between control loops, between a body and its environment, between many simple agents following local rules.</p>
<div class="pull">Complexity you designed is fragile. Complexity that emerges from simple, local rules tends to be robust \u2014 because no single part is holding it all up.</div>
<p>A walking gait can emerge from springs and reflexes without a central planner dictating every footfall. A swarm can cover a space with no member knowing the whole map. Even a single actuator, closed in a tight feedback loop, produces behaviour \u2014 stiffness, compliance, the feel of a detent \u2014 that isn't written down anywhere as an instruction.</p>
<p>The design skill, then, isn't always specifying the behaviour you want. Often it's finding the simplest local rules whose interaction <em>happens</em> to be the behaviour you want \u2014 and being humble enough to let the system surprise you.</p>
<p class="meta">Placeholder post \u2014 a deeper piece on emergent control is coming.</p>` },
  { slug:"the-missing-actuator", title:"The missing $100 actuator",
    dek:"Every serious robotics company is quietly building its own motor. That's a tell. Here's the gap, and why I'm building the part nobody sells.",
    tags:["actuators","robotics","phase"], date:"2026 \u00b7 06", seed:7,
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
    tags:["robotics","thesis","longform"], date:"2026 \u00b7 05", seed:13,
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
    tags:["motors","bldc","supply chain"], date:"2026 \u00b7 04", seed:21,
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
    tags:["bldc","scaling","manipulation"], date:"2026 \u00b7 03", seed:31,
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
