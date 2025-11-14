// --- network background ---
const canvas = document.getElementById("network-bg");
const ctx = canvas.getContext("2d");

let W, H, nodes;

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;

  nodes = Array(110).fill().map(() => ({
    x: Math.random() * W,
    y: Math.random() * H,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4
  }));
}
resize();
window.onresize = resize;

function draw() {
  ctx.clearRect(0, 0, W, H);

  // points
  nodes.forEach(n => {
    n.x += n.vx;
    n.y += n.vy;

    if (n.x < 0 || n.x > W) n.vx *= -1;
    if (n.y < 0 || n.y > H) n.vy *= -1;

    ctx.beginPath();
    ctx.arc(n.x, n.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0, 230, 172, 0.9)";
    ctx.fill();
  });

  // lines
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const dist = Math.hypot(dx, dy);

      if (dist < 120) {
        ctx.strokeStyle = "rgba(0, 230, 172, 0.05)";
        ctx.lineWidth = 1;
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


// --- typing subtitle ---
const words = [
  "Data Engineer",
  "Python Developer",
  "SQL & BigQuery Specialist",
  "Automation & ETL",
  "Analytics & BI"
];

let i = 0, j = 0;
let isDeleting = false;
const el = document.getElementById("subtitle-text");

function type() {
  const word = words[i];

  el.textContent = isDeleting 
    ? word.substring(0, j--)
    : word.substring(0, j++);

  if (!isDeleting && j === word.length) {
    setTimeout(() => { isDeleting = true; type(); }, 1300);
    return;
  }

  if (isDeleting && j === 0) {
    i = (i + 1) % words.length;
    isDeleting = false;
  }

  setTimeout(type, isDeleting ? 50 : 90);
}
type();
