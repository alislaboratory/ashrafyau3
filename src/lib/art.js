import { setupCanvas, lerpC, spectrum, specArr } from './utils.js';

export function drawHalftone(canvas, seed){
  const {ctx,W,H}=setupCanvas(canvas); ctx.fillStyle="#0b0b0d"; ctx.fillRect(0,0,W,H);
  const step=Math.max(6,Math.round(H/24));
  const r1=(Math.sin(seed*1.7)*0.5+0.5), r2=(Math.cos(seed*0.9)*0.5+0.5);
  const fx1=W*(0.30+0.4*r1), fy1=H*(0.42+0.3*r2), fx2=W*(0.72-0.3*r2), fy2=H*(0.55-0.2*r1);
  const k1=0.020+0.012*r1, k2=0.024+0.014*r2, hueShift=(seed*0.137)%1;
  for(let y=step/2;y<H;y+=step){ for(let x=step/2;x<W;x+=step){
    const d1=Math.hypot(x-fx1,y-fy1), d2=Math.hypot(x-fx2,y-fy2);
    let v=0.5+0.34*Math.sin(d1*k1+seed)+0.30*Math.sin(d2*k2-seed*0.5)+0.16*Math.sin((x+y)*0.011*(1+r1));
    const edge=1-Math.min(1,Math.hypot((x-W/2)/(W*0.64),(y-H/2)/(H*0.66)));
    v=v*0.62+edge*0.5; v=Math.max(0,Math.min(1,v));
    const rad=v*v*(step*0.5); if(rad<0.45) continue;
    const hue=((x/W)*0.6+(y/H)*0.25+v*0.3+hueShift)%1;
    ctx.globalAlpha=0.35+0.65*v; ctx.fillStyle=spectrum(hue);
    ctx.beginPath(); ctx.arc(x,y,rad,0,Math.PI*2); ctx.fill();
  }}
  ctx.globalAlpha=1; const grd=ctx.createLinearGradient(0,0,0,H);
  grd.addColorStop(0,"rgba(255,255,255,0.05)"); grd.addColorStop(1,"rgba(0,0,0,0.30)"); ctx.fillStyle=grd; ctx.fillRect(0,0,W,H);
}
/* animated halftone banner */
export function createBanner(canvas, seed){
  let ctx,W,H,step,last=0,t0=performance.now();
  const r1=(Math.sin(seed*1.7)*0.5+0.5), r2=(Math.cos(seed*0.9)*0.5+0.5), hueShift=(seed*0.137)%1;
  function resize(){ const s=setupCanvas(canvas); ctx=s.ctx;W=s.W;H=s.H; step=Math.max(7,Math.round(H/22)); }
  function frame(now){ if(now-last<50)return; last=now; const t=(now-t0)/1000;
    ctx.fillStyle="#0b0b0d"; ctx.fillRect(0,0,W,H);
    const fx1=W*(0.30+0.4*r1)+Math.sin(t*0.5)*W*0.06, fy1=H*(0.42+0.3*r2)+Math.cos(t*0.4)*H*0.14;
    const fx2=W*(0.72-0.3*r2)+Math.cos(t*0.45)*W*0.06, fy2=H*(0.55-0.2*r1)+Math.sin(t*0.5)*H*0.14;
    const k1=0.020+0.012*r1, k2=0.024+0.014*r2;
    for(let y=step/2;y<H;y+=step){ for(let x=step/2;x<W;x+=step){
      const d1=Math.hypot(x-fx1,y-fy1), d2=Math.hypot(x-fx2,y-fy2);
      let v=0.5+0.34*Math.sin(d1*k1+seed+t*0.6)+0.30*Math.sin(d2*k2-seed*0.5-t*0.4)+0.16*Math.sin((x+y)*0.011*(1+r1));
      const edge=1-Math.min(1,Math.hypot((x-W/2)/(W*0.64),(y-H/2)/(H*0.66)));
      v=v*0.62+edge*0.5; v=Math.max(0,Math.min(1,v));
      const rad=v*v*(step*0.5); if(rad<0.5) continue;
      const hue=((x/W)*0.6+(y/H)*0.25+v*0.3+hueShift+t*0.03)%1;
      ctx.globalAlpha=0.35+0.65*v; ctx.fillStyle=spectrum(hue);
      ctx.beginPath(); ctx.arc(x,y,rad,0,Math.PI*2); ctx.fill();
    }}
    ctx.globalAlpha=1;
  }
  return {static:false, resize, frame};
}
/* animated pixel-art placeholder (project art) */
export function createPixelArt(canvas, seed){
  let dctx,loW,loH,img,data,t=0,last=0;
  function resize(){ const r=canvas.getBoundingClientRect(); const sc=5; loW=Math.max(20,Math.round(r.width/sc)); loH=Math.max(14,Math.round(r.height/sc));
    canvas.width=loW; canvas.height=loH; canvas.style.imageRendering='pixelated'; dctx=canvas.getContext('2d'); img=dctx.createImageData(loW,loH); data=img.data; }
  function frame(now){ if(now-last<60)return; last=now; t+=0.055;
    for(let y=0;y<loH;y++){ for(let x=0;x<loW;x++){ const nx=x/loW, ny=y/loH;
      let v=0.5+0.5*Math.sin((nx*6+seed)+t)*Math.cos(ny*5-t*0.7)+0.4*Math.sin((nx+ny)*6+t*1.2+seed);
      const ang=Math.atan2(ny-0.5,nx-0.5), rr=Math.hypot(nx-0.5,ny-0.5);
      const rotor=0.5+0.5*Math.sin(ang*4 - t*2 + rr*9);
      v=v*0.6+rotor*0.5; v=Math.max(0,Math.min(1,v));
      const c=specArr((v*0.7+seed*0.11)%1); const b=0.22+0.78*v;
      const o=(y*loW+x)*4; data[o]=c[0]*b; data[o+1]=c[1]*b; data[o+2]=c[2]*b; data[o+3]=255;
    }}
    dctx.putImageData(img,0,0);
  }
  return {static:false, resize, frame};
}
/* spinning BLDC motor with rotating commutation field */
export function createMotorArt(canvas){
  let dctx,loW,loH,img,data,t=0,last=0,cx,cy,R;
  function resize(){ const r=canvas.getBoundingClientRect(); const sc=4; loW=Math.max(40,Math.round(r.width/sc)); loH=Math.max(20,Math.round(r.height/sc));
    canvas.width=loW; canvas.height=loH; canvas.style.imageRendering='pixelated'; dctx=canvas.getContext('2d'); img=dctx.createImageData(loW,loH); data=img.data; cx=loW/2; cy=loH/2; R=Math.min(loW,loH)*0.46; }
  function frame(now){ if(now-last<45)return; last=now; t+=0.05;
    const rotor=t*1.1, field=t*2.6, P=2, teeth=12;
    const Rsh=R*0.16, Rro=R*0.52, Rsi=R*0.62, Rso=R*1.0;
    for(let y=0;y<loH;y++){ for(let x=0;x<loW;x++){ const dx=x-cx, dy=y-cy, r=Math.hypot(dx,dy), th=Math.atan2(dy,dx); let R8=6,G=8,B=15;
      if(r<Rso){
        if(r<Rsh){ const s=0.55+0.45*Math.sin(th*3+rotor); R8=110*s+30;G=112*s+30;B=125*s+34; }
        else if(r<Rro){ const pole=Math.cos(P*(th-rotor)); const sh=0.45+0.55*Math.abs(pole);
          if(pole>0){ R8=210*sh;G=54*sh;B=48*sh; } else { R8=56*sh;G=92*sh;B=220*sh; } }
        else if(r<Rsi){ R8=9;G=12;B=20; }
        else { const tooth=Math.cos(teeth*th); const isT=tooth>-0.1; let steel=isT?0.5:0.16;
          const glow=Math.max(0,Math.cos(th-field));
          const seg=((((th+Math.PI)/(2*Math.PI/3))|0)%3+3)%3;
          const pc= seg===0?[255,80,70]: seg===1?[90,220,120]:[90,150,255];
          let Rr=48+steel*110+glow*pc[0]*0.6, Gg=52+steel*110+glow*pc[1]*0.6, Bb=64+steel*120+glow*pc[2]*0.6;
          if(!isT){ Rr*=0.4;Gg*=0.4;Bb*=0.4; } R8=Rr;G=Gg;B=Bb; }
      }
      const o=(y*loW+x)*4; data[o]=Math.min(255,R8); data[o+1]=Math.min(255,G); data[o+2]=Math.min(255,B); data[o+3]=255;
    }}
    dctx.putImageData(img,0,0);
  }
  return {static:false, resize, frame};
}
/* rotating DNA double helix */
export function createHelixArt(canvas){
  let dctx,loW,loH,img,data,t=0,last=0;
  function resize(){ const r=canvas.getBoundingClientRect(); const sc=4; loW=Math.max(40,Math.round(r.width/sc)); loH=Math.max(20,Math.round(r.height/sc));
    canvas.width=loW; canvas.height=loH; canvas.style.imageRendering='pixelated'; dctx=canvas.getContext('2d'); img=dctx.createImageData(loW,loH); data=img.data; }
  function set(x,y,r,g,b){ if(x<0||x>=loW||y<0||y>=loH)return; const o=((y|0)*loW+(x|0))*4; if(data[o]+data[o+1]+data[o+2] < r+g+b){ data[o]=r;data[o+1]=g;data[o+2]=b;data[o+3]=255; } }
  function frame(now){ if(now-last<45)return; last=now; t+=0.05;
    for(let i=0;i<data.length;i+=4){ data[i]=5;data[i+1]=7;data[i+2]=16;data[i+3]=255; }
    const midY=loH/2, amp=loH*0.34, k=0.26;
    for(let x=0;x<loW;x++){ const a=k*x+t; const y1=midY+amp*Math.sin(a), y2=midY+amp*Math.sin(a+Math.PI); const front=Math.cos(a);
      if(x%3===0){ const top=Math.min(y1,y2)|0, bot=Math.max(y1,y2)|0; const rb=0.3+0.7*Math.abs(Math.sin(a)); const c=specArr((x/loW+t*0.04)%1);
        for(let yy=top;yy<=bot;yy++) set(x,yy, c[0]*rb*0.5|0, (c[1]*rb*0.5+40)|0, c[2]*rb*0.5|0); }
      const b1=front>0?1:0.4, b2=front<0?1:0.4;
      set(x,y1,90*b1,(210*b1)|0,(255*b1)|0); set(x,y1+1,70*b1|0,(170*b1)|0,(220*b1)|0);
      set(x,y2,(255*b2)|0,(110*b2)|0,(200*b2)|0); set(x,y2+1,(220*b2)|0,(90*b2)|0,(170*b2)|0);
    }
    dctx.putImageData(img,0,0);
  }
  return {static:false, resize, frame};
}
/* Conway's Game of Life */
export function createLifeArt(canvas){
  let dctx,loW,loH,img,data,grid,age,last=0,stepInt=120;
  function seed(){ for(let i=0;i<grid.length;i++){ grid[i]=Math.random()<0.30?1:0; age[i]=0; } }
  function resize(){ const r=canvas.getBoundingClientRect(); const sc=5; loW=Math.max(30,Math.round(r.width/sc)); loH=Math.max(14,Math.round(r.height/sc));
    canvas.width=loW; canvas.height=loH; canvas.style.imageRendering='pixelated'; dctx=canvas.getContext('2d'); img=dctx.createImageData(loW,loH); data=img.data;
    grid=new Uint8Array(loW*loH); age=new Uint16Array(loW*loH); seed(); }
  function step(){ const nxt=new Uint8Array(loW*loH); let alive=0;
    for(let y=0;y<loH;y++){ for(let x=0;x<loW;x++){ let n=0;
      for(let dy=-1;dy<=1;dy++) for(let dx=-1;dx<=1;dx++){ if(!dx&&!dy)continue; const xx=(x+dx+loW)%loW, yy=(y+dy+loH)%loH; n+=grid[yy*loW+xx]; }
      const i=y*loW+x, a=grid[i]; const live=a?(n===2||n===3):(n===3); nxt[i]=live?1:0; if(live){ alive++; age[i]=a?Math.min(999,age[i]+1):1; } else age[i]=0;
    }}
    grid=nxt; if(alive<loW*loH*0.03) seed();
  }
  function frame(now){ if(now-last<stepInt)return; last=now; step();
    for(let i=0;i<grid.length;i++){ const o=i*4; if(grid[i]){ const aa=Math.min(1,age[i]/14); const c=lerpC([150,255,228],[78,128,255],aa); data[o]=c[0];data[o+1]=c[1];data[o+2]=c[2]; } else { data[o]=4;data[o+1]=6;data[o+2]=12; } data[o+3]=255; }
    dctx.putImageData(img,0,0);
  }
  return {static:false, resize, frame};
}

