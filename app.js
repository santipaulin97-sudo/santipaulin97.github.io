/* ================================
   1. ANIMATED NETWORK BACKGROUND
================================ */
const canvas = document.getElementById("network");
const ctx = canvas.getContext("2d");
let w, h, nodes;

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
  const totalNodes = Math.min(80, Math.floor(w * h / 15000)); // Menos nodos para limpieza
  nodes = Array(totalNodes).fill().map(() => ({
    x: Math.random() * w, y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5
  }));
}
resize();
window.addEventListener("resize", resize);

function draw() {
  ctx.clearRect(0, 0, w, h);
  for (let n of nodes) {
    n.x += n.vx; n.y += n.vy;
    if (n.x < 0 || n.x > w) n.vx *= -1;
    if (n.y < 0 || n.y > h) n.vy *= -1;
    
    ctx.beginPath();
    ctx.arc(n.x, n.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = "#64ffda"; 
    ctx.fill();
  }
  // Líneas
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      if (Math.hypot(dx, dy) < 120) {
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.strokeStyle = `rgba(100, 255, 218, 0.15)`;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(draw);
}
draw();

/* ================================
   2. TYPING EFFECT (TEXTO DINÁMICO)
================================ */
const TypeWriter = function(txtElement, words, wait = 3000) {
  this.txtElement = txtElement;
  this.words = words;
  this.txt = '';
  this.wordIndex = 0;
  this.wait = parseInt(wait, 10);
  this.type();
  this.isDeleting = false;
}

TypeWriter.prototype.type = function() {
  const current = this.wordIndex % this.words.length;
  const fullTxt = this.words[current];

  if(this.isDeleting) {
    this.txt = fullTxt.substring(0, this.txt.length - 1);
  } else {
    this.txt = fullTxt.substring(0, this.txt.length + 1);
  }

  this.txtElement.innerHTML = `<span class="txt">${this.txt}</span>`;

  let typeSpeed = 100;
  if(this.isDeleting) typeSpeed /= 2;

  if(!this.isDeleting && this.txt === fullTxt) {
    typeSpeed = this.wait;
    this.isDeleting = true;
  } else if(this.isDeleting && this.txt === '') {
    this.isDeleting = false;
    this.wordIndex++;
    typeSpeed = 500;
  }

  setTimeout(() => this.type(), typeSpeed);
}

document.addEventListener('DOMContentLoaded', init);

function init() {
  const txtElement = document.querySelector('.txt-type');
  const words = JSON.parse(txtElement.getAttribute('data-words'));
  const wait = txtElement.getAttribute('data-wait');
  new TypeWriter(txtElement, words, wait);
}

/* --- NUEVA SECCIÓN: BRANDING & LOGO --- */
.brand-container {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.logo-box {
  width: 55px;
  height: 55px;
  border: 2px solid var(--accent);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Fira Code', monospace;
  font-weight: 700;
  color: var(--accent);
  font-size: 1.4rem;
  border-radius: 10px;
  position: relative;
  background: rgba(100, 255, 218, 0.05);
  flex-shrink: 0;
}

/* El detalle técnico de los corchetes arriba del logo */
.logo-box::before {
  content: '{ }';
  position: absolute;
  top: -12px;
  background: var(--bg-color); /* Esto tapa la línea del borde */
  font-size: 0.65rem;
  padding: 0 5px;
  letter-spacing: 1px;
}

.brand-text .name {
  font-size: 1.7rem; /* Ajustamos un poco el tamaño para que armonice con el logo */
  margin: 0;
  white-space: nowrap;
}

.status-badge {
  font-size: 0.65rem;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-family: 'Fira Code', monospace;
}

/* El punto verde con animación de pulsación */
.dot {
  width: 7px;
  height: 7px;
  background: var(--accent);
  border-radius: 50%;
  box-shadow: 0 0 8px var(--accent);
  animation: blink 2s infinite;
}

@keyframes blink {
  0% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.3; transform: scale(0.8); }
  100% { opacity: 1; transform: scale(1); }
}
