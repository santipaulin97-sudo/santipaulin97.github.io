/*
  Canvas background with particles + connection lines + ETL flow nodes.
  Colors: blue / green (tipo código).
*/
(function(){
  const canvas = document.getElementById('bgCanvas');
  const ctx = canvas.getContext('2d', { alpha: true });
  let w = canvas.width = innerWidth;
  let h = canvas.height = innerHeight;
  const DPR = window.devicePixelRatio || 1;
  canvas.width = w * DPR;
  canvas.height = h * DPR;
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';
  ctx.scale(DPR, DPR);

  // config
  const PARTICLE_COUNT = Math.round((w*h)/60000); // scales with screen area
  const MAX_DIST = 130;
  const particles = [];
  const etlNodes = []; // fixed nodes for Extract->Transform->Load->BI
  const flowParticles = [];

  // color palette
  const colorA = {r:0, g:215, b:170}; // green
  const colorB = {r:0, g:183, b:255}; // cyan-blue

  // helpers
  function rand(min,max){ return Math.random()*(max-min)+min }
  function lerp(a,b,t){ return a + (b-a)*t }
  function mixColor(t){
    return {
      r: Math.round(lerp(colorA.r, colorB.r, t)),
      g: Math.round(lerp(colorA.g, colorB.g, t)),
      b: Math.round(lerp(colorA.b, colorB.b, t))
    };
  }

  // particles for the network
  class Particle {
    constructor(){
      this.reset();
    }
    reset(){
      this.x = rand(0,w);
      this.y = rand(0,h);
      this.vx = rand(-0.25,0.25);
      this.vy = rand(-0.25,0.25);
      this.r = rand(1,2.2);
      this.life = rand(60,400);
      this.age = 0;
      this.phase = Math.random();
      this.colorMix = Math.random();
    }
    step(){
      this.x += this.vx;
      this.y += this.vy;
      // gentle wrap-around
      if(this.x < -20) this.x = w + 20;
      if(this.x > w + 20) this.x = -20;
      if(this.y < -20) this.y = h + 20;
      if(this.y > h + 20) this.y = -20;
      this.age++;
      if(this.age > this.life) this.reset();
    }
    draw(){
      const t = (Math.sin(this.phase + this.age*0.02)+1)/2;
      const c = mixColor(this.colorMix * 0.7 + 0.3 * t);
      ctx.beginPath();
      ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},${0.9*t})`;
      ctx.arc(this.x, this.y, this.r * (0.7 + 0.6 * t), 0, Math.PI*2);
      ctx.fill();
    }
  }

  // etl nodes (fixed positions and labels)
  function setupETL(){
    const marginX = 120;
    const topY = Math.max(120, h*0.18);
    // Arrange nodes horizontally across the screen width, but not edge-to-edge
    const nodes = [
      {label:'EXTRACT'},
      {label:'TRANSFORM'},
      {label:'LOAD'},
      {label:'DASHBOARD'}
    ];
    const spacing = (w - marginX*2) / (nodes.length-1);
    nodes.forEach((n,i)=>{
      etlNodes.push({
        x: marginX + i*spacing,
        y: topY + 40*Math.sin(i*0.8), // slight vertical variance
        label: n.label,
        radius: 18 + (i===1?4:0)
      });
    });
    // create a few flow particles that travel along the node chain
    for(let i=0;i<Math.max(6, Math.floor(w/300)); i++){
      flowParticles.push({
        t: Math.random(), // progress along whole route (0..nodes.length-1)
        speed: rand(0.002, 0.008),
        size: rand(2,3.7)
      });
    }
  }

  function drawETLNodes(){
    etlNodes.forEach((n, idx) => {
      // halo
      ctx.beginPath();
      const haloGrad = ctx.createRadialGradient(n.x, n.y, 2, n.x, n.y, 60);
      const col = mixColor(idx/(etlNodes.length-1));
      haloGrad.addColorStop(0, `rgba(${col.r},${col.g},${col.b},0.08)`);
      haloGrad.addColorStop(1, `rgba(${col.r},${col.g},${col.b},0)`);
      ctx.fillStyle = haloGrad;
      ctx.arc(n.x, n.y, 60, 0, Math.PI*2);
      ctx.fill();

      // node
      ctx.beginPath();
      ctx.fillStyle = `rgba(${col.r},${col.g},${col.b},0.95)`;
      ctx.strokeStyle = `rgba(255,255,255,0.06)`;
      ctx.lineWidth = 1;
      ctx.arc(n.x, n.y, n.radius, 0, Math.PI*2);
      ctx.fill();
      ctx.stroke();

      // label
      ctx.fillStyle = "rgba(220,245,245,0.92)";
      ctx.font = "600 11px Inter, Arial";
      ctx.textAlign = "center";
      ctx.fillText(n.label, n.x, n.y - n.radius - 10);
    });
    // draw subtle connections between nodes
    for(let i=0;i<etlNodes.length-1;i++){
      const a=etlNodes[i], b=etlNodes[i+1];
      // curved line
      ctx.beginPath();
      ctx.strokeStyle = `rgba(120,200,210,0.06)`;
      ctx.lineWidth = 1.5;
      const mx = (a.x+b.x)/2;
      const my = (a.y+b.y)/2 - 20;
      ctx.moveTo(a.x, a.y);
      ctx.quadraticCurveTo(mx, my, b.x, b.y);
      ctx.stroke();
    }
  }

  function updateFlowParticles(){
    flowParticles.forEach(fp=>{
      // treat t as continuous progress across nodes chain length-1
      fp.t += fp.speed;
      if(fp.t > etlNodes.length-1) fp.t = 0;
      // determine which segment
      const seg = Math.floor(fp.t);
      const local = fp.t - seg;
      const start = etlNodes[seg];
      const end = etlNodes[Math.min(seg+1, etlNodes.length-1)];
      // compute quadratic curve position to match earlier curve
      const mx = (start.x+end.x)/2;
      const my = (start.y+end.y)/2 - 20;
      // quadratic bezier parametric
      const x = (1-local)*(1-local)*start.x + 2*(1-local)*local*mx + local*local*end.x;
      const y = (1-local)*(1-local)*start.y + 2*(1-local)*local*my + local*local*end.y;
      // draw particle
      const c = mixColor((seg)/(etlNodes.length-1));
      ctx.beginPath();
      ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},0.95)`;
      ctx.arc(x,y, fp.size, 0, Math.PI*2);
      ctx.fill();
    });
  }

  // create initial particles
  function init(){
    for(let i=0;i<Math.max(30, PARTICLE_COUNT); i++){
      particles.push(new Particle());
    }
    setupETL();
    animate();
  }

  function drawConnections(){
    for(let i=0;i<particles.length;i++){
      const a = particles[i];
      for(let j=i+1;j<particles.length;j++){
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if(dist < MAX_DIST){
          const alpha = 0.12 * (1 - (dist / MAX_DIST));
          // color based on midpoint mix
          const mix = (a.colorMix + b.colorMix) / 2;
          const c = mixColor(mix);
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},${alpha})`;
          ctx.lineWidth = 1 * (1 - dist / (MAX_DIST*1.2));
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
  }

  // small animated directional hints across the canvas to feel like flow
  function drawDirectionalHints(time){
    const lineCount = Math.max(3, Math.round(w/400));
    for(let i=0;i<lineCount;i++){
      const y = (h/2) + Math.sin((time*0.0005) + i)* (h*0.2) + (i*10 - lineCount*5);
      ctx.beginPath();
      const x1 = Math.floor((i*200 + (time*0.02)%w) % w);
      const x2 = x1 + 180 + (i*60);
      const grad = ctx.createLinearGradient(x1,y,x2,y);
      const c1 = mixColor(i/Math.max(1,lineCount-1));
      grad.addColorStop(0, `rgba(${c1.r},${c1.g},${c1.b},0.02)`);
      grad.addColorStop(0.6, `rgba(${c1.r},${c1.g},${c1.b},0.03)`);
      grad.addColorStop(1, `rgba(${c1.r},${c1.g},${c1.b},0.0)`);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.2;
      ctx.moveTo(x1,y); ctx.lineTo(x2,y);
      ctx.stroke();
    }
  }

  // main loop
  function animate(time){
    ctx.clearRect(0,0,w,h);

    // background subtle radial vignette
    const vg = ctx.createLinearGradient(0,0,0,h);
    vg.addColorStop(0, 'rgba(6,18,23,0.06)');
    vg.addColorStop(1, 'rgba(2,6,9,0.18)');
    ctx.fillStyle = vg;
    ctx.fillRect(0,0,w,h);

    // step & draw particles
    for(let p of particles){ p.step(); p.draw(); }
    drawConnections();

    // directional hints to create a sense of flow
    drawDirectionalHints(time || 0);

    // ETL nodes and flows on top
    drawETLNodes();
    updateFlowParticles();

    requestAnimationFrame(animate);
  }

  // handle resize
  let resizeTO;
  function handleResize(){
    clearTimeout(resizeTO);
    resizeTO = setTimeout(()=>{
      w = canvas.width = innerWidth;
      h = canvas.height = innerHeight;
      canvas.width = w * DPR;
      canvas.height = h * DPR;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      // reset or adjust arrays
      particles.length = 0;
      etlNodes.length = 0;
      flowParticles.length = 0;
      init();
    },120);
  }
  addEventListener('resize', handleResize);

  // start
  init();

})();
