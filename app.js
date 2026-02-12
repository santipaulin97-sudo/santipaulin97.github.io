/* ================================
   1. ANIMATED NETWORK BACKGROUND
================================ */
const canvas = document.getElementById("network");
const ctx = canvas.getContext("2d");
let w, h, nodes;

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
  // Ajuste dinámico de cantidad de nodos según el tamaño de pantalla
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
  
  // Dibujar puntos y moverlos
  for (let n of nodes) {
    n.x += n.vx; 
    n.y += n.vy;
    
    if (n.x < 0 || n.x > w) n.vx *= -1;
    if (n.y < 0 || n.y > h) n.vy *= -1;
    
    ctx.beginPath();
    ctx.arc(n.x, n.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = "#64ffda"; 
    ctx.fill();
  }

  // Dibujar líneas de conexión
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const dist = Math.hypot(dx, dy);
      
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        // La opacidad depende de la distancia
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
   2. TYPING EFFECT (TEXTO DINÁMICO)
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

    // Determinar si está escribiendo o borrando
    if (this.isDeleting) {
      this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
      this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    // Insertar el texto en el elemento
    this.txtElement.innerHTML = `<span class="txt">${this.txt}</span>`;

    // Velocidad de escritura
    let typeSpeed = 100;
    if (this.isDeleting) typeSpeed /= 2;

    // Lógica de cambio de palabra
    if (!this.isDeleting && this.txt === fullTxt) {
      typeSpeed = this.wait; // Pausa al final de la palabra
      this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
      this.isDeleting = false;
      this.wordIndex++;
      typeSpeed = 500; // Pausa antes de empezar nueva palabra
    }

    setTimeout(() => this.type(), typeSpeed);
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  const txtElement = document.querySelector('.txt-type');
  if (txtElement) {
    const words = JSON.parse(txtElement.getAttribute('data-words'));
    const wait = txtElement.getAttribute('data-wait');
    new TypeWriter(txtElement, words, wait);
  }
   /* ================================
   3. CONTACT WIDGET
================================ */

document.addEventListener("DOMContentLoaded", () => {
  const widget = document.getElementById("contactWidget");
  const button = widget?.querySelector(".main-fab");

  if (!widget || !button) return;

  // Toggle al hacer click
  button.addEventListener("click", (e) => {
    e.stopPropagation();
    widget.classList.toggle("active");
  });

  // Cerrar si se hace click fuera
  document.addEventListener("click", (e) => {
    if (!widget.contains(e.target)) {
      widget.classList.remove("active");
    }

     function toggleContact() {
  const widget = document.getElementById('contactWidget');
  widget.classList.toggle('active');
}
  });


});
