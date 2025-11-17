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
