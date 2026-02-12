/* ================================
   1. ANIMATED NETWORK BACKGROUND
================================ */
const canvas = document.getElementById("network");
const ctx = canvas.getContext("2d");
let w, h, nodes;

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
  const totalNodes = Math.min(80, Math.floor(w * h / 15000)); 
  nodes = Array(totalNodes).fill().map(() => ({
    x: Math.random() * w, 
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.5, 
    vy: (Math.random() - 0.5) * 0.5
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
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const dist = Math.hypot(dx, dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.strokeStyle = `rgba(100, 255, 218, ${0.15 * (1 - dist/120)})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(draw);
}
draw();

/* ================================
   2. TYPING EFFECT
================================ */
class TypeWriter {
  constructor(txtElement, words, wait = 3000) {
    this.txtElement = txtElement;
    this.words = words;
    this.txt = '';
    this.wordIndex = 0;
    this.wait = parseInt(wait, 10);
    this.isDeleting = false;
    this.type();
  }
  type() {
    const current = this.wordIndex % this.words.length;
    const fullTxt = this.words[current];
    this.isDeleting ? (this.txt = fullTxt.substring(0, this.txt.length - 1)) : (this.txt = fullTxt.substring(0, this.txt.length + 1));
    this.txtElement.innerHTML = `<span class="txt">${this.txt}</span>`;
    let typeSpeed = 100;
    if (this.isDeleting) typeSpeed /= 2;
    if (!this.isDeleting && this.txt === fullTxt) {
      typeSpeed = this.wait;
      this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
      this.isDeleting = false;
      this.wordIndex++;
      typeSpeed = 500;
    }
    setTimeout(() => this.type(), typeSpeed);
  }
}

/* ================================
   3. CONTACT WIDGET LOGIC
================================ */
// Esta función debe ser GLOBAL para que el onclick del HTML funcione
function toggleContact() {
  const widget = document.getElementById('contactWidget');
  if (widget) {
    widget.classList.toggle('active');
  }
}

// Inicialización general
document.addEventListener('DOMContentLoaded', () => {
  // Inicializar TypeWriter
  const txtElement = document.querySelector('.txt-type');
  if (txtElement) {
    const words = JSON.parse(txtElement.getAttribute('data-words'));
    const wait = txtElement.getAttribute('data-wait');
    new TypeWriter(txtElement, words, wait);
  }

  // Cerrar widget al hacer click afuera
  document.addEventListener("click", (e) => {
    const widget = document.getElementById("contactWidget");
    if (widget && !widget.contains(e.target) && widget.classList.contains("active")) {
      widget.classList.remove("active");
    }
  });
});