export function createAquarium(canvas){
  let ctx,W,H,last=0,t0=performance.now(); let fish=[],bubbles=[],weed=[],jellies=[],crab=null,treats=[];
  let shark=null, sharkCooldown=14+Math.random()*20;
  const COL=["#6fe0ff","#ffd15a","#ff7ad0","#b08bff","#5fe6c0","#ffa24c"];
  const SHARK_LINES=[
    "          |\\",
    "      ____| \\_____",
    "  ___/    o        \\___",
    " /                     \\_",
    " \\________________ ____ __>",
    "        \\__/\\__/",
  ];
  const SHARK_W=Math.max(...SHARK_LINES.map(l=>l.length));
  const MIRROR={"/":"\\","\\":"/","<":">",">":"<","(":")",")":"(","[":"]","]":"[","{":"}","}":"{"};
  function mirror(str){ const pad=str.padEnd(SHARK_W," "); let out=""; for(let i=pad.length-1;i>=0;i--){ const c=pad[i]; out+=MIRROR[c]||c; } return out; }
  function spawnShark(){
    const dir=Math.random()<0.5?1:-1;
    shark={ dir, spd:0.14+Math.random()*0.05, ate:false, target:null,
      x: dir>0 ? -SHARK_W*9 : W+SHARK_W*9, y: 80+Math.random()*(H-180) };
  }
  function drawShark(){
    if(!shark) return;
    const fs=14, lh=13, cw=fs*0.6;
    ctx.font=`${fs}px "JetBrains Mono", monospace`; ctx.textBaseline="middle";
    ctx.fillStyle="#aebfca"; ctx.shadowColor="#46606f"; ctx.shadowBlur=10;
    const y0=shark.y-((SHARK_LINES.length-1)/2)*lh;
    for(let i=0;i<SHARK_LINES.length;i++){
      const str=shark.dir>0?SHARK_LINES[i]:mirror(SHARK_LINES[i]);
      ctx.fillText(str, shark.x, y0+i*lh);
    }
    // eye glint
    ctx.shadowBlur=0; ctx.fillStyle="#ff5a5a";
    const ex=shark.x+(shark.dir>0?10*cw:(SHARK_W-10)*cw), ey=y0+2*lh;
    ctx.fillRect(ex-1, ey-1, 2.4, 2.4);
  }
  function sharkMouth(){ const cw=14*0.6; return { x: shark.x+(shark.dir>0?(SHARK_W-1)*cw:cw), y: shark.y }; }
  function mkFish(){ const bd=Math.random()<0.5?1:-1; return {
    x:Math.random()*W, y:70+Math.random()*(H-150), h:bd>0?0:Math.PI, bd,
    spd:0.040+Math.random()*0.022, sz:15+Math.random()*13, col:COL[(Math.random()*COL.length)|0],
    ph:Math.random()*6, flap:5+Math.random()*4 }; }
  function init(){
    fish=[]; const n=Math.max(4,Math.round(W/190)); for(let i=0;i<n;i++) fish.push(mkFish());
    bubbles=[]; const nb=Math.round(W/46); for(let i=0;i<nb;i++) bubbles.push({x:Math.random()*W,y:Math.random()*H,r:5+Math.random()*7,sp:0.02+Math.random()*0.05});
    weed=[]; const cols=Math.max(3,Math.round(W/100)); for(let i=0;i<cols;i++) weed.push({x:30+i*100+Math.random()*40, h:4+(Math.random()*5|0), ph:Math.random()*6});
    jellies=[]; const nj=Math.max(2,Math.round(W/440)); for(let i=0;i<nj;i++) jellies.push({x:Math.random()*W, y:Math.random()*H, sp:0.012+Math.random()*0.02, ph:Math.random()*6, col:Math.random()<0.5?"#d68bff":"#ff9ad6"});
    crab={ x:W*0.5, dir:1 }; treats=[];
  }
  function resize(){ const s=setupCanvas(canvas); ctx=s.ctx;W=s.W;H=s.H; init(); }
  function angDiff(a,b){ let d=a-b; while(d>Math.PI)d-=2*Math.PI; while(d<-Math.PI)d+=2*Math.PI; return d; }
  function frame(now){
    const dt=Math.min(40, now-last)||16; last=now; const t=(now-t0)/1000;
    ctx.fillStyle="#000000"; ctx.fillRect(0,0,W,H);
    // ASCII surface waves (top)
    ctx.textBaseline="middle"; ctx.font='13px "JetBrains Mono", monospace'; ctx.fillStyle="rgba(120,200,240,0.55)";
    for(let x=0;x<W;x+=10){ const w1=Math.sin(x*0.06+t*1.6); const c=w1>0.4?"~":(w1<-0.4?".":"-"); ctx.fillText(c, x, 14+w1*3); }
    ctx.fillStyle="rgba(90,170,210,0.30)"; for(let x=6;x<W;x+=10){ const w2=Math.sin(x*0.05-t*1.1); ctx.fillText(w2>0?"~":"-", x, 28+w2*3); }
    // ocean floor (sand bed)
    const floorY=H-9;
    ctx.fillStyle="#251f12"; ctx.fillRect(0,floorY,W,H-floorY);
    ctx.textBaseline="middle"; ctx.font='12px "JetBrains Mono", monospace';
    for(let x=0;x<W;x+=9){
      const dune=Math.sin(x*0.045)*2.6+Math.sin(x*0.11+1)*1.4;
      const m=(x*7)%17;
      const ch=m<2?":":(m<3?"\u00b0":(m<5?"_":"."));
      ctx.fillStyle = m<3 ? "#9c875c" : "#6f5f3e";
      ctx.fillText(ch, x, floorY+dune+2);
    }
    // seaweed
    ctx.textBaseline="alphabetic"; ctx.font='16px "JetBrains Mono", monospace'; ctx.fillStyle="#3aa86f";
    for(const s of weed){ for(let k=0;k<s.h;k++){ const sway=Math.sin(t*1.2+s.ph+k*0.5)*6; ctx.fillText(k%2?")":"(", s.x+sway, H-8-k*14); } }
    // castle
    ctx.fillStyle="#2a6a7e"; ctx.font='15px "JetBrains Mono", monospace';
    const bx=W-118, by=H-12;
    ctx.fillText("|^|   |^|", bx, by-40); ctx.fillText("|_________|", bx-3, by-27);
    ctx.fillText("| [] /\\ [] |", bx-3, by-14); ctx.fillText("|__________|", bx-3, by-1);
    // jellyfish
    for(const j of jellies){ j.y-=j.sp*dt; if(j.y<-34){ j.y=H+34; j.x=Math.random()*W; } const sway=Math.sin(t*1.5+j.ph)*4;
      ctx.save(); ctx.globalAlpha=0.85; ctx.shadowColor=j.col; ctx.shadowBlur=10; ctx.fillStyle=j.col; ctx.font='15px "JetBrains Mono", monospace'; ctx.textBaseline="middle";
      ctx.fillText(".-.", j.x-9+sway*0.4, j.y-8); ctx.fillText("(   )", j.x-13+sway*0.4, j.y);
      ctx.globalAlpha=0.6; for(let k=0;k<4;k++){ ctx.fillText("|", j.x-9+k*6+Math.sin(t*3+k+j.ph)*3, j.y+10+(k%2?2:0)); }
      ctx.restore(); }
    // crab
    if(crab){ crab.x+=crab.dir*0.03*dt; if(crab.x>W-70){crab.dir=-1;} if(crab.x<20){crab.dir=1;}
      const legs=Math.sin(t*8)>0?"/\\":"\\/"; ctx.fillStyle="#ff7a3c"; ctx.font='15px "JetBrains Mono", monospace'; ctx.textBaseline="alphabetic";
      ctx.fillText(legs+"(\u00b0,\u00b0)"+legs, crab.x, H-12); }
    // bubbles
    ctx.textBaseline="middle"; ctx.font='12px "JetBrains Mono", monospace';
    for(const b of bubbles){ b.y-=b.sp*dt; b.x+=Math.sin((t+b.r)*1.5)*0.25; if(b.y<-12){ b.y=H+12; b.x=Math.random()*W; } ctx.fillStyle="rgba(150,225,255,0.5)"; ctx.fillText(b.r>10?"O":"o", b.x, b.y); }
    // food pellets (easter egg: click to feed)
    ctx.font='13px "JetBrains Mono", monospace';
    for(let ti=treats.length-1; ti>=0; ti--){ const tr=treats[ti]; tr.y+=tr.vy*dt; tr.life-=0.0006*dt; if(tr.y>H-12||tr.life<=0){ treats.splice(ti,1); continue; }
      ctx.globalAlpha=Math.max(0,Math.min(1,tr.life)); ctx.fillStyle="#ffcf5a"; ctx.fillText("\u00b7", tr.x, tr.y); }
    ctx.globalAlpha=1;
    // shark: rare predator that hunts and eats a fish
    if(!shark){
      sharkCooldown-=dt/1000;
      if(sharkCooldown<=0 && fish.length>0 && Math.random()<0.012) spawnShark();
    } else {
      const mouth=sharkMouth();
      if(!shark.ate){
        let best=null,bd=1e9;
        for(const f of fish){ const dx=f.x-mouth.x; if(shark.dir>0 ? dx<-30 : dx>30) continue;
          const d=Math.hypot(f.x-shark.x,f.y-shark.y); if(d<bd){bd=d;best=f;} }
        shark.target=best;
      }
      const ty=shark.target?shark.target.y:shark.y;
      shark.y+=Math.max(-0.05*dt,Math.min(0.05*dt,(ty-shark.y)*0.03*dt/16));
      shark.y=Math.max(70,Math.min(H-70,shark.y));
      shark.x+=shark.dir*shark.spd*dt;
      if(!shark.ate && shark.target){
        const f=shark.target;
        if(Math.hypot(f.x-mouth.x,f.y-mouth.y)<28){
          const idx=fish.indexOf(f);
          if(idx>=0){ fish.splice(idx,1);
            for(let b=0;b<12;b++) bubbles.push({x:f.x,y:f.y,r:5+Math.random()*6,sp:0.04+Math.random()*0.06});
          }
          shark.ate=true; shark.target=null;
        }
      }
      if((shark.dir>0 && shark.x>W+SHARK_W*10) || (shark.dir<0 && shark.x<-SHARK_W*10)){
        shark=null; sharkCooldown=16+Math.random()*24;
        while(fish.length<Math.max(4,Math.round(W/190))) fish.push(mkFish());
      }
    }
    // fish: steer toward food (or flee the shark), swim by heading + tail flap
    ctx.textBaseline="middle";
    for(const f of fish){
      let tgt=null,bd2=240*240; for(const tr of treats){ const dx=tr.x-f.x, dy=tr.y-f.y, dd=dx*dx+dy*dy; if(dd<bd2){bd2=dd;tgt=tr;} }
      let flee=false;
      if(shark){ const dx=f.x-shark.x, dy=f.y-shark.y; if(dx*dx+dy*dy<200*200){ flee=true; } }
      let desired, spd;
      if(flee){ desired=Math.atan2(f.y-shark.y, f.x-shark.x); spd=0.16; }
      else if(tgt){ desired=Math.atan2(tgt.y-f.y, tgt.x-f.x); spd=0.085; }
      else { desired=(f.bd>0?0:Math.PI)+Math.sin(t*0.6+f.ph)*0.22;
        if(f.y<74) desired=(f.bd>0?0.5:Math.PI-0.5); else if(f.y>H-58) desired=(f.bd>0?-0.5:Math.PI+0.5);
        spd=f.spd; }
      const turn=(flee?0.012:0.0042)*dt, dh=angDiff(desired,f.h); f.h+=Math.max(-turn,Math.min(turn,dh));
      f.x+=Math.cos(f.h)*spd*dt; f.y+=Math.sin(f.h)*spd*dt;
      if(f.x<-60){ f.x=W+60; f.y=70+Math.random()*(H-150); } if(f.x>W+60){ f.x=-60; f.y=70+Math.random()*(H-150); }
      if(f.y<52){ f.y=52; f.h=-f.h; } if(f.y>H-26){ f.y=H-26; f.h=-f.h; }
      if(tgt && Math.hypot(tgt.x-f.x,tgt.y-f.y)<14){ tgt.life=0; bubbles.push({x:tgt.x,y:tgt.y-4,r:6,sp:0.06}); }
      const face=Math.cos(f.h)>=0?1:-1, flapOn=Math.sin(t*f.flap+f.ph)>0;
      const s = face>0 ? ((flapOn?"<":"{")+"(((>") : ("<)))"+(flapOn?">":"}"));
      const wig=Math.sin(t*f.flap+f.ph)*1.6;
      ctx.font=`${f.sz}px "JetBrains Mono", monospace`; ctx.fillStyle=f.col; ctx.shadowColor=f.col; ctx.shadowBlur=8;
      ctx.fillText(s, f.x-f.sz*0.5, f.y+wig);
    }
    ctx.shadowBlur=0;
    drawShark();
  }
  function feed(x,y){ for(let i=0;i<6;i++) treats.push({x:x+(Math.random()-0.5)*26, y:Math.max(34,y+(Math.random()-0.5)*10), vy:0.014+Math.random()*0.018, life:1}); }
  function summonShark(){ if(!shark && W) spawnShark(); }
  return {static:false, resize, frame, feed, summonShark};
}

