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
  let dctx,loW,loH,img,data,t=0,last=0,mX=0.5,mY=0.5,mOn=false,cX=0.5,cY=0.5;
  function resize(){ const r=canvas.getBoundingClientRect(); const sc=5; loW=Math.max(20,Math.round(r.width/sc)); loH=Math.max(14,Math.round(r.height/sc));
    canvas.width=loW; canvas.height=loH; canvas.style.imageRendering='pixelated'; dctx=canvas.getContext('2d'); img=dctx.createImageData(loW,loH); data=img.data; }
  function frame(now){ if(now-last<60)return; last=now; t+=0.055;
    cX+=((mOn?mX:0.5)-cX)*0.15; cY+=((mOn?mY:0.5)-cY)*0.15;
    for(let y=0;y<loH;y++){ for(let x=0;x<loW;x++){ const nx=x/loW, ny=y/loH;
      let v=0.5+0.5*Math.sin((nx*6+seed)+t)*Math.cos(ny*5-t*0.7)+0.4*Math.sin((nx+ny)*6+t*1.2+seed);
      const ang=Math.atan2(ny-cY,nx-cX), rr=Math.hypot(nx-cX,ny-cY);
      const rotor=0.5+0.5*Math.sin(ang*4 - t*2 + rr*9);
      v=v*0.6+rotor*0.5; v=Math.max(0,Math.min(1,v));
      const c=specArr((v*0.7+seed*0.11)%1); const b=0.22+0.78*v;
      const o=(y*loW+x)*4; data[o]=c[0]*b; data[o+1]=c[1]*b; data[o+2]=c[2]*b; data[o+3]=255;
    }}
    dctx.putImageData(img,0,0);
  }
  return {static:false, resize, frame, pointer(x,y,a){mX=x;mY=y;mOn=a;}};
}
/* spinning BLDC motor with rotating commutation field */
export function createMotorArt(canvas){
  let dctx,loW,loH,img,data,t=0,last=0,cx,cy,R,mX=0.5,mOn=false,spd=1;
  function resize(){ const r=canvas.getBoundingClientRect(); const sc=4; loW=Math.max(40,Math.round(r.width/sc)); loH=Math.max(20,Math.round(r.height/sc));
    canvas.width=loW; canvas.height=loH; canvas.style.imageRendering='pixelated'; dctx=canvas.getContext('2d'); img=dctx.createImageData(loW,loH); data=img.data; cx=loW/2; cy=loH/2; R=Math.min(loW,loH)*0.46; }
  function frame(now){ if(now-last<45)return; last=now;
    const target=mOn?(mX-0.5)*5:1; spd+=(target-spd)*0.08; t+=0.05*spd;
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
  return {static:false, resize, frame, pointer(x,y,a){mX=x;mOn=a;}};
}
/* rotating DNA double helix */
export function createHelixArt(canvas){
  let dctx,loW,loH,img,data,t=0,last=0,mX=0.5,mY=0.5,mOn=false,spd=1,kk=0.26;
  function resize(){ const r=canvas.getBoundingClientRect(); const sc=4; loW=Math.max(40,Math.round(r.width/sc)); loH=Math.max(20,Math.round(r.height/sc));
    canvas.width=loW; canvas.height=loH; canvas.style.imageRendering='pixelated'; dctx=canvas.getContext('2d'); img=dctx.createImageData(loW,loH); data=img.data; }
  function set(x,y,r,g,b){ if(x<0||x>=loW||y<0||y>=loH)return; const o=((y|0)*loW+(x|0))*4; if(data[o]+data[o+1]+data[o+2] < r+g+b){ data[o]=r;data[o+1]=g;data[o+2]=b;data[o+3]=255; } }
  function frame(now){ if(now-last<45)return; last=now;
    const tsp=mOn?(0.4+mX*2.4):1; spd+=(tsp-spd)*0.08; t+=0.05*spd;
    kk+=(((mOn?(0.12+mY*0.5):0.26))-kk)*0.08;
    for(let i=0;i<data.length;i+=4){ data[i]=5;data[i+1]=7;data[i+2]=16;data[i+3]=255; }
    const midY=loH/2, amp=loH*0.34, k=kk;
    for(let x=0;x<loW;x++){ const a=k*x+t; const y1=midY+amp*Math.sin(a), y2=midY+amp*Math.sin(a+Math.PI); const front=Math.cos(a);
      if(x%3===0){ const top=Math.min(y1,y2)|0, bot=Math.max(y1,y2)|0; const rb=0.3+0.7*Math.abs(Math.sin(a)); const c=specArr((x/loW+t*0.04)%1);
        for(let yy=top;yy<=bot;yy++) set(x,yy, c[0]*rb*0.5|0, (c[1]*rb*0.5+40)|0, c[2]*rb*0.5|0); }
      const b1=front>0?1:0.4, b2=front<0?1:0.4;
      set(x,y1,90*b1,(210*b1)|0,(255*b1)|0); set(x,y1+1,70*b1|0,(170*b1)|0,(220*b1)|0);
      set(x,y2,(255*b2)|0,(110*b2)|0,(200*b2)|0); set(x,y2+1,(220*b2)|0,(90*b2)|0,(170*b2)|0);
    }
    dctx.putImageData(img,0,0);
  }
  return {static:false, resize, frame, pointer(x,y,a){mX=x;mY=y;mOn=a;}};
}
/* Conway's Game of Life */
export function createLifeArt(canvas){
  let dctx,loW,loH,img,data,grid,age,last=0,stepInt=120,mX=0.5,mY=0.5,mOn=false;
  function seed(){ for(let i=0;i<grid.length;i++){ grid[i]=Math.random()<0.30?1:0; age[i]=0; } }
  function paint(nx,ny,rad){ if(!grid)return; const gx=nx*loW|0, gy=ny*loH|0;
    for(let dy=-rad;dy<=rad;dy++) for(let dx=-rad;dx<=rad;dx++){ if(Math.random()<0.5)continue; const xx=(gx+dx+loW)%loW, yy=(gy+dy+loH)%loH; grid[yy*loW+xx]=1; } }
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
  function frame(now){ if(now-last<stepInt)return; last=now; if(mOn) paint(mX,mY,2); step();
    for(let i=0;i<grid.length;i++){ const o=i*4; if(grid[i]){ const aa=Math.min(1,age[i]/14); const c=lerpC([150,255,228],[78,128,255],aa); data[o]=c[0];data[o+1]=c[1];data[o+2]=c[2]; } else { data[o]=4;data[o+1]=6;data[o+2]=12; } data[o+3]=255; }
    dctx.putImageData(img,0,0);
  }
  return {static:false, resize, frame, pointer(x,y,a){mX=x;mY=y;mOn=a;}, pointerDown(x,y){ paint(x,y,3); } };
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
  let ctx,W,H,fs,cw,ch,cols,rows,glyph,last=0,t0=performance.now(),mX=0.5,mY=0.5,mOn=false;
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
    if(mOn) srcs.push({x:mX, y:mY, s:1.6});
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
  return {static:false, resize, frame, pointer(x,y,a){mX=x;mY=y;mOn=a;}};
}

/* ===================== ASCII BLACK HOLE (lensed disk, large) ===================== */
export function createBlackHoleAscii(canvas){
  const RAMP=" .:-=+*oxX#%@"; let ctx,W,H,fs,cw,ch,cols,rows,aspect,t=0,last=0,stars=[],mX=0.5,mY=0.5,mOn=false,oX=0.5,oY=0.5;
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
    const Rh=0.20, Rin=0.24, Rout=1.25, flat=0.42;
    oX+=((mOn?mX:0.5)-oX)*0.1; oY+=((mOn?mY:0.5)-oY)*0.1;
    const ccx=oX*(cols-1), ccy=oY*(rows-1);
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
  return {static:false, resize, frame, pointer(x,y,a){mX=x;mY=y;mOn=a;}};
}

/* ===================== meshing gear train ===================== */
export function createGearsArt(canvas){
  let dctx,loW,loH,img,data,t=0,last=0,mX=0.5,mOn=false,spd=1;
  function resize(){ const r=canvas.getBoundingClientRect(); const sc=4; loW=Math.max(40,Math.round(r.width/sc)); loH=Math.max(20,Math.round(r.height/sc));
    canvas.width=loW; canvas.height=loH; canvas.style.imageRendering='pixelated'; dctx=canvas.getContext('2d'); img=dctx.createImageData(loW,loH); data=img.data; }
  function frame(now){ if(now-last<45)return; last=now;
    const tsp=mOn?(mX-0.5)*5:1; spd+=(tsp-spd)*0.08; t+=0.04*spd;
    const R=loH*0.36, N=10;
    const gears=[ {cx:loW*0.32, cy:loH*0.5, dir:1, phase:0, tint:0.62},
                  {cx:loW*0.32+R*2.0, cy:loH*0.5, dir:-1, phase:Math.PI/N, tint:0.40} ];
    for(let y=0;y<loH;y++){ for(let x=0;x<loW;x++){
      let rr=6,gg=8,bb=16;
      for(const g of gears){ const dx=x-g.cx, dy=y-g.cy, r=Math.hypot(dx,dy), th=Math.atan2(dy,dx);
        const phi=g.dir*t*1.5 + g.phase;
        const tooth=Math.cos(N*(th-phi));
        const rOut=R*(tooth>0?1.0:0.86);
        if(r<rOut && r>R*0.2){
          const light=0.45+0.55*Math.cos(th+2.2);
          const ridge=0.55+0.45*Math.sin(N*(th-phi));
          const base=0.3+0.55*light*ridge;
          const c=specArr(g.tint);
          rr=Math.max(rr, 36+base*c[0]*0.5+base*70);
          gg=Math.max(gg, 40+base*c[1]*0.5+base*70);
          bb=Math.max(bb, 56+base*c[2]*0.5+base*70);
        }
        if(r<R*0.2 && r>R*0.06){ const sp=Math.cos(3*(th-phi)); const b=0.35+0.45*Math.abs(sp); rr=Math.max(rr,70*b);gg=Math.max(gg,80*b);bb=Math.max(bb,104*b); }
      }
      const o=(y*loW+x)*4; data[o]=Math.min(255,rr); data[o+1]=Math.min(255,gg); data[o+2]=Math.min(255,bb); data[o+3]=255;
    }}
    dctx.putImageData(img,0,0);
  }
  return {static:false, resize, frame, pointer(x,y,a){mX=x;mOn=a;}};
}
/* ===================== scrolling oscilloscope ===================== */
export function createScopeArt(canvas){
  let dctx,loW,loH,img,data,t=0,last=0,col=0,mX=0.5,mY=0.5,mOn=false,fq=1,am=1;
  function resize(){ const r=canvas.getBoundingClientRect(); const sc=4; loW=Math.max(40,Math.round(r.width/sc)); loH=Math.max(20,Math.round(r.height/sc));
    canvas.width=loW; canvas.height=loH; canvas.style.imageRendering='pixelated'; dctx=canvas.getContext('2d'); img=dctx.createImageData(loW,loH); data=img.data;
    for(let i=0;i<data.length;i+=4){ data[i]=4;data[i+1]=8;data[i+2]=14;data[i+3]=255; } col=0; }
  function frame(now){ if(now-last<33)return; last=now; t+=0.13;
    fq+=((mOn?(0.4+mX*2.4):1)-fq)*0.08; am+=((mOn?(1.4-mY):1)-am)*0.08;
    for(let i=0;i<data.length;i+=4){ data[i]*=0.86; data[i+1]*=0.9; data[i+2]*=0.88; }
    for(let y=0;y<loH;y++){ for(let x=0;x<loW;x++){ if(x%8===0||y%6===0){ const o=(y*loW+x)*4; data[o]=Math.max(data[o],9);data[o+1]=Math.max(data[o+1],24);data[o+2]=Math.max(data[o+2],32);} } }
    const x=col;
    const v1=(Math.sin(x*0.22*fq+t)*0.6 + Math.sin(x*0.07*fq-t*0.7)*0.28)*am;
    const sq=(Math.sin(x*0.16*fq-t*1.3)>0?1:-1)*0.46*am;
    function plot(val,c){ const y=((0.5-val*0.42)*loH)|0; for(let yy=y-1;yy<=y+1;yy++){ if(yy<0||yy>=loH)continue; const o=(yy*loW+x)*4; const b=yy===y?1:0.5; data[o]=Math.min(255,c[0]*b+data[o]); data[o+1]=Math.min(255,c[1]*b+data[o+1]); data[o+2]=Math.min(255,c[2]*b+data[o+2]); } }
    plot(v1,[110,255,178]); plot(sq,[140,156,255]);
    for(let y=0;y<loH;y++){ const o=(y*loW+((col+1)%loW))*4; data[o]=Math.max(data[o],10);data[o+1]=Math.max(data[o+1],44);data[o+2]=Math.max(data[o+2],32); }
    col=(col+1)%loW;
    dctx.putImageData(img,0,0);
  }
  return {static:false, resize, frame, pointer(x,y,a){mX=x;mY=y;mOn=a;}};
}
/* ===================== PCB traces with travelling pulses ===================== */
export function createCircuitArt(canvas){
  let dctx,loW,loH,img,data,t=0,last=0,pulses=[],mX=0.5,mY=0.5,mOn=false; const gap=8;
  function mkPulse(){ const horiz=Math.random()<0.5; const lanes=horiz?Math.max(1,Math.floor((loH-1)/gap)):Math.max(1,Math.floor((loW-1)/gap));
    return { horiz, lane:(Math.random()*lanes)|0, pos:Math.random(), spd:0.004+Math.random()*0.012, dir:Math.random()<0.5?1:-1, c:specArr(Math.random()) }; }
  function resize(){ const r=canvas.getBoundingClientRect(); const sc=4; loW=Math.max(40,Math.round(r.width/sc)); loH=Math.max(20,Math.round(r.height/sc));
    canvas.width=loW; canvas.height=loH; canvas.style.imageRendering='pixelated'; dctx=canvas.getContext('2d'); img=dctx.createImageData(loW,loH); data=img.data;
    pulses=[]; const n=Math.max(8,Math.min(40,Math.round(loW/7))); for(let i=0;i<n;i++) pulses.push(mkPulse()); }
  function px(x,y,r,g,b){ if(x<0||x>=loW||y<0||y>=loH)return; const o=((y|0)*loW+(x|0))*4; data[o]=Math.min(255,data[o]+r); data[o+1]=Math.min(255,data[o+1]+g); data[o+2]=Math.min(255,data[o+2]+b); }
  function frame(now){ if(now-last<40)return; last=now; t+=0.05;
    for(let i=0;i<data.length;i+=4){ data[i]=4;data[i+1]=10;data[i+2]=9;data[i+3]=255; }
    for(let y=gap;y<loH;y+=gap) for(let x=0;x<loW;x++) px(x,y,6,26,22);
    for(let x=gap;x<loW;x+=gap) for(let y=0;y<loH;y++) px(x,y,6,26,22);
    for(let y=gap;y<loH;y+=gap) for(let x=gap;x<loW;x+=gap){ const b=0.5+0.5*Math.sin(t*2+x*0.3+y*0.2); px(x,y,10+15*b,40+30*b,34+26*b); }
    for(const p of pulses){ p.pos+=p.spd*p.dir; if(p.pos>1||p.pos<0){ Object.assign(p, mkPulse()); continue; }
      let x,y; if(p.horiz){ y=gap*(p.lane+1); x=p.pos*loW; } else { x=gap*(p.lane+1); y=p.pos*loH; }
      const c=p.c; px(x,y,c[0],c[1],c[2]);
      for(let k=1;k<=4;k++){ const f=(1-k/5)*0.6; if(p.horiz) px(x-p.dir*k,y,c[0]*f,c[1]*f,c[2]*f); else px(x,y-p.dir*k,c[0]*f,c[1]*f,c[2]*f); }
    }
    if(mOn){ const gx=Math.round(mX*loW/gap)*gap, gy=Math.round(mY*loH/gap)*gap;
      for(let dy=-2;dy<=2;dy++) for(let dx=-2;dx<=2;dx++){ const d=Math.hypot(dx,dy); if(d>2.4)continue; const b=(1-d/2.4)*200; px(gx+dx,gy+dy,b*0.6,b,b*0.9); } }
    dctx.putImageData(img,0,0);
  }
  return {static:false, resize, frame, pointer(x,y,a){mX=x;mY=y;mOn=a;},
    pointerDown(){ for(let i=0;i<8;i++) pulses.push(mkPulse()); } };
}
/* ===================== flocking swarm (boids) ===================== */
export function createSwarmArt(canvas){
  let dctx,loW,loH,img,data,last=0,t=0,boids=[],mX=0.5,mY=0.5,mOn=false,repel=false;
  function resize(){ const r=canvas.getBoundingClientRect(); const sc=4; loW=Math.max(40,Math.round(r.width/sc)); loH=Math.max(20,Math.round(r.height/sc));
    canvas.width=loW; canvas.height=loH; canvas.style.imageRendering='pixelated'; dctx=canvas.getContext('2d'); img=dctx.createImageData(loW,loH); data=img.data;
    boids=[]; const n=Math.min(75,Math.max(20,Math.round(loW*loH/120))); for(let i=0;i<n;i++) boids.push({x:Math.random()*loW,y:Math.random()*loH,vx:(Math.random()-0.5),vy:(Math.random()-0.5)}); }
  function frame(now){ if(now-last<33)return; last=now; t+=0.02;
    for(let i=0;i<data.length;i+=4){ data[i]*=0.78; data[i+1]*=0.8; data[i+2]*=0.82; if(data[i]<4){data[i]=4;} if(data[i+1]<6){data[i+1]=6;} if(data[i+2]<10){data[i+2]=10;} data[i+3]=255; }
    const cx=mOn?mX*loW:loW/2+Math.cos(t)*loW*0.25, cy=mOn?mY*loH:loH/2+Math.sin(t*1.3)*loH*0.25;
    const pull=(mOn?0.006:0.0008)*(repel?-1.6:1);
    for(const b of boids){
      let ax=0,ay=0,cnt=0,sx=0,sy=0,avx=0,avy=0;
      for(const o of boids){ if(o===b)continue; const dx=o.x-b.x, dy=o.y-b.y, d2=dx*dx+dy*dy; if(d2<64&&d2>0){ cnt++; sx+=o.x;sy+=o.y; avx+=o.vx;avy+=o.vy; if(d2<9){ ax-=dx/d2; ay-=dy/d2; } } }
      if(cnt){ ax+=((sx/cnt)-b.x)*0.002+((avx/cnt)-b.vx)*0.04; ay+=((sy/cnt)-b.y)*0.002+((avy/cnt)-b.vy)*0.04; }
      ax+=(cx-b.x)*pull; ay+=(cy-b.y)*pull;
      b.vx+=ax; b.vy+=ay; const sp=Math.hypot(b.vx,b.vy), mx=0.9; if(sp>mx){ b.vx=b.vx/sp*mx; b.vy=b.vy/sp*mx; }
      b.x+=b.vx; b.y+=b.vy; if(b.x<0)b.x+=loW; if(b.x>=loW)b.x-=loW; if(b.y<0)b.y+=loH; if(b.y>=loH)b.y-=loH;
      const sp2=Math.min(1,Math.hypot(b.vx,b.vy)/mx), c=specArr((0.3+sp2*0.5)%1);
      const o=((b.y|0)*loW+(b.x|0))*4; data[o]=Math.min(255,c[0]+data[o]);data[o+1]=Math.min(255,c[1]+data[o+1]);data[o+2]=Math.min(255,c[2]+data[o+2]);
    }
    dctx.putImageData(img,0,0);
  }
  return {static:false, resize, frame,
    pointer(x,y,a){mX=x;mY=y;mOn=a; if(!a)repel=false;},
    pointerDown(){ repel=true; setTimeout(()=>{repel=false;},450); } };
}
/* ===================== demoscene plasma ===================== */
export function createPlasmaArt(canvas){
  let dctx,loW,loH,img,data,t=0,last=0,mX=0.5,mY=0.5,mOn=false,cXn=0.5,cYn=0.5;
  function resize(){ const r=canvas.getBoundingClientRect(); const sc=4; loW=Math.max(40,Math.round(r.width/sc)); loH=Math.max(20,Math.round(r.height/sc));
    canvas.width=loW; canvas.height=loH; canvas.style.imageRendering='pixelated'; dctx=canvas.getContext('2d'); img=dctx.createImageData(loW,loH); data=img.data; }
  function frame(now){ if(now-last<40)return; last=now; t+=0.05;
    cXn+=((mOn?mX:0.5)-cXn)*0.12; cYn+=((mOn?mY:0.5)-cYn)*0.12;
    const cx=cXn*loW, cy=cYn*loH;
    for(let y=0;y<loH;y++){ for(let x=0;x<loW;x++){
      const v=Math.sin(x*0.12+t)+Math.sin(y*0.14-t*0.8)+Math.sin((x+y)*0.09+t*0.6)+Math.sin(Math.hypot(x-cx,y-cy)*0.14-t*1.2);
      const n=(v+4)/8;
      const c=specArr((n+t*0.02)%1), b=0.4+0.6*n;
      const o=(y*loW+x)*4; data[o]=c[0]*b;data[o+1]=c[1]*b;data[o+2]=c[2]*b;data[o+3]=255;
    }}
    dctx.putImageData(img,0,0);
  }
  return {static:false, resize, frame, pointer(x,y,a){mX=x;mY=y;mOn=a;}};
}

/* ===================== ASCII digital rain ===================== */
export function createMatrixArt(canvas){
  const GLY="01{}[]<>/\\|=+*#%xROBTICSAI".split("");
  let ctx,W,H,fs,cw,cols,drops,last=0,mX=0.5,mOn=false;
  function resize(){ const s=setupCanvas(canvas); ctx=s.ctx;W=s.W;H=s.H;
    fs=Math.max(10,Math.min(16,Math.round(H/8))); cw=fs*0.62; cols=Math.ceil(W/cw)+1;
    drops=[]; for(let i=0;i<cols;i++) drops.push({ y:Math.random()*(H/fs), sp:0.35+Math.random()*0.85, len:5+(Math.random()*16|0) }); }
  function frame(now){ if(now-last<55)return; last=now;
    ctx.fillStyle="rgba(5,7,14,0.30)"; ctx.fillRect(0,0,W,H);
    ctx.font=`${fs}px "JetBrains Mono", monospace`; ctx.textBaseline="top"; ctx.textAlign="left";
    const mc=mX*cols;
    for(let i=0;i<cols;i++){ const d=drops[i]; const boost=mOn?Math.max(0,1-Math.abs(i-mc)/6):0;
      d.y+=d.sp+boost*1.6; const head=Math.floor(d.y);
      for(let k=0;k<d.len;k++){ const row=head-k; if(row<0) continue; const py=row*fs; if(py>H) continue;
        const g=GLY[(Math.random()*GLY.length)|0];
        if(k===0){ ctx.fillStyle="#eafff3"; ctx.shadowColor=boost>0.2?"#bafff0":"#7df0ff"; ctx.shadowBlur=8+boost*10; }
        else { const f=1-k/d.len; ctx.shadowBlur=0; ctx.fillStyle=`rgba(${70+80*f+boost*80|0},${(150+90*f)|0},235,${0.16+0.7*f+boost*0.2})`; }
        ctx.fillText(g, i*cw, py);
      }
      ctx.shadowBlur=0;
      if((head-d.len)*fs > H){ d.y=0; d.sp=0.35+Math.random()*0.85; d.len=5+(Math.random()*16|0); }
    }
  }
  return {static:false, resize, frame, pointer(x,y,a){mX=x;mOn=a;}};
}
/* ===================== ASCII neural network ===================== */
export function createNeuralArt(canvas){
  let ctx,W,H,fs,last=0,t0=performance.now(),layers=[],mX=0.5,mY=0.5,mOn=false;
  function resize(){ const s=setupCanvas(canvas); ctx=s.ctx;W=s.W;H=s.H;
    fs=Math.max(9,Math.round(H/13)); const counts=[3,5,5,3]; layers=[]; const L=counts.length;
    for(let li=0;li<L;li++){ const n=counts[li]; const nodes=[]; const x=W*(0.12+0.76*(li/(L-1)));
      for(let i=0;i<n;i++) nodes.push({x, y:H*((i+1)/(n+1)), ph:Math.random()*6}); layers.push(nodes); } }
  function frame(now){ if(now-last<45)return; last=now; const t=(now-t0)/1000;
    const mx=mX*W, my=mY*H, rr=W*0.16;
    ctx.fillStyle="#05060e"; ctx.fillRect(0,0,W,H);
    ctx.textBaseline="middle"; ctx.textAlign="center"; ctx.font=`${fs}px "JetBrains Mono", monospace`;
    for(let li=0;li<layers.length-1;li++){ const a=layers[li], b=layers[li+1];
      for(const na of a){ for(const nb of b){ const steps=Math.max(6,Math.round(Math.hypot(nb.x-na.x,nb.y-na.y)/14));
        for(let s=1;s<steps;s++){ const u=s/steps, x=na.x+(nb.x-na.x)*u, y=na.y+(nb.y-na.y)*u;
          const near=mOn?Math.max(0,1-Math.hypot(x-mx,y-my)/rr):0;
          const on=Math.sin((u*6 - t*3 + li))>0.86 || near>0.6;
          ctx.fillStyle=on?`rgba(150,230,255,${0.9})`:`rgba(95,115,205,${0.11+near*0.5})`; ctx.fillText(on?"+":"\u00b7", x, y); } } } }
    for(let li=0;li<layers.length;li++){ for(const nd of layers[li]){ let act=0.5+0.5*Math.sin(t*2 - li*0.9 + nd.ph);
      if(mOn) act=Math.min(1, act + Math.max(0,1-Math.hypot(nd.x-mx,nd.y-my)/rr));
      const c=specArr((0.5+li*0.12)%1); ctx.shadowColor=`rgb(${c[0]|0},${c[1]|0},${c[2]|0})`; ctx.shadowBlur=5+act*9;
      ctx.fillStyle=`rgb(${(c[0]*(0.4+0.6*act))|0},${(c[1]*(0.4+0.6*act))|0},${(c[2]*(0.4+0.6*act))|0})`;
      ctx.fillText(act>0.6?"(O)":"(o)", nd.x, nd.y); } }
    ctx.shadowBlur=0; ctx.textAlign="left";
  }
  return {static:false, resize, frame, pointer(x,y,a){mX=x;mY=y;mOn=a;}};
}
/* ===================== ASCII boot terminal ===================== */
export function createTerminalArt(canvas){
  const LINES=[
    "$ phase boot --actuator",
    "[ok] power stage online",
    "[ok] encoder 14-bit locked",
    "[ok] FOC loop @ 20 kHz",
    "[..] calibrating offset",
    "[ok] torque source ready",
    "> intelligence needs a body",
    "> shipping atoms, not bits",
  ];
  let ctx,W,H,fs,lh,pad,cw,last=0,t0=performance.now(),prog=0,lt=performance.now(),mOn=false;
  function resize(){ const s=setupCanvas(canvas); ctx=s.ctx;W=s.W;H=s.H;
    fs=Math.max(10,Math.min(15,Math.round(H/9))); lh=fs*1.3; pad=Math.max(10,W*0.04); cw=fs*0.62; }
  function color(ln){ return ln.startsWith("[ok]")?"#7df0ad": ln.startsWith("[..]")?"#ffd27a": ln.startsWith(">")?"#b79bff":"#cfe6ff"; }
  function frame(now){ if(now-last<55)return; last=now; const t=(now-t0)/1000;
    const dt=Math.min(0.1,(now-lt)/1000); lt=now; const cps=20; prog+=dt*cps*(mOn?4:1);
    ctx.fillStyle="#05070d"; ctx.fillRect(0,0,W,H);
    ctx.font=`${fs}px "JetBrains Mono", monospace`; ctx.textBaseline="top"; ctx.textAlign="left";
    const total=LINES.reduce((a,l)=>a+l.length,0);
    let typed=prog%(total+26); let y=Math.max(6,(H-LINES.length*lh)/2), active=-1;
    for(let i=0;i<LINES.length;i++){ const ln=LINES[i]; let show;
      if(typed>=ln.length){ show=ln.length; typed-=ln.length; }
      else if(typed>0){ show=Math.floor(typed); active=i; typed=0; }
      else show=0;
      ctx.fillStyle=color(ln); ctx.fillText(ln.slice(0,show), pad, y);
      if(i===active && Math.sin(t*7)>0){ ctx.fillStyle="#cfe6ff"; ctx.fillRect(pad+show*cw, y+1, cw*0.8, fs*0.9); }
      y+=lh;
    }
  }
  return {static:false, resize, frame, pointer(x,y,a){mOn=a;}};
}
/* ===================== pixel warp starfield ===================== */
export function createStarfieldArt(canvas){
  let dctx,loW,loH,img,data,last=0,stars=[],mX=0.5,mY=0.5,mOn=false,cXn=0.5,cYn=0.5,sp=1;
  function mk(){ return { a:Math.random()*Math.PI*2, r:Math.random()*0.18, sp:0.004+Math.random()*0.02, c:specArr(Math.random()) }; }
  function resize(){ const r=canvas.getBoundingClientRect(); const sc=4; loW=Math.max(40,Math.round(r.width/sc)); loH=Math.max(20,Math.round(r.height/sc));
    canvas.width=loW; canvas.height=loH; canvas.style.imageRendering='pixelated'; dctx=canvas.getContext('2d'); img=dctx.createImageData(loW,loH); data=img.data;
    stars=[]; const n=Math.min(160,Math.max(40,Math.round(loW*loH/22))); for(let i=0;i<n;i++){ const s=mk(); s.r=Math.random(); stars.push(s); } }
  function px(x,y,r,g,b){ if(x<0||x>=loW||y<0||y>=loH)return; const o=((y|0)*loW+(x|0))*4; data[o]=Math.min(255,data[o]+r);data[o+1]=Math.min(255,data[o+1]+g);data[o+2]=Math.min(255,data[o+2]+b); }
  function frame(now){ if(now-last<33)return; last=now;
    for(let i=0;i<data.length;i+=4){ data[i]=4;data[i+1]=5;data[i+2]=12;data[i+3]=255; }
    cXn+=((mOn?mX:0.5)-cXn)*0.1; cYn+=((mOn?mY:0.5)-cYn)*0.1; sp+=((mOn?2.4:1)-sp)*0.08;
    const cx=cXn*loW, cy=cYn*loH, rad=Math.hypot(loW,loH)*0.5;
    for(const s of stars){ s.r+=s.sp*(0.4+s.r*4)*sp;
      const dist=s.r*rad, x=cx+Math.cos(s.a)*dist*1.6, y=cy+Math.sin(s.a)*dist;
      if(s.r>1.05 || x<0||x>=loW||y<0||y>=loH){ Object.assign(s, mk()); continue; }
      const b=Math.min(1,s.r*1.4), c=s.c;
      px(x,y,c[0]*b,c[1]*b,c[2]*b);
      px(cx+Math.cos(s.a)*(dist-1.5)*1.6, cy+Math.sin(s.a)*(dist-1.5), c[0]*b*0.4,c[1]*b*0.4,c[2]*b*0.4);
    }
    dctx.putImageData(img,0,0);
  }
  return {static:false, resize, frame, pointer(x,y,a){mX=x;mY=y;mOn=a;}};
}

/* ===================== ASCII doom fire ===================== */
export function createFireArt(canvas){
  const RAMP=" .:-=+*#%@"; let ctx,W,H,fs,cw,ch,cols,rows,buf,last=0,mX=0.5,mY=0.5,mOn=false;
  function resize(){ const s=setupCanvas(canvas); ctx=s.ctx;W=s.W;H=s.H;
    fs=Math.max(7,Math.min(12,Math.round(H/20))); cw=fs*0.6; ch=fs*1.0; cols=Math.ceil(W/cw)+1; rows=Math.ceil(H/ch)+1;
    ctx.font=`bold ${fs}px "JetBrains Mono", monospace`; ctx.textBaseline="top"; buf=new Float32Array(cols*rows); }
  function frame(now){ if(now-last<45)return; last=now;
    for(let x=0;x<cols;x++) buf[(rows-1)*cols+x]=0.72+Math.random()*0.28;
    for(let y=0;y<rows-1;y++){ for(let x=0;x<cols;x++){ const sx=(x+((Math.random()*3|0)-1)+cols)%cols;
      const decay=0.05+Math.random()*0.11; buf[y*cols+x]=Math.max(0, buf[(y+1)*cols+sx]-decay); } }
    if(mOn){ const gx=mX*cols|0, gy=mY*rows|0; for(let dy=-2;dy<=2;dy++) for(let dx=-2;dx<=2;dx++){ const xx=gx+dx, yy=gy+dy; if(xx<0||xx>=cols||yy<0||yy>=rows)continue; if(Math.hypot(dx,dy)>2.4)continue; buf[yy*cols+xx]=1; } }
    ctx.fillStyle="#05060c"; ctx.fillRect(0,0,W,H);
    for(let y=0;y<rows;y++){ for(let x=0;x<cols;x++){ const v=buf[y*cols+x]; if(v<0.09) continue;
      let col; if(v>0.75) col=lerpC([255,240,180],[255,255,255],(v-0.75)/0.25);
      else if(v>0.45) col=lerpC([255,120,30],[255,240,180],(v-0.45)/0.30);
      else col=lerpC([150,20,46],[255,120,30], v/0.45);
      ctx.globalAlpha=Math.min(1,0.32+v); ctx.fillStyle=`rgb(${col[0]|0},${col[1]|0},${col[2]|0})`;
      ctx.fillText(RAMP[Math.min(RAMP.length-1,(v*RAMP.length)|0)], x*cw, y*ch); } }
    ctx.globalAlpha=1;
  }
  return {static:false, resize, frame, pointer(x,y,a){mX=x;mY=y;mOn=a;}};
}
/* ===================== ASCII 10-PRINT maze ===================== */
export function createMazeArt(canvas){
  let ctx,W,H,fs,cw,ch,cols,rows,cells,last=0,t0=performance.now(),mX=0.5,mY=0.5,mOn=false;
  function resize(){ const s=setupCanvas(canvas); ctx=s.ctx;W=s.W;H=s.H;
    fs=Math.max(12,Math.min(22,Math.round(H/7))); cw=fs*0.62; ch=fs*1.0; cols=Math.ceil(W/cw)+1; rows=Math.ceil(H/ch)+1;
    ctx.font=`${fs}px "JetBrains Mono", monospace`; ctx.textBaseline="top";
    cells=new Uint8Array(cols*rows); for(let i=0;i<cells.length;i++) cells[i]=Math.random()<0.5?0:1; }
  function frame(now){ if(now-last<70)return; last=now; const t=(now-t0)/1000;
    for(let k=0;k<Math.max(2,(cols*rows/110)|0);k++) cells[(Math.random()*cells.length)|0]^=1;
    const mgx=mX*cols, mgy=mY*rows;
    if(mOn){ for(let dy=-3;dy<=3;dy++) for(let dx=-3;dx<=3;dx++){ const xx=mgx+dx|0, yy=mgy+dy|0; if(xx<0||xx>=cols||yy<0||yy>=rows)continue; if(Math.hypot(dx,dy)>3)continue; if(Math.random()<0.4) cells[yy*cols+xx]^=1; } }
    ctx.fillStyle="#070611"; ctx.fillRect(0,0,W,H);
    for(let y=0;y<rows;y++){ for(let x=0;x<cols;x++){ const c=specArr((x/cols*0.5 + y/rows*0.3 + t*0.05)%1);
      const near=mOn?Math.max(0,1-Math.hypot(x-mgx,y-mgy)/4):0;
      ctx.globalAlpha=0.88+near*0.12; ctx.fillStyle=`rgb(${Math.min(255,c[0]+near*120)|0},${Math.min(255,c[1]+near*120)|0},${Math.min(255,c[2]+near*120)|0})`;
      ctx.fillText(cells[y*cols+x]?"\u2571":"\u2572", x*cw, y*ch); } }
    ctx.globalAlpha=1;
  }
  return {static:false, resize, frame, pointer(x,y,a){mX=x;mY=y;mOn=a;}};
}
/* ===================== ASCII rotating wireframe cube ===================== */
export function createCubeArt(canvas){
  let ctx,W,H,fs,last=0,mX=0.5,mY=0.5,mOn=false,ax=0,ay=0;
  const V=[[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]];
  const E=[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
  function resize(){ const s=setupCanvas(canvas); ctx=s.ctx;W=s.W;H=s.H; fs=Math.max(9,Math.round(H/12)); }
  function frame(now){ if(now-last<33)return; last=now;
    if(mOn){ ax+=(((mY-0.5)*3.0)-ax)*0.12; ay+=(((mX-0.5)*3.4)-ay)*0.12; } else { ax+=0.012; ay+=0.016; }
    ctx.fillStyle="#05060e"; ctx.fillRect(0,0,W,H);
    ctx.font=`${fs}px "JetBrains Mono", monospace`; ctx.textBaseline="middle"; ctx.textAlign="center";
    const ca=Math.cos(ax), sa=Math.sin(ax), cb=Math.cos(ay), sb=Math.sin(ay);
    const scale=Math.min(W,H)*0.30, cx=W/2, cy=H/2;
    const P=V.map(([x,y,z])=>{ const y2=y*ca - z*sa, z2=y*sa + z*ca; const x2=x*cb + z2*sb, z3=-x*sb + z2*cb;
      const persp=2.6/(2.6+z3); return [cx+x2*scale*persp, cy+y2*scale*persp, z3]; });
    for(const [a,b] of E){ const p=P[a], q=P[b]; const steps=Math.max(6,Math.round(Math.hypot(q[0]-p[0],q[1]-p[1])/(fs*0.55)));
      for(let s=0;s<=steps;s++){ const u=s/steps, x=p[0]+(q[0]-p[0])*u, y=p[1]+(q[1]-p[1])*u, z=p[2]+(q[2]-p[2])*u;
        const depth=0.5+0.5*(-z); const c=specArr((0.45+depth*0.4)%1); ctx.globalAlpha=0.32+0.62*depth;
        ctx.fillStyle=`rgb(${c[0]|0},${c[1]|0},${c[2]|0})`; ctx.fillText(depth>0.6?"#":"+", x, y); } }
    ctx.globalAlpha=1; ctx.textAlign="left";
  }
  return {static:false, resize, frame, pointer(x,y,a){mX=x;mY=y;mOn=a;}};
}
/* ===================== pixel warp tunnel ===================== */
export function createTunnelArt(canvas){
  let dctx,loW,loH,img,data,t=0,last=0,mX=0.5,mY=0.5,mOn=false,cXn=0.5,cYn=0.5;
  function resize(){ const r=canvas.getBoundingClientRect(); const sc=4; loW=Math.max(40,Math.round(r.width/sc)); loH=Math.max(20,Math.round(r.height/sc));
    canvas.width=loW; canvas.height=loH; canvas.style.imageRendering='pixelated'; dctx=canvas.getContext('2d'); img=dctx.createImageData(loW,loH); data=img.data; }
  function frame(now){ if(now-last<40)return; last=now; t+=0.04;
    cXn+=((mOn?mX:0.5)-cXn)*0.1; cYn+=((mOn?mY:0.5)-cYn)*0.1;
    const cx=cXn*loW, cy=cYn*loH;
    for(let y=0;y<loH;y++){ for(let x=0;x<loW;x++){ const dx=(x-cx)*1.4, dy=y-cy, r=Math.hypot(dx,dy)+0.001, a=Math.atan2(dy,dx);
      const u=0.6/r*loH + t*2, v=a/Math.PI*4 + t*0.5;
      const checker=(Math.floor(u)+Math.floor(v))&1, shade=Math.min(1,r/(loH*0.7));
      const c=specArr((u*0.05+t*0.05)%1), b=(checker?0.92:0.4)*(1-shade*0.7);
      const o=(y*loW+x)*4; data[o]=c[0]*b;data[o+1]=c[1]*b;data[o+2]=c[2]*b;data[o+3]=255;
    }}
    dctx.putImageData(img,0,0);
  }
  return {static:false, resize, frame, pointer(x,y,a){mX=x;mY=y;mOn=a;}};
}
/* ===================== pixel metaballs ===================== */
export function createMetaballsArt(canvas){
  let dctx,loW,loH,img,data,t=0,last=0,balls=[],mX=0.5,mY=0.5,mOn=false;
  function resize(){ const r=canvas.getBoundingClientRect(); const sc=4; loW=Math.max(40,Math.round(r.width/sc)); loH=Math.max(20,Math.round(r.height/sc));
    canvas.width=loW; canvas.height=loH; canvas.style.imageRendering='pixelated'; dctx=canvas.getContext('2d'); img=dctx.createImageData(loW,loH); data=img.data;
    balls=[]; for(let i=0;i<5;i++) balls.push({ph:Math.random()*6, sx:0.5+Math.random(), sy:0.5+Math.random(), r:loH*(0.22+Math.random()*0.18)}); }
  function frame(now){ if(now-last<40)return; last=now; t+=0.03;
    const pos=balls.map(b=>({ x:loW*(0.5+0.4*Math.sin(t*b.sx+b.ph)), y:loH*(0.5+0.4*Math.cos(t*b.sy+b.ph*1.3)), r2:b.r*b.r }));
    if(mOn) pos.push({ x:mX*loW, y:mY*loH, r2:(loH*0.34)**2 });
    for(let y=0;y<loH;y++){ for(let x=0;x<loW;x++){ let sum=0; for(const p of pos){ const dx=x-p.x, dy=y-p.y; sum+=p.r2/(dx*dx+dy*dy+1); }
      const v=Math.min(1,sum*0.7), c=specArr((v*0.8+t*0.03)%1), b=v>0.5?1:v*1.4;
      const o=(y*loW+x)*4; if(v<0.35){ data[o]=5;data[o+1]=6;data[o+2]=14; } else { data[o]=c[0]*b;data[o+1]=c[1]*b;data[o+2]=c[2]*b; } data[o+3]=255;
    }}
    dctx.putImageData(img,0,0);
  }
  return {static:false, resize, frame, pointer(x,y,a){mX=x;mY=y;mOn=a;}};
}
/* ===================== pixel wave interference ===================== */
export function createRippleArt(canvas){
  let dctx,loW,loH,img,data,t=0,last=0,src=[],mX=0.5,mY=0.5,mOn=false;
  function resize(){ const r=canvas.getBoundingClientRect(); const sc=4; loW=Math.max(40,Math.round(r.width/sc)); loH=Math.max(20,Math.round(r.height/sc));
    canvas.width=loW; canvas.height=loH; canvas.style.imageRendering='pixelated'; dctx=canvas.getContext('2d'); img=dctx.createImageData(loW,loH); data=img.data;
    src=[{x:loW*0.3,y:loH*0.5},{x:loW*0.7,y:loH*0.4},{x:loW*0.55,y:loH*0.7}]; }
  function frame(now){ if(now-last<40)return; last=now; t+=0.18;
    const act=mOn?src.concat([{x:mX*loW,y:mY*loH}]):src; const nS=act.length;
    for(let y=0;y<loH;y++){ for(let x=0;x<loW;x++){ let v=0; for(let i=0;i<nS;i++){ const s=act[i]; v+=Math.sin(Math.hypot(x-s.x,y-s.y)*0.5 - t - i); }
      const n=v/nS*0.5+0.5, c=specArr((n+t*0.01)%1), b=0.32+0.68*n;
      const o=(y*loW+x)*4; data[o]=c[0]*b;data[o+1]=c[1]*b;data[o+2]=c[2]*b;data[o+3]=255;
    }}
    for(let i=0;i<src.length;i++){ src[i].x=loW*(0.5+0.34*Math.sin(t*0.05+i)); src[i].y=loH*(0.5+0.34*Math.cos(t*0.04+i*1.7)); }
    dctx.putImageData(img,0,0);
  }
  return {static:false, resize, frame, pointer(x,y,a){mX=x;mY=y;mOn=a;}};
}
/* ===================== pixel lissajous trace ===================== */
export function createLissajousArt(canvas){
  let dctx,loW,loH,img,data,t=0,last=0,mX=0.5,mY=0.5,mOn=false;
  function resize(){ const r=canvas.getBoundingClientRect(); const sc=4; loW=Math.max(40,Math.round(r.width/sc)); loH=Math.max(20,Math.round(r.height/sc));
    canvas.width=loW; canvas.height=loH; canvas.style.imageRendering='pixelated'; dctx=canvas.getContext('2d'); img=dctx.createImageData(loW,loH); data=img.data;
    for(let i=0;i<data.length;i+=4){ data[i]=4;data[i+1]=6;data[i+2]=12;data[i+3]=255; } }
  function px(x,y,c,b){ if(x<0||x>=loW||y<0||y>=loH)return; const o=((y|0)*loW+(x|0))*4; data[o]=Math.min(255,data[o]+c[0]*b);data[o+1]=Math.min(255,data[o+1]+c[1]*b);data[o+2]=Math.min(255,data[o+2]+c[2]*b); }
  function frame(now){ if(now-last<33)return; last=now; t+=0.03;
    for(let i=0;i<data.length;i+=4){ data[i]*=0.82;data[i+1]*=0.84;data[i+2]*=0.86; if(data[i]<4)data[i]=4; if(data[i+1]<6)data[i+1]=6; if(data[i+2]<12)data[i+2]=12; }
    const a=mOn?1+(mX*4.99|0):3, b=mOn?1+(mY*4.99|0):2, delta=t*0.5, cx=loW/2, cy=loH/2, rx=loW*0.42, ry=loH*0.42;
    for(let k=0;k<60;k++){ const u=t*2 + k*0.05, x=cx+Math.sin(a*u+delta)*rx, y=cy+Math.sin(b*u)*ry, c=specArr((k/60+t*0.05)%1);
      px(x,y,c,1); px(x+1,y,c,0.5); px(x,y+1,c,0.5); }
    dctx.putImageData(img,0,0);
  }
  return {static:false, resize, frame, pointer(x,y,a){mX=x;mY=y;mOn=a;}};
}
/* ===================== pixel drifting voronoi ===================== */
export function createVoronoiArt(canvas){
  let dctx,loW,loH,img,data,t=0,last=0,sites=[],mX=0.5,mY=0.5,mOn=false;
  function resize(){ const r=canvas.getBoundingClientRect(); const sc=5; loW=Math.max(30,Math.round(r.width/sc)); loH=Math.max(16,Math.round(r.height/sc));
    canvas.width=loW; canvas.height=loH; canvas.style.imageRendering='pixelated'; dctx=canvas.getContext('2d'); img=dctx.createImageData(loW,loH); data=img.data;
    sites=[]; for(let i=0;i<9;i++) sites.push({ph:Math.random()*6, sx:0.4+Math.random()*0.8, sy:0.4+Math.random()*0.8, hue:Math.random()}); }
  function frame(now){ if(now-last<55)return; last=now; t+=0.02;
    const sp=sites.map(s=>({ x:loW*(0.5+0.42*Math.sin(t*s.sx+s.ph)), y:loH*(0.5+0.42*Math.cos(t*s.sy+s.ph)), hue:s.hue }));
    if(mOn) sp.push({ x:mX*loW, y:mY*loH, hue:(t*0.1)%1 });
    for(let y=0;y<loH;y++){ for(let x=0;x<loW;x++){ let b1=1e9,b2=1e9,hue=0; for(const s of sp){ const dx=x-s.x, dy=y-s.y, d=dx*dx+dy*dy; if(d<b1){ b2=b1; b1=d; hue=s.hue; } else if(d<b2){ b2=d; } }
      const edge=Math.min(1,(Math.sqrt(b2)-Math.sqrt(b1))/2.2), c=specArr((hue+t*0.03)%1), b=0.22+0.72*edge;
      const o=(y*loW+x)*4; data[o]=c[0]*b;data[o+1]=c[1]*b;data[o+2]=c[2]*b;data[o+3]=255;
    }}
    dctx.putImageData(img,0,0);
  }
  return {static:false, resize, frame, pointer(x,y,a){mX=x;mY=y;mOn=a;}};
}

/* ===================== pixel Julia set ===================== */
export function createJuliaArt(canvas){
  let dctx,loW,loH,img,data,t=0,last=0,mX=0.5,mY=0.5,mOn=false;
  function resize(){ const r=canvas.getBoundingClientRect(); const sc=5; loW=Math.max(30,Math.round(r.width/sc)); loH=Math.max(16,Math.round(r.height/sc));
    canvas.width=loW; canvas.height=loH; canvas.style.imageRendering='pixelated'; dctx=canvas.getContext('2d'); img=dctx.createImageData(loW,loH); data=img.data; }
  function frame(now){ if(now-last<45)return; last=now; t+=0.02;
    const cr=mOn?(mX*2-1)*0.9:0.7885*Math.cos(t*0.6), ci=mOn?(mY*2-1)*0.9:0.7885*Math.sin(t*0.6);
    const maxIt=48, scl=3.0/loH;
    for(let y=0;y<loH;y++){ for(let x=0;x<loW;x++){ let zx=(x-loW/2)*scl, zy=(y-loH/2)*scl, i=0;
      while(i<maxIt && zx*zx+zy*zy<4){ const xt=zx*zx-zy*zy+cr; zy=2*zx*zy+ci; zx=xt; i++; }
      const o=(y*loW+x)*4; if(i>=maxIt){ data[o]=6;data[o+1]=4;data[o+2]=14; } else { const c=specArr((i/maxIt+t*0.05)%1), b=0.25+0.75*(i/maxIt); data[o]=c[0]*b;data[o+1]=c[1]*b;data[o+2]=c[2]*b; } data[o+3]=255;
    }}
    dctx.putImageData(img,0,0);
  }
  return {static:false, resize, frame, pointer(x,y,a){mX=x;mY=y;mOn=a;}};
}
/* ===================== pixel Lorenz attractor ===================== */
export function createLorenzArt(canvas){
  let dctx,loW,loH,img,data,last=0,X=0.1,Y=0,Z=0,ang=0,mX=0.5,mOn=false;
  function resize(){ const r=canvas.getBoundingClientRect(); const sc=4; loW=Math.max(40,Math.round(r.width/sc)); loH=Math.max(20,Math.round(r.height/sc));
    canvas.width=loW; canvas.height=loH; canvas.style.imageRendering='pixelated'; dctx=canvas.getContext('2d'); img=dctx.createImageData(loW,loH); data=img.data;
    for(let i=0;i<data.length;i+=4){ data[i]=4;data[i+1]=5;data[i+2]=12;data[i+3]=255; } }
  function px(x,y,c,b){ if(x<0||x>=loW||y<0||y>=loH)return; const o=((y|0)*loW+(x|0))*4; data[o]=Math.min(255,data[o]+c[0]*b);data[o+1]=Math.min(255,data[o+1]+c[1]*b);data[o+2]=Math.min(255,data[o+2]+c[2]*b); }
  function frame(now){ if(now-last<33)return; last=now;
    for(let i=0;i<data.length;i+=4){ data[i]*=0.86;data[i+1]*=0.88;data[i+2]*=0.9; if(data[i]<4)data[i]=4; if(data[i+1]<5)data[i+1]=5; if(data[i+2]<12)data[i+2]=12; }
    ang+=0.01; const rot=mOn?mX*6.283:ang;
    const sig=10,rho=28,bet=8/3,dt=0.006,sX=loW*0.016,sY=loH*0.02,cr=Math.cos(rot),sr=Math.sin(rot);
    for(let s=0;s<22;s++){ const dx=sig*(Y-X), dy=X*(rho-Z)-Y, dz=X*Y-bet*Z; X+=dx*dt;Y+=dy*dt;Z+=dz*dt;
      const pxx=X*cr-Y*sr; px(loW/2+pxx*sX, loH*0.52+(Z-25)*sY, specArr((Z/50)%1), 1); }
    dctx.putImageData(img,0,0);
  }
  return {static:false, resize, frame, pointer(x,y,a){mX=x;mOn=a;}};
}
/* ===================== pixel phyllotaxis spiral ===================== */
export function createPhyllotaxisArt(canvas){
  const GA=Math.PI*(3-Math.sqrt(5));
  let dctx,loW,loH,img,data,t=0,last=0,mX=0.5,mY=0.5,mOn=false;
  function resize(){ const r=canvas.getBoundingClientRect(); const sc=4; loW=Math.max(40,Math.round(r.width/sc)); loH=Math.max(20,Math.round(r.height/sc));
    canvas.width=loW; canvas.height=loH; canvas.style.imageRendering='pixelated'; dctx=canvas.getContext('2d'); img=dctx.createImageData(loW,loH); data=img.data; }
  function px(x,y,c,b){ if(x<0||x>=loW||y<0||y>=loH)return; const o=((y|0)*loW+(x|0))*4; data[o]=Math.min(255,data[o]+c[0]*b);data[o+1]=Math.min(255,data[o+1]+c[1]*b);data[o+2]=Math.min(255,data[o+2]+c[2]*b); }
  function frame(now){ if(now-last<40)return; last=now; t+=0.02;
    for(let i=0;i<data.length;i+=4){ data[i]=5;data[i+1]=6;data[i+2]=14;data[i+3]=255; }
    const cx=mOn?mX*loW:loW/2, cy=mOn?mY*loH:loH/2, N=Math.min(900,(loW*loH/3)|0), s=Math.min(loW,loH)*0.05;
    for(let i=0;i<N;i++){ const ang=i*GA + t, r=s*Math.sqrt(i), x=cx+Math.cos(ang)*r, y=cy+Math.sin(ang)*r;
      if(x<0||x>=loW||y<0||y>=loH)continue; const c=specArr((i/N+t*0.05)%1), b=0.4+0.6*(i/N); px(x,y,c,b); px(x+1,y,c,b*0.5); }
    dctx.putImageData(img,0,0);
  }
  return {static:false, resize, frame, pointer(x,y,a){mX=x;mY=y;mOn=a;}};
}
/* ===================== ASCII elementary cellular automaton ===================== */
export function createAutomataArt(canvas){
  let ctx,W,H,fs,cw,ch,cols,rows,grid,rule=110,last=0,t0=performance.now();
  function apply(prev){ const n=new Uint8Array(cols); for(let i=0;i<cols;i++){ const l=prev[(i-1+cols)%cols],c=prev[i],r=prev[(i+1)%cols]; n[i]=(rule>>((l<<2)|(c<<1)|r))&1; } return n; }
  function build(){ let row=new Uint8Array(cols); if(rule===110||rule===30) row[cols>>1]=1; else for(let i=0;i<cols;i++) row[i]=Math.random()<0.5?1:0;
    grid=[row]; while(grid.length<rows) grid.push(apply(grid[grid.length-1])); }
  function resize(){ const s=setupCanvas(canvas); ctx=s.ctx;W=s.W;H=s.H;
    fs=Math.max(8,Math.min(13,Math.round(H/16))); cw=fs*0.6; ch=fs*1.0; cols=Math.max(8,Math.ceil(W/cw)); rows=Math.max(6,Math.ceil(H/ch)); build(); }
  function frame(now){ if(now-last<70)return; last=now; const t=(now-t0)/1000;
    grid.push(apply(grid[grid.length-1])); if(grid.length>rows) grid.shift();
    ctx.fillStyle="#06060f"; ctx.fillRect(0,0,W,H); ctx.font=`${fs}px "JetBrains Mono", monospace`; ctx.textBaseline="top"; ctx.textAlign="left";
    for(let y=0;y<grid.length;y++){ const row=grid[y], c=specArr((y/rows*0.6 + t*0.04)%1); ctx.fillStyle=`rgb(${c[0]|0},${c[1]|0},${c[2]|0})`;
      for(let x=0;x<cols;x++) if(row[x]) ctx.fillText("#", x*cw, y*ch); }
  }
  return {static:false, resize, frame, pointerDown(){ rule=[30,90,110,150,54,18,73][(Math.random()*7)|0]; build(); } };
}
/* ===================== ASCII self-playing snake ===================== */
export function createSnakeArt(canvas){
  let ctx,W,H,fs,cw,ch,cols,rows,snake,dir,food,last=0;
  function place(){ food={x:(Math.random()*cols)|0, y:(Math.random()*rows)|0}; }
  function reset(){ const cx=cols>>1, cy=rows>>1; snake=[{x:cx,y:cy},{x:cx-1,y:cy},{x:cx-2,y:cy}]; dir={x:1,y:0}; place(); }
  function resize(){ const s=setupCanvas(canvas); ctx=s.ctx;W=s.W;H=s.H;
    fs=Math.max(10,Math.min(16,Math.round(H/12))); cw=fs*0.62; ch=fs*1.0; cols=Math.max(8,Math.floor(W/cw)); rows=Math.max(6,Math.floor(H/ch)); reset(); }
  function occ(x,y){ for(const s of snake) if(s.x===x&&s.y===y) return true; return false; }
  function think(){ const h=snake[0], opts=[{x:1,y:0},{x:-1,y:0},{x:0,y:1},{x:0,y:-1}];
    const safe=opts.filter(d=>!(d.x===-dir.x&&d.y===-dir.y)).map(d=>({d,nx:(h.x+d.x+cols)%cols,ny:(h.y+d.y+rows)%rows})).filter(o=>!occ(o.nx,o.ny));
    if(!safe.length){ reset(); return; }
    safe.sort((a,b)=>(Math.abs(a.nx-food.x)+Math.abs(a.ny-food.y))-(Math.abs(b.nx-food.x)+Math.abs(b.ny-food.y)));
    dir=safe[0].d; }
  function step(){ think(); const h=snake[0], nx=(h.x+dir.x+cols)%cols, ny=(h.y+dir.y+rows)%rows; snake.unshift({x:nx,y:ny});
    if(nx===food.x&&ny===food.y) place(); else snake.pop();
    if(snake.length>cols*rows*0.45) reset(); }
  function frame(now){ if(now-last<95)return; last=now; step();
    ctx.fillStyle="#06060f"; ctx.fillRect(0,0,W,H); ctx.font=`${fs}px "JetBrains Mono", monospace`; ctx.textBaseline="top"; ctx.textAlign="left";
    ctx.fillStyle="#ff6bd0"; ctx.shadowColor="#ff6bd0"; ctx.shadowBlur=8; ctx.fillText("*", food.x*cw, food.y*ch); ctx.shadowBlur=0;
    for(let i=0;i<snake.length;i++){ const s=snake[i], c=specArr((0.42 + (i/snake.length)*0.4)%1); ctx.fillStyle=`rgb(${c[0]|0},${c[1]|0},${c[2]|0})`; ctx.fillText(i===0?"@":"#", s.x*cw, s.y*ch); }
  }
  return {static:false, resize, frame};
}
/* ===================== pixel falling sand ===================== */
export function createSandArt(canvas){
  let dctx,loW,loH,img,data,grid,last=0,hue=0,mX=0.5,mY=0.15,mOn=false;
  function resize(){ const r=canvas.getBoundingClientRect(); const sc=5; loW=Math.max(30,Math.round(r.width/sc)); loH=Math.max(16,Math.round(r.height/sc));
    canvas.width=loW; canvas.height=loH; canvas.style.imageRendering='pixelated'; dctx=canvas.getContext('2d'); img=dctx.createImageData(loW,loH); data=img.data; grid=new Uint8Array(loW*loH); }
  function frame(now){ if(now-last<40)return; last=now; hue+=0.012;
    const ex=mOn?(mX*loW)|0:((loW/2+Math.sin(hue*2)*loW*0.32)|0), ey=mOn?(mY*loH)|0:1, v=1+((hue*8|0)%24);
    for(let k=-1;k<=1;k++){ const xx=ex+k; if(xx>=0&&xx<loW){ const i=ey*loW+xx; if(!grid[i]) grid[i]=v; } }
    for(let y=loH-2;y>=0;y--){ for(let x=0;x<loW;x++){ const i=y*loW+x, g=grid[i]; if(!g)continue;
      if(!grid[(y+1)*loW+x]){ grid[(y+1)*loW+x]=g; grid[i]=0; }
      else { const dl=Math.random()<0.5, x1=dl?x-1:x+1, x2=dl?x+1:x-1;
        if(x1>=0&&x1<loW&&!grid[(y+1)*loW+x1]){ grid[(y+1)*loW+x1]=g; grid[i]=0; }
        else if(x2>=0&&x2<loW&&!grid[(y+1)*loW+x2]){ grid[(y+1)*loW+x2]=g; grid[i]=0; } } } }
    let filled=0;
    for(let i=0;i<grid.length;i++){ const o=i*4, g=grid[i]; if(!g){ data[o]=5;data[o+1]=6;data[o+2]=12; } else { filled++; const c=specArr(((g-1)/24)%1); data[o]=c[0];data[o+1]=c[1];data[o+2]=c[2]; } data[o+3]=255; }
    if(filled>grid.length*0.5) grid=new Uint8Array(loW*loH);
    dctx.putImageData(img,0,0);
  }
  return {static:false, resize, frame, pointer(x,y,a){mX=x;mY=y;mOn=a;}};
}
/* ===================== pixel double pendulum ===================== */
export function createPendulumArt(canvas){
  let dctx,loW,loH,img,data,last=0,a1=Math.PI*0.6,a2=Math.PI*0.5,v1=0,v2=0,trail=[],mOn=false;
  function resize(){ const r=canvas.getBoundingClientRect(); const sc=4; loW=Math.max(40,Math.round(r.width/sc)); loH=Math.max(20,Math.round(r.height/sc));
    canvas.width=loW; canvas.height=loH; canvas.style.imageRendering='pixelated'; dctx=canvas.getContext('2d'); img=dctx.createImageData(loW,loH); data=img.data; trail=[]; }
  function px(x,y,c,b){ if(x<0||x>=loW||y<0||y>=loH)return; const o=((y|0)*loW+(x|0))*4; data[o]=Math.min(255,data[o]+c[0]*b);data[o+1]=Math.min(255,data[o+1]+c[1]*b);data[o+2]=Math.min(255,data[o+2]+c[2]*b); }
  function line(x0,y0,x1,y1,c){ const n=Math.max(2,Math.hypot(x1-x0,y1-y0)|0); for(let i=0;i<=n;i++){ const u=i/n; px(x0+(x1-x0)*u,y0+(y1-y0)*u,c,0.9); } }
  function frame(now){ if(now-last<24)return; last=now;
    for(let i=0;i<data.length;i+=4){ data[i]=5;data[i+1]=6;data[i+2]=13;data[i+3]=255; }
    const g=1,m1=1,m2=1,L1=1,L2=1,dt=0.045;
    for(let s=0;s<5;s++){ const d=a1-a2, den=2*m1+m2-m2*Math.cos(2*d);
      const a1a=(-g*(2*m1+m2)*Math.sin(a1)-m2*g*Math.sin(a1-2*a2)-2*Math.sin(d)*m2*(v2*v2*L2+v1*v1*L1*Math.cos(d)))/(L1*den);
      const a2a=(2*Math.sin(d)*(v1*v1*L1*(m1+m2)+g*(m1+m2)*Math.cos(a1)+v2*v2*L2*m2*Math.cos(d)))/(L2*den);
      v1+=a1a*dt; v2+=a2a*dt; v1*=0.9995; v2*=0.9995; a1+=v1*dt; a2+=v2*dt; }
    if(!isFinite(a1)||!isFinite(a2)){ a1=Math.PI*0.6;a2=Math.PI*0.5;v1=0;v2=0;trail=[]; }
    const cx=loW/2, cy=loH*0.4, len=Math.min(loW,loH)*0.21;
    const x1=cx+Math.sin(a1)*len, y1=cy+Math.cos(a1)*len, x2=x1+Math.sin(a2)*len, y2=y1+Math.cos(a2)*len;
    trail.push({x:x2,y:y2,c:specArr((performance.now()*0.00012)%1)}); if(trail.length>120) trail.shift();
    for(let i=0;i<trail.length;i++){ const tp=trail[i], f=i/trail.length; px(tp.x,tp.y,tp.c,0.15+0.7*f); }
    line(cx,cy,x1,y1,[150,160,200]); line(x1,y1,x2,y2,[200,180,255]);
    px(cx,cy,[120,130,170],1); for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){ px(x1+dx,y1+dy,[150,230,255],0.9); px(x2+dx,y2+dy,[255,150,220],0.9); }
    dctx.putImageData(img,0,0);
  }
  return {static:false, resize, frame, pointerDown(){ v1+=(Math.random()-0.5)*6; v2+=(Math.random()-0.5)*6; } };
}
/* ===================== ASCII rotating globe ===================== */
export function createGlobeArt(canvas){
  let ctx,W,H,fs,last=0,t0=performance.now(),pts=[],mX=0.5,mY=0.5,mOn=false;
  function resize(){ const s=setupCanvas(canvas); ctx=s.ctx;W=s.W;H=s.H; fs=Math.max(8,Math.round(H/20));
    pts=[]; const La=13,Lo=26; for(let la=-La;la<=La;la++){ const th=la/La*Math.PI/2, rng=Math.max(1,Math.round(Lo*Math.cos(th)));
      for(let lo=0;lo<rng;lo++){ const ph=lo/rng*2*Math.PI; pts.push([Math.cos(th)*Math.cos(ph), Math.sin(th), Math.cos(th)*Math.sin(ph)]); } } }
  function frame(now){ if(now-last<33)return; last=now; const t=(now-t0)/1000;
    ctx.fillStyle="#05060e"; ctx.fillRect(0,0,W,H); ctx.font=`${fs}px "JetBrains Mono", monospace`; ctx.textBaseline="middle"; ctx.textAlign="center";
    const rot=mOn?mX*6.283:t*0.5, tilt=mOn?(mY-0.5)*2:0.4, R=Math.min(W,H)*0.4, cx=W/2, cy=H/2, cr=Math.cos(rot), srr=Math.sin(rot), ct=Math.cos(tilt), st=Math.sin(tilt);
    for(const p of pts){ const xr=p[0]*cr-p[2]*srr, zr=p[0]*srr+p[2]*cr; const yr=p[1]*ct-zr*st, zr2=p[1]*st+zr*ct;
      const depth=(zr2+1)/2, c=specArr((0.5+depth*0.4)%1); ctx.globalAlpha=0.2+0.8*depth; ctx.fillStyle=`rgb(${c[0]|0},${c[1]|0},${c[2]|0})`;
      ctx.fillText(depth>0.62?"o":".", cx+xr*R, cy+yr*R); }
    ctx.globalAlpha=1; ctx.textAlign="left";
  }
  return {static:false, resize, frame, pointer(x,y,a){mX=x;mY=y;mOn=a;}};
}
/* ===================== pixel fireworks ===================== */
export function createFireworksArt(canvas){
  let dctx,loW,loH,img,data,last=0,rockets=[],parts=[],timer=0;
  function resize(){ const r=canvas.getBoundingClientRect(); const sc=4; loW=Math.max(40,Math.round(r.width/sc)); loH=Math.max(20,Math.round(r.height/sc));
    canvas.width=loW; canvas.height=loH; canvas.style.imageRendering='pixelated'; dctx=canvas.getContext('2d'); img=dctx.createImageData(loW,loH); data=img.data; }
  function px(x,y,c,b){ if(x<0||x>=loW||y<0||y>=loH)return; const o=((y|0)*loW+(x|0))*4; data[o]=Math.min(255,data[o]+c[0]*b);data[o+1]=Math.min(255,data[o+1]+c[1]*b);data[o+2]=Math.min(255,data[o+2]+c[2]*b); }
  function burst(x,y,c){ const n=24+(Math.random()*22|0); for(let i=0;i<n;i++){ const a=Math.random()*6.283, sp=0.3+Math.random()*1.4; parts.push({x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,life:1,c}); } }
  function launch(tx){ const x=tx==null?Math.random()*loW:tx; rockets.push({x, y:loH-1, ty:loH*(0.15+Math.random()*0.32), vy:-(1.3+Math.random()*0.6), c:specArr(Math.random())}); }
  function frame(now){ if(now-last<33)return; last=now;
    for(let i=0;i<data.length;i+=4){ data[i]*=0.8;data[i+1]*=0.82;data[i+2]*=0.85; if(data[i]<3)data[i]=3; if(data[i+1]<4)data[i+1]=4; if(data[i+2]<10)data[i+2]=10; data[i+3]=255; }
    if(--timer<=0){ launch(); timer=18+(Math.random()*32|0); }
    for(let i=rockets.length-1;i>=0;i--){ const r=rockets[i]; r.y+=r.vy; r.vy+=0.012;
      if(r.y<=r.ty||r.vy>=0){ burst(r.x,r.y,r.c); rockets.splice(i,1); } else px(r.x,r.y,[255,250,230],1); }
    for(let i=parts.length-1;i>=0;i--){ const p=parts[i]; p.x+=p.vx; p.y+=p.vy; p.vy+=0.028; p.vx*=0.99; p.life-=0.018;
      if(p.life<=0){ parts.splice(i,1); continue; } px(p.x,p.y,p.c,Math.max(0,p.life)); }
    dctx.putImageData(img,0,0);
  }
  return {static:false, resize, frame, pointerDown(x){ launch(x*loW); } };
}
/* ===================== pixel kaleidoscope ===================== */
export function createKaleidoArt(canvas){
  let dctx,loW,loH,img,data,t=0,last=0,mX=0.5,mY=0.5,mOn=false,cXn=0.5,cYn=0.5;
  function resize(){ const r=canvas.getBoundingClientRect(); const sc=4; loW=Math.max(40,Math.round(r.width/sc)); loH=Math.max(20,Math.round(r.height/sc));
    canvas.width=loW; canvas.height=loH; canvas.style.imageRendering='pixelated'; dctx=canvas.getContext('2d'); img=dctx.createImageData(loW,loH); data=img.data; }
  function frame(now){ if(now-last<40)return; last=now; t+=0.04;
    cXn+=((mOn?mX:0.5)-cXn)*0.1; cYn+=((mOn?mY:0.5)-cYn)*0.1;
    const cx=cXn*loW, cy=cYn*loH, seg=6, segA=Math.PI*2/seg;
    for(let y=0;y<loH;y++){ for(let x=0;x<loW;x++){ const dx=x-cx, dy=y-cy, r=Math.hypot(dx,dy); let a=Math.atan2(dy,dx)+t*0.3;
      a=((a%segA)+segA)%segA; a=Math.abs(a-segA/2);
      const sxp=Math.cos(a)*r, syp=Math.sin(a)*r;
      const v=Math.sin(sxp*0.09+t)+Math.sin(syp*0.11-t*0.7)+Math.sin(r*0.06-t*1.1);
      const n=(v+3)/6, c=specArr((n+t*0.05)%1), b=0.32+0.68*n;
      const o=(y*loW+x)*4; data[o]=c[0]*b;data[o+1]=c[1]*b;data[o+2]=c[2]*b;data[o+3]=255;
    }}
    dctx.putImageData(img,0,0);
  }
  return {static:false, resize, frame, pointer(x,y,a){mX=x;mY=y;mOn=a;}};
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