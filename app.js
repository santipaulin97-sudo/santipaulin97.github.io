// --- 1. Tu animación de partículas (SIN CAMBIOS) ---
const canvas = document.getElementById("background");
const ctx = canvas.getContext("2d");

let width, height, points;

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  points = Array(120).fill().map(() => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.6,
    vy: (Math.random() - 0.5) * 0.6
  }));
}

window.addEventListener("resize", resize);
resize();

function draw() {
  ctx.clearRect(0, 0, width, height);
  for (let p of points) {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0 || p.x > width) p.vx *= -1;
    if (p.y < 0 || p.y > height) p.vy *= -1;

    ctx.beginPath();
    ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = "#00e6ac";
    ctx.fill();
  }

  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const dx = points[i].x - points[j].x;
      const dy = points[i].y - points[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 130) {
        ctx.beginPath();
        ctx.moveTo(points[i].x, points[i].y);
        ctx.lineTo(points[j].x, points[j].y);
        ctx.strokeStyle = "rgba(0, 230, 172, 0.08)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(draw);
}

draw();

// --- 2. Lógica nueva para el subtítulo dinámico ---
document.addEventListener("DOMContentLoaded", function() {
  const words = [
    "Data Engineer",
    "Financial Analyst",
    "Python Developer",
    "BigQuery & SQL",
    "Power BI & Dashboards",
    "ETL Automation"
  ];
  let i = 0;
  let j = 0;
  let currentWord = "";
  let isDeleting = false;
  const target = document.getElementById("subtitle-text");

  function type() {
    currentWord = words[i];
    
    if (isDeleting) {
      // Borrando
      target.textContent = currentWord.substring(0, j--);
    } else {
      // Escribiendo
      target.textContent = currentWord.substring(0, j++);
    }

    // Comprobar si terminó de escribir o borrar
    if (!isDeleting && j === currentWord.length) {
      // Terminó de escribir, pausa y empieza a borrar
      isDeleting = true;
      setTimeout(type, 2000); // Pausa antes de borrar
    } else if (isDeleting && j === 0) {
      // Terminó de borrar, pasa a la siguiente palabra
      isDeleting = false;
      i = (i + 1) % words.length; // Va a la siguiente palabra (o vuelve al inicio)
      setTimeout(type, 500); // Pausa antes de escribir la nueva
    } else {
      // Sigue escribiendo o borrando
      const typeSpeed = isDeleting ? 50 : 100; // Más rápido borrando
      setTimeout(type, typeSpeed);
    }
  }
  
  // Inicia el efecto
  type();
});