/* ===================== THERMAL BLUE/RED ASCII ===================== */
export function createThermal(canvas){
  const CHARS="ABCDEFGHKMNRSXZ0123456789#%$&@=+*<>/\\|".split("");
  let ctx,W,H,fs,cw,ch,cols,rows,glyph,last=0,t0=performance.now();
  function resize(){ const s=setupCanvas(canvas); ctx=s.ctx;W=s.W;H=s.H;
    fs=Math.max(9,Math.min(13,Math.round(H/16))); ctx.font=`bold ${fs}px "JetBrains Mono", monospace`; ctx.textBaseline="top";
    cw=fs*0.62; ch=fs*1.05; cols=Math.ceil(W/cw); rows=Math.ceil(H/ch);
    glyph=new Array(cols*rows); for(let i=0;i<glyph.length;i++) glyph[i]=CHARS[(Math.random()*CHARS.length)|0]; }
  function frame(now){
    if(now-last<42) return; last=now; const t=(now-t0)/1000;
    ctx.fillStyle="#05060f"; ctx.fillRect(0,0,W,H);
    const srcs=[ {x:0.5+0.28*Math.cos(t*0.6), y:0.5+0.30*Math.sin(t*0.5), s:0.9},
                 {x:0.5+0.34*Math.cos(t*0.4+2), y:0.5+0.22*Math.sin(t*0.7+1), s:0.7},
                 {x:0.5+0.20*Math.cos(t*0.9+4), y:0.5+0.26*Math.sin(t*0.3+3), s:0.6} ];
    for(let gy=0;gy<rows;gy++){ for(let gx=0;gx<cols;gx++){
      const nx=(gx+0.5)/cols, ny=(gy+0.5)/rows; let heat=0;
      for(const s of srcs){ const dx=(nx-s.x)*1.6, dy=ny-s.y; heat+=s.s/(dx*dx+dy*dy+0.02); }
      heat=Math.min(1.4,heat*0.05);
      const idx=gy*cols+gx; if(Math.random()<0.06) glyph[idx]=CHARS[(Math.random()*CHARS.length)|0];
      let col,alpha;
      if(heat<0.45){ const b=heat/0.45; col=[30+b*40,70+b*70,200+b*55]; alpha=0.42+0.42*b; }
      else { const h=Math.min(1,(heat-0.45)/0.95); col = h<0.5 ? lerpC([255,60,40],[255,170,40],h/0.5) : lerpC([255,170,40],[255,250,210],(h-0.5)/0.5); alpha=0.88+0.12*h; }
      ctx.globalAlpha=Math.min(1,alpha); ctx.fillStyle=`rgb(${col[0]|0},${col[1]|0},${col[2]|0})`;
      ctx.fillText(glyph[idx], gx*cw, gy*ch);
    }}
    ctx.globalAlpha=1;
  }
  return {static:false, resize, frame};
}

