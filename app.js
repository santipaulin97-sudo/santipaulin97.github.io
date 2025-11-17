/* ================================
   ANIMATED NETWORK BACKGROUND (FULL)
================================ */

const canvas = document.getElementById("network");
const ctx = canvas.getContext("2d");

let w, h, nodes;

// Configuración inicial del tamaño
function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;

  // Cantidad de nodos según tamaño de pantalla
  const totalNodes = Math.min(100, Math.floor(w * h / 15000));

  nodes = Array(totalNodes).fill().map(() => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.5, // Velocidad X
    vy: (Math.random() - 0.5) * 0.5  // Velocidad Y
  }));
}

// Ejecutar resize al inicio y al cambiar ventana
resize();
window.addEventListener("resize", resize);

// Función de dibujo (Loop)
function draw() {
  // Limpiar pantalla
  ctx.clearRect(0, 0, w, h);

  // Actualizar y dibujar nodos
  for (let n of nodes) {
    n.x += n.vx;
    n.y += n.vy;

    // Rebotar en los bordes
    if (n.x < 0 || n.x > w) n.vx *= -1;
    if (n.y < 0 || n.y > h) n.vy *= -1;

    ctx.beginPath();
    ctx.arc(n.x, n.y, 2.5, 0, Math.PI * 2);
    
    // COLOR DE PUNTOS (NEON CYAN)
    ctx.fillStyle = "#64ffda"; 
    ctx.shadowBlur = 8;
    ctx.shadowColor = "rgba(100, 255, 218, 0.6)";
    
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  // Dibujar líneas entre nodos cercanos
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const dist = Math.hypot(dx, dy);

      if (dist < 150) { // Distancia de conexión
        const opacity = 1 - dist / 150;

        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        
        // COLOR DE LÍNEAS (NEON CYAN CON TRANSPARENCIA)
        ctx.strokeStyle = `rgba(100, 255, 218, ${opacity * 0.25})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(draw);
}

// Iniciar animación
draw();
