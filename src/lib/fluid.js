import { setupCanvas } from './utils.js';

export const Fluid = (() => {const RAMP=" \u00b7:-=+o*#%@"; const VER=[[138,86,232],[78,196,255],[120,232,150],[232,96,206]];
  let cv,ctx,hero,raf=0,running=false,reduced=false,fontPx=12,cw=7,ch=12,W=0,H=0;
  let NX=0,NY=0,size=0,dt=0.085,u,v,u0,v0,dens,dens0,p,div,curl;
  function veridia(t){ if(t<0)t=0; if(t>1)t=1; const s=t*(VER.length-1), i=s|0, f=s-i, j=Math.min(i+1,VER.length-1); return [VER[i][0]+(VER[j][0]-VER[i][0])*f, VER[i][1]+(VER[j][1]-VER[i][1])*f, VER[i][2]+(VER[j][2]-VER[i][2])*f]; }
  let mouseX=-1,mouseY=-1,lastX=-1,lastY=-1,mDown=false,emitters=[],bursts=[],resizeTO=0;
  const IX=(i,j)=> i+(NX+2)*j;
  function alloc(){ size=(NX+2)*(NY+2); u=new Float32Array(size);v=new Float32Array(size);u0=new Float32Array(size);v0=new Float32Array(size);dens=new Float32Array(size);dens0=new Float32Array(size);p=new Float32Array(size);div=new Float32Array(size);curl=new Float32Array(size); }
  function setBnd(b,x){
    for(let i=1;i<=NX;i++){ x[IX(i,0)]=b===2?-x[IX(i,1)]:x[IX(i,1)]; x[IX(i,NY+1)]=b===2?-x[IX(i,NY)]:x[IX(i,NY)]; }
    for(let j=1;j<=NY;j++){ x[IX(0,j)]=b===1?-x[IX(1,j)]:x[IX(1,j)]; x[IX(NX+1,j)]=b===1?-x[IX(NX,j)]:x[IX(NX,j)]; }
    x[IX(0,0)]=0.5*(x[IX(1,0)]+x[IX(0,1)]); x[IX(0,NY+1)]=0.5*(x[IX(1,NY+1)]+x[IX(0,NY)]);
    x[IX(NX+1,0)]=0.5*(x[IX(NX,0)]+x[IX(NX+1,1)]); x[IX(NX+1,NY+1)]=0.5*(x[IX(NX,NY+1)]+x[IX(NX+1,NY)]);
  }
  function project(uu,vv,pp,dd){ const h=1.0/Math.sqrt(NX*NY);
    for(let j=1;j<=NY;j++) for(let i=1;i<=NX;i++){ dd[IX(i,j)]=-0.5*h*(uu[IX(i+1,j)]-uu[IX(i-1,j)]+vv[IX(i,j+1)]-vv[IX(i,j-1)]); pp[IX(i,j)]=0; }
    setBnd(0,dd); setBnd(0,pp);
    for(let k=0;k<4;k++){ for(let j=1;j<=NY;j++) for(let i=1;i<=NX;i++) pp[IX(i,j)]=(dd[IX(i,j)]+pp[IX(i-1,j)]+pp[IX(i+1,j)]+pp[IX(i,j-1)]+pp[IX(i,j+1)])/4; setBnd(0,pp); }
    for(let j=1;j<=NY;j++) for(let i=1;i<=NX;i++){ uu[IX(i,j)]-=0.5*(pp[IX(i+1,j)]-pp[IX(i-1,j)])/h; vv[IX(i,j)]-=0.5*(pp[IX(i,j+1)]-pp[IX(i,j-1)])/h; }
    setBnd(1,uu); setBnd(2,vv);
  }
  function advect(b,d,d0,uu,vv){ const dx=dt*NX,dy=dt*NY;
    for(let j=1;j<=NY;j++) for(let i=1;i<=NX;i++){ let x=i-dx*uu[IX(i,j)], y=j-dy*vv[IX(i,j)];
      if(x<0.5)x=0.5; if(x>NX+0.5)x=NX+0.5; if(y<0.5)y=0.5; if(y>NY+0.5)y=NY+0.5;
      const i0=x|0,i1=i0+1,j0=y|0,j1=j0+1,s1=x-i0,s0=1-s1,t1=y-j0,t0=1-t1;
      d[IX(i,j)]=s0*(t0*d0[IX(i0,j0)]+t1*d0[IX(i0,j1)])+s1*(t0*d0[IX(i1,j0)]+t1*d0[IX(i1,j1)]); }
    setBnd(b,d);
  }
  function vorticity(){
    const eps=0.9;
    for(let j=1;j<=NY;j++) for(let i=1;i<=NX;i++) curl[IX(i,j)]=(u[IX(i,j+1)]-u[IX(i,j-1)])-(v[IX(i+1,j)]-v[IX(i-1,j)]);
    for(let j=2;j<NY;j++) for(let i=2;i<NX;i++){
      let nx=(Math.abs(curl[IX(i,j+1)])-Math.abs(curl[IX(i,j-1)]))*0.5;
      let ny=(Math.abs(curl[IX(i+1,j)])-Math.abs(curl[IX(i-1,j)]))*0.5;
      const len=Math.hypot(nx,ny)+1e-5; nx/=len; ny/=len; const w=curl[IX(i,j)];
      u[IX(i,j)]+=eps*dt*nx*w; v[IX(i,j)]-=eps*dt*ny*w;
    }
  }
  function buoyancy(){ const buo=0.7; for(let j=1;j<=NY;j++) for(let i=1;i<=NX;i++) v[IX(i,j)]-=buo*dt*dens[IX(i,j)]; }
  function velStep(){ project(u,v,p,div); u0.set(u);v0.set(v); advect(1,u,u0,u0,v0); advect(2,v,v0,u0,v0); project(u,v,p,div); for(let i=0;i<size;i++){u[i]*=0.985;v[i]*=0.985;} }
  function densStep(){ dens0.set(dens); advect(0,dens,dens0,u,v); for(let i=0;i<size;i++)dens[i]*=0.985; }
  function addForce(cx,cy,fx,fy,amt){ if(cx<1||cx>NX||cy<1||cy>NY)return;
    for(let dj=-1;dj<=1;dj++) for(let di=-1;di<=1;di++){ const i=cx+di,j=cy+dj; if(i<1||i>NX||j<1||j>NY)continue; const w=(di===0&&dj===0)?1:0.45; dens[IX(i,j)]+=amt*w; u[IX(i,j)]+=fx*w; v[IX(i,j)]+=fy*w; } }
  function applyBurst(cx,cy){ const R=Math.max(4,Math.round(NX*0.06));
    for(let dj=-R;dj<=R;dj++) for(let di=-R;di<=R;di++){ const i=cx+di,j=cy+dj; if(i<1||i>NX||j<1||j>NY)continue; const d=Math.hypot(di,dj); if(d>R)continue; const f=(1-d/R); const ang=Math.atan2(dj,di); u[IX(i,j)]+=Math.cos(ang)*4*f; v[IX(i,j)]+=Math.sin(ang)*4*f; dens[IX(i,j)]+=1.5*f; } }
  function step(){
    for(const e of emitters){ e.a+=e.sp; const cx=Math.round(NX*(0.5+0.34*Math.cos(e.a)*e.rx)); const cy=Math.round(NY*(0.5+0.34*Math.sin(e.a*1.3)*e.ry)); addForce(cx,cy,Math.cos(e.a+1.2)*0.7,Math.sin(e.a+0.4)*0.7,0.34); }
    if(mouseX>=0){ const cx=Math.max(1,Math.min(NX,Math.round(mouseX*NX)+1)); const cy=Math.max(1,Math.min(NY,Math.round(mouseY*NY)+1)); let fx=0,fy=0; if(lastX>=0){fx=(mouseX-lastX)*NX*0.55;fy=(mouseY-lastY)*NY*0.55;} addForce(cx,cy,fx,fy,0.9); lastX=mouseX; lastY=mouseY; }
    while(bursts.length){ const b=bursts.pop(); applyBurst(b.x,b.y); }
    velStep(); densStep();
  }
  function render(){ ctx.fillStyle='#ffffff'; ctx.fillRect(0,0,W,H); const L=RAMP.length-1;
    for(let j=1;j<=NY;j++){ for(let i=1;i<=NX;i++){ let d=dens[IX(i,j)]*3.2; if(d<0.05) continue; if(d>1)d=1;
      const g=58-Math.round(d*30); ctx.globalAlpha=0.18+0.72*d; ctx.fillStyle=`rgb(${g},${g+2},${g+5})`;
      ctx.fillText(RAMP[(d*L)|0], (i-1)*cw, (j-1)*ch); } }
    ctx.globalAlpha=1; }
  function loop(){ if(!running)return; step(); render(); raf=requestAnimationFrame(loop); }
  function measure(){ const s=setupCanvas(cv); ctx=s.ctx; W=s.W; H=s.H;
    fontPx=Math.max(11,Math.min(18,Math.round(H/40))); ctx.font=`${fontPx}px "JetBrains Mono", ui-monospace, monospace`; ctx.textBaseline="top";
    cw=fontPx*0.6; ch=fontPx*1.02; NX=Math.max(20,Math.floor(W/cw)); NY=Math.max(12,Math.floor(H/ch));
    while(NX*NY>5200){ NX=Math.floor(NX*0.93); NY=Math.floor(NY*0.93); }
    cw=W/NX; ch=H/NY; alloc(); }
  function cell(x,y){ const r=hero.getBoundingClientRect(); return {x:Math.max(1,Math.min(NX,Math.round((x-r.left)/r.width*NX)+1)), y:Math.max(1,Math.min(NY,Math.round((y-r.top)/r.height*NY)+1))}; }
  function onMove(x,y){ const r=hero.getBoundingClientRect(); mouseX=(x-r.left)/r.width; mouseY=(y-r.top)/r.height; if(mouseX<0||mouseX>1||mouseY<0||mouseY>1){mouseX=-1;lastX=-1;} }
  function bind(){
    hero.addEventListener('pointermove',e=>onMove(e.clientX,e.clientY),{passive:true});
    hero.addEventListener('pointerdown',e=>{ mDown=true; onMove(e.clientX,e.clientY); const c=cell(e.clientX,e.clientY); bursts.push(c); });
    window.addEventListener('pointerup',()=>mDown=false,{passive:true});
    hero.addEventListener('pointerleave',()=>{mouseX=-1;lastX=-1;});
    window.addEventListener('resize',()=>{ clearTimeout(resizeTO); resizeTO=setTimeout(()=>{ if(running){measure();seed();} },180); });
  }
  function seed(){ emitters=[{a:0,sp:0.006,rx:1,ry:0.7},{a:2.1,sp:-0.0045,rx:0.7,ry:1},{a:4,sp:0.0075,rx:0.85,ry:0.85}]; }
  function start(h,c){ hero=h; cv=c; reduced=matchMedia('(prefers-reduced-motion: reduce)').matches; measure(); seed(); bind(); running=true; if(reduced){ for(let k=0;k<160;k++)step(); render(); running=false; } else loop(); }
  function stop(){ running=false; if(raf)cancelAnimationFrame(raf); raf=0; }
  return {start,stop};})();