/* ===================== ASCII BLACK HOLE (lensed disk, large) ===================== */
export function createBlackHoleAscii(canvas){
  const RAMP=" .:-=+*oxX#%@"; let ctx,W,H,fs,cw,ch,cols,rows,aspect,t=0,last=0,stars=[];
  function colTemp(v){ let c;
    if(v>0.84) c=lerpC([255,214,128],[255,252,238],(v-0.84)/0.16);
    else if(v>0.56) c=lerpC([255,128,46],[255,214,128],(v-0.56)/0.28);
    else if(v>0.30) c=lerpC([206,46,32],[255,128,46],(v-0.30)/0.26);
    else c=lerpC([120,72,200],[206,46,32], v/0.30);
    return c;
  }
  function resize(){ const s=setupCanvas(canvas); ctx=s.ctx;W=s.W;H=s.H; aspect=W/H;
    fs=Math.max(5,Math.min(8,Math.round(H/44))); ctx.font=`${fs}px "JetBrains Mono", ui-monospace, monospace`; ctx.textBaseline="top";
    cw=fs*0.6; ch=fs*1.05; cols=Math.floor(W/cw); rows=Math.floor(H/ch);
    stars=[]; const ns=Math.round(cols*rows*0.05);
    for(let i=0;i<ns;i++) stars.push({gx:(Math.random()*cols)|0, gy:(Math.random()*rows)|0, b:0.3+Math.random()*0.6, ph:Math.random()*6, blue:Math.random()<0.5});
  }
  function frame(now){
    if(now-last<33) return; last=now; t+=0.034;
    ctx.fillStyle="#05050a"; ctx.fillRect(0,0,W,H);
    const Rh=0.20, Rin=0.24, Rout=1.25, flat=0.42; const ccx=(cols-1)/2, ccy=(rows-1)/2;
    // faint star field
    for(const s of stars){ const b=s.b*(0.5+0.5*Math.sin(t*2+s.ph)); ctx.globalAlpha=0.25+0.5*b;
      ctx.fillStyle=s.blue?"#9fb6ff":"#e6ecff"; ctx.fillText(".", s.gx*cw, s.gy*ch); }
    ctx.globalAlpha=1;
    for(let gy=0;gy<rows;gy++){ for(let gx=0;gx<cols;gx++){
      const nx=((gx-ccx)*cw)/(H*0.5), ny=((gy-ccy)*ch)/(H*0.5);
      const rs=Math.hypot(nx,ny), d=Math.hypot(nx, ny/flat), az=Math.atan2(ny/flat, nx);
      let v=0;
      if(d>Rin && d<Rout){ const tr=(d-Rin)/(Rout-Rin); let br=Math.pow(1-tr,1.1);
        br*=(0.45+0.55*Math.sin(az*3 - t*3.0 + d*13)); br=Math.max(0,br);
        const beam=1+0.95*Math.cos(az); br*=Math.max(0.22,beam*0.72); v=Math.min(1.3,br*1.5); }
      const rg=Math.exp(-Math.pow((rs-Rh)/(Rh*0.17),2));
      if(rg>0.05 && !(ny<-0.02 && rs<Rh*0.7)) v=Math.max(v, 0.62+0.5*rg);
      if(rs<Rh && !(ny<0 && v>0.06)) continue;       // event horizon
      if(v<0.12) continue;
      const c=colTemp(Math.min(1,v)); ctx.globalAlpha=Math.min(1,0.4+0.6*v);
      ctx.fillStyle=`rgb(${c[0]|0},${c[1]|0},${c[2]|0})`;
      ctx.fillText(RAMP[Math.min(RAMP.length-1,(v*RAMP.length)|0)], gx*cw, gy*ch);
    }}
    ctx.globalAlpha=1;
  }
  return {static:false, resize, frame};
}

