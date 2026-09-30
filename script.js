const screens = document.querySelectorAll(".screen");

function showScreen(id) {
  screens.forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.querySelectorAll("[data-next]").forEach(btn => {
  btn.addEventListener("click", () => showScreen(btn.dataset.next));
});

document.getElementById("gameBtn").addEventListener("click", () => {
  showScreen("game");
  initGame();
});

document.getElementById("replayBtn").addEventListener("click", () => {
  showScreen("game");
  initGame();
});

// Sparkle background
const canvas = document.getElementById("sparkles");
const ctx = canvas.getContext("2d");
let dots = [];

function resizeCanvas() {
  canvas.width = innerWidth * devicePixelRatio;
  canvas.height = innerHeight * devicePixelRatio;
  canvas.style.width = innerWidth + "px";
  canvas.style.height = innerHeight + "px";
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
}
function makeDots() {
  dots = Array.from({length: Math.min(95, Math.floor(innerWidth / 9))}, () => ({
    x: Math.random() * innerWidth,
    y: Math.random() * innerHeight,
    r: Math.random() * 1.7 + .4,
    a: Math.random() * .55 + .2,
    speed: Math.random() * .35 + .08
  }));
}
function animateDots() {
  ctx.clearRect(0,0,innerWidth,innerHeight);
  dots.forEach(d => {
    d.y -= d.speed;
    if (d.y < -5) { d.y = innerHeight + 5; d.x = Math.random()*innerWidth; }
    d.a += (Math.random()-.5)*.03;
    d.a = Math.max(.12, Math.min(.85, d.a));
    ctx.beginPath();
    ctx.arc(d.x, d.y, d.r, 0, Math.PI*2);
    ctx.fillStyle = `rgba(255,180,238,${d.a})`;
    ctx.fill();
  });
  requestAnimationFrame(animateDots);
}
addEventListener("resize", () => { resizeCanvas(); makeDots(); });
resizeCanvas(); makeDots(); animateDots();

function toast(message) {
  const t = document.getElementById("toast");
  t.textContent = message;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 1900);
}
