let gameInitialized = false;
let currentLevel = 1;
let selectedSequence = [];

function initGame() {
  currentLevel = 1;
  selectedSequence = [];
  document.getElementById("levelNum").textContent = currentLevel;
  document.getElementById("gameMessage").textContent = "";
  renderLevel();
}

function renderLevel() {
  const area = document.getElementById("puzzleArea");
  const msg = document.getElementById("gameMessage");
  msg.textContent = "";
  document.getElementById("levelNum").textContent = currentLevel;

  if (currentLevel === 1) {
    area.innerHTML = `
      <div class="puzzle">
        <h3>Level 1 — Find the birthday key</h3>
        <p>One answer unlocks the next clue. What month is Tanishka's birthday?</p>
        <div class="options">
          <button class="option">August</button>
          <button class="option" data-correct="true">October</button>
          <button class="option">December</button>
          <button class="option">February</button>
        </div>
      </div>`;
    area.querySelectorAll(".option").forEach(b => b.onclick = () => {
      if (b.dataset.correct) nextLevel();
      else fail("Not quite! Think about the birthday date. 💭");
    });
  } else if (currentLevel === 2) {
    area.innerHTML = `
      <div class="puzzle">
        <h3>Level 2 — Decode the sparkle</h3>
        <p>Take the first letter of each word: <b>Sweet Purple Roses</b>. Enter the 3-letter code.</p>
        <div class="code-box">
          <input id="codeInput" maxlength="3" placeholder="3 letters">
          <button id="codeBtn">Unlock</button>
        </div>
      </div>`;
    document.getElementById("codeBtn").onclick = () => {
      const value = document.getElementById("codeInput").value.trim().toUpperCase();
      if (value === "SPR") nextLevel();
      else fail("Close! Look at the first letters. ✨");
    };
  } else {
    const nums = [16, 10, 6, 20];
    area.innerHTML = `
      <div class="puzzle">
        <h3>Level 3 — Put the stars in order</h3>
        <p>Tap the numbers from smallest to largest. Your final surprise is behind them.</p>
        <div class="sequence">
          ${nums.map(n => `<button class="tile" data-num="${n}">${n}</button>`).join("")}
        </div>
      </div>`;
    area.querySelectorAll(".tile").forEach(b => b.onclick = () => {
      if (b.classList.contains("selected")) return;
      selectedSequence.push(Number(b.dataset.num));
      b.classList.add("selected");
      const target = [6,10,16,20];
      const index = selectedSequence.length - 1;
      if (selectedSequence[index] !== target[index]) {
        fail("Oops! Start again — smallest to largest. 🌙");
        setTimeout(() => { selectedSequence = []; area.querySelectorAll(".tile").forEach(x=>x.classList.remove("selected")); }, 650);
        return;
      }
      if (selectedSequence.length === target.length) finishGame();
    });
  }
}

function nextLevel() {
  currentLevel++;
  selectedSequence = [];
  document.getElementById("gameMessage").textContent = "✨ Correct! The next clue is unlocked.";
  setTimeout(renderLevel, 650);
}

function fail(text) {
  document.getElementById("gameMessage").textContent = text;
}

function finishGame() {
  document.getElementById("gameMessage").textContent = "All three puzzles solved! 🎉";
  setTimeout(() => {
    showScreen("final");
    playBirthdaySound();
    toast("🎂 Happy Birthday, Tanishka!");
    burstConfetti();
  }, 850);
}

// Small synthesized birthday-like chime; no external audio file required.
function playBirthdaySound() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ac = new AudioCtx();
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, i) => {
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, ac.currentTime + i*.12);
      gain.gain.linearRampToValueAtTime(.12, ac.currentTime + i*.12 + .03);
      gain.gain.exponentialRampToValueAtTime(.001, ac.currentTime + i*.12 + .55);
      osc.connect(gain).connect(ac.destination);
      osc.start(ac.currentTime + i*.12);
      osc.stop(ac.currentTime + i*.12 + .6);
    });
  } catch(e) {}
}

function burstConfetti() {
  for (let i=0; i<22; i++) {
    const el = document.createElement("span");
    el.textContent = i%2 ? "✦" : "✧";
    el.style.position = "fixed";
    el.style.left = (50 + (Math.random()-.5)*12) + "%";
    el.style.top = "50%";
    el.style.zIndex = 30;
    el.style.pointerEvents = "none";
    el.style.fontSize = (12 + Math.random()*20) + "px";
    el.style.color = i%2 ? "#ff7ad3" : "#c8a8ff";
    el.animate([
      { transform:"translate(-50%,-50%) scale(.3)", opacity:1 },
      { transform:`translate(${(Math.random()-.5)*520}px,${(Math.random()-.5)*500}px) rotate(${Math.random()*500-250}deg) scale(1.2)`, opacity:0 }
    ], { duration: 1100 + Math.random()*700, easing:"cubic-bezier(.2,.7,.2,1)" });
    setTimeout(()=>el.remove(), 1900);
    document.body.appendChild(el);
  }
}