/* ===================== 1-BIT ISOMETRIC DIORAMA (static footer) ===================== */
export function drawMountains(canvas){
  const {ctx,W,H}=setupCanvas(canvas); ctx.fillStyle="#000000"; ctx.fillRect(0,0,W,H);
  const B8=[[0,32,8,40,2,34,10,42],[48,16,56,24,50,18,58,26],[12,44,4,36,14,46,6,38],[60,28,52,20,62,30,54,22],
            [3,35,11,43,1,33,9,41],[51,19,59,27,49,17,57,25],[15,47,7,39,13,45,5,37],[63,31,55,23,61,29,53,21]];
  const gcx=W*0.50, gcy=H*0.70, gw=W*0.46, gh=H*0.30;
  function inDiamond(x,y){ return Math.abs((x-gcx)/gw)+Math.abs((y-gcy)/gh) <= 1; }
  const peaks=[ {x:0.30,base:0.56,w:0.085,h:0.40}, {x:0.42,base:0.55,w:0.06,h:0.26}, {x:0.62,base:0.58,w:0.11,h:0.50}, {x:0.73,base:0.56,w:0.07,h:0.30} ];
  function peakBright(x,y){ let best=0;
    for(const p of peaks){ const px=p.x*W, apex=(p.base-p.h)*H, baseY=p.base*H, half=p.w*W;
      if(y>=apex&&y<=baseY){ const t=(y-apex)/(baseY-apex); const hw=half*t; if(Math.abs(x-px)<=hw){ const side=(x-px)/(hw+1); let b=0.95-0.5*Math.max(0,side); b*=(0.55+0.45*(1-t)); best=Math.max(best,b); } } }
    return best; }
  const trees=[ {cx:0.52,baseY:0.62,s:0.26}, {cx:0.38,baseY:0.74,s:0.10}, {cx:0.64,baseY:0.78,s:0.12}, {cx:0.46,baseY:0.82,s:0.08}, {cx:0.58,baseY:0.68,s:0.09} ];
  function pineBright(x,y,cx,baseY,s){ const px=cx*W, by=baseY*H, top=by-s*H, hw=s*H*0.42;
    if(x<px-hw-2||x>px+hw+2||y<top||y>by+2) return 0; let best=0;
    const tiers=[[0.0,0.52,0.55],[0.34,0.74,0.78],[0.55,1.0,1.0]];
    for(const tr of tiers){ const ta=top+(by-top)*tr[0], tb=top+(by-top)*tr[1], thw=hw*tr[2];
      if(y>=ta&&y<=tb){ const t=(y-ta)/(tb-ta+1e-6); const w=thw*t; if(Math.abs(x-px)<=w){ const side=(x-px)/(w+1); best=Math.max(best,0.82-0.42*Math.max(0,side)); } } }
    if(Math.abs(x-px)<2 && y>by-s*H*0.12 && y<=by) best=Math.max(best,0.4); return best; }
  function treesBright(x,y){ let b=0; for(const tr of trees) b=Math.max(b,pineBright(x,y,tr.cx,tr.baseY,tr.s)); return b; }
  function planeBright(x,y){ const ly=(y-(gcy-gh))/(2*gh); let b=0.30-0.10*ly;
    const mx=gcx+gw*0.32, my=gcy-gh*0.05; const dm=Math.hypot((x-mx)/(gw*0.55),(y-my)/(gh*0.55)); b+=0.62*Math.max(0,1-dm);
    const lx=gcx-gw*0.34, lyc=gcy+gh*0.40; const dl=Math.hypot((x-lx)/(gw*0.34),(y-lyc)/(gh*0.24));
    if(dl<1){ b=0.07; const sp=Math.exp(-Math.pow((y-(lyc-2))/2.6,2)); b+=0.95*sp*(0.5+0.5*Math.sin(x*0.32)); }
    return Math.max(0,Math.min(1,b)); }
  const step=4;
  for(let y=0;y<H;y+=step){ for(let x=0;x<W;x+=step){
    const th=(B8[(y/step|0)%8][(x/step|0)%8]+0.5)/64;
    const pk=peakBright(x,y), tr=treesBright(x,y); let b=Math.max(pk,tr);
    if(b>0.001){ if(b>th){ const g=180+Math.round(b*70); ctx.fillStyle=`rgb(${g},${g},${g+4})`; ctx.fillRect(x,y,1.7,1.7); } continue; }
    if(inDiamond(x,y)){ b=planeBright(x,y); if(b>th){ const g=150+Math.round(b*95); ctx.fillStyle=`rgb(${g-4},${g},${g+6})`; ctx.fillRect(x,y,1.6,1.6); } }
    else { const horizon=gcy-gh; const near=Math.max(0,1-Math.abs(y-horizon)/(H*0.5)); const hsh=((x*73856093)^(y*19349663))>>>0; const p=2+near*5;
      if((hsh%1000)<p){ const s=(hsh>>10)%3; ctx.fillStyle=s===0?"rgba(180,200,255,0.9)":"rgba(230,230,240,0.85)"; ctx.fillRect(x,y,1.4,1.4); } }
  }}
  ctx.globalCompositeOperation='lighter';
  const g=ctx.createLinearGradient(0,gcy-gh,0,gcy-gh+H*0.18); g.addColorStop(0,'rgba(124,92,255,0.10)'); g.addColorStop(1,'rgba(124,92,255,0)');
  ctx.fillStyle=g; ctx.fillRect(0,gcy-gh,W,H*0.18); ctx.globalCompositeOperation='source-over';
}