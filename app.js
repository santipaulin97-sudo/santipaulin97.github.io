const canvas = document.getElementById("network");
const ctx = canvas.getContext("2d", { alpha: false });

let w, h, nodes;

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;

  nodes = Array(200).fill().map(() => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.15,
    vy: (Math.random() - 0.5) * 0.15
  }));
}

resize();
window.onresize = resize;

function draw() {
  ctx.fillStyle = "#05070d";
  ctx.fillRect(0, 0, w, h);

  for (let n of nodes) {
    n.x += n.vx;
    n.y += n.vy;

    if (n.x < 0 || n.x > w) n.vx *= -1;
    if (n.y < 0 || n.y > h) n.vy *= -1;

    ctx.beginPath();
    ctx.arc(n.x, n.y, 1.1, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0,255,213,0.8)";
    ctx.fill();
  }

  ctx.lineWidth = 0.6;

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const dist = dx*dx + dy*dy;

      if (dist < 25000) {
        const opacity = 1 - dist / 25000;
        ctx.strokeStyle = `rgba(0,255,213,${opacity * 0.08})`;
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(draw);
}

draw();
