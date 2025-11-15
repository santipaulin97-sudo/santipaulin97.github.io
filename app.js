const canvas = document.getElementById("network");
const ctx = canvas.getContext("2d");

let w, h, nodes;

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;

  nodes = Array(140).fill().map(() => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4
  }));
}

resize();
window.onresize = resize;

function draw() {
  ctx.clearRect(0, 0, w, h);

  // Dibujar nodos
  for (let n of nodes) {
    n.x += n.vx;
    n.y += n.vy;

    if (n.x < 0 || n.x > w) n.vx *= -1;
    if (n.y < 0 || n.y > h) n.vy *= -1;

    ctx.beginPath();
    ctx.arc(n.x, n.y, 2.2, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0,255,213,0.9)";
    ctx.shadowBlur = 12;
    ctx.shadowColor = "rgba(0,255,213,0.5)";
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  // Dibujar líneas de conexión
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 130) {
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.strokeStyle = "rgba(0,255,213,0.06)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(draw);
}

draw();

/* Typing effect */
const words = ["Data Engineer", "Python Developer", "BigQuery & SQL", "ETL Automation"];
let i = 0, j = 0, del = false;
const subtitle = document.getElementById("subtitle");

function type() {
  let word = words[i];
  subtitle.textContent = word.substring(0, j);

  if (!del && j === word.length) {
    del = true;
    setTimeout(type, 1500);
    return;
  }

  if (del && j === 0) {
    del = false;
    i = (i + 1) % words.length;
  }

  j += del ? -1 : 1;
  setTimeout(type, del ? 40 : 80);
}

type();

