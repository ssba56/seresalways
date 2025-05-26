const clover = document.getElementById("clover");
const scoreDisplay = document.getElementById("score");
const gameContainer = document.getElementById("game-container");

let cloverY = window.innerHeight / 2;
let velocity = 0;
let gravity = 0.8;
let score = 0;
let pipes = [];
let isGameOver = false;
let isPaused = false;
let popupShown = false;

const GAP_HEIGHT = 300;
const PIPE_INTERVAL = 2500;
const PIPE_SPEED = 4.5;

document.addEventListener("keydown", (e) => {
  if (e.code === "ArrowUp" && !isPaused) velocity = -8;
  if (e.code === "ArrowDown" && !isPaused) velocity = 8;
});

function showPopup() {
  isPaused = true;

  const popup = document.createElement("div");
  popup.className = "popup";
  popup.style.left = Math.random() * (window.innerWidth - 320) + "px";
  popup.style.top = Math.random() * (window.innerHeight - 180) + "px";

  popup.innerHTML = `
    <p>Seni çok özledim. Eğer benimle barışmazsan oyun devam edemeyecek. Barışalım mı?</p>
    <div class="buttons">
      <button id="yesBtn">Evet</button>
      <button id="noBtn">Hayır</button>
    </div>
  `;
  document.body.appendChild(popup);

  document.getElementById("yesBtn").onclick = () => {
    popup.remove();
    isPaused=false;
    launchFireworks();
    launchHeartsAndStars();
    updateGame();
    
  };

  document.getElementById("noBtn").onclick = () => {
    popup.remove();
    showPopup(); // yeniden farklı yerde göster
  };
}

function launchFireworks() {
  for (let i = 0; i < 30; i++) {
    const firework = document.createElement("div");
    firework.className = "firework";
    firework.style.left = Math.random() * 100 + "%";
    firework.style.top = Math.random() * 100 + "%";
    document.body.appendChild(firework);

    setTimeout(() => firework.remove(), 1000);
  }
}

function endGame() {
  isGameOver = true;
  const button = document.createElement("button");
  button.textContent = "Tekrar Başlat";
  button.className = "restart-button";
  button.onclick = () => location.reload();
  gameContainer.appendChild(button);
}

function updateGame() {
  if (isGameOver || isPaused) return;

  velocity += gravity;
  cloverY += velocity;
  if (cloverY < 0) cloverY = 0;
  if (cloverY > window.innerHeight - 60) cloverY = window.innerHeight - 60;
  clover.style.top = cloverY + "px";

  pipes.forEach((pipe, index) => {
    pipe.x -= PIPE_SPEED;
    pipe.topDiv.style.left = pipe.x + "px";
    pipe.bottomDiv.style.left = pipe.x + "px";

    if (!pipe.passed && pipe.x + 80 < 100) {
      score++;
      scoreDisplay.textContent = score;
      pipe.passed = true;

      if (score === 44 && !popupShown) {
        popupShown = true;
        showPopup();
      }
    }

    if (
      100 < pipe.x + 80 &&
      100 + 60 > pipe.x &&
      (cloverY < pipe.gapY || cloverY + 60 > pipe.gapY + GAP_HEIGHT)
    ) {
      endGame();
    }

    if (pipe.x < -100) {
      pipe.topDiv.remove();
      pipe.bottomDiv.remove();
      pipes.splice(index, 1);
    }
  });

  requestAnimationFrame(updateGame);
}

function spawnPipe() {
  if (isGameOver || isPaused) return;

  const gapY = Math.floor(Math.random() * (window.innerHeight - GAP_HEIGHT - 100)) + 50;

  const topDiv = document.createElement("div");
  const bottomDiv = document.createElement("div");
  topDiv.classList.add("pipe", "pipe-top");
  bottomDiv.classList.add("pipe", "pipe-bottom");

  topDiv.style.setProperty("--gap-top", gapY + "px");
  bottomDiv.style.setProperty("--gap-bottom", (window.innerHeight - gapY - GAP_HEIGHT) + "px");

  topDiv.style.left = window.innerWidth + "px";
  bottomDiv.style.left = window.innerWidth + "px";

  gameContainer.appendChild(topDiv);
  gameContainer.appendChild(bottomDiv);

  pipes.push({
    x: window.innerWidth,
    gapY: gapY,
    topDiv,
    bottomDiv,
    passed: false,
  });
}

updateGame();
setInterval(spawnPipe, PIPE_INTERVAL);

function launchHeartsAndStars() {
  const symbols = ["🩶", "⭐"];
  for (let i = 0; i < 60; i++) {
    const el = document.createElement("div");
    el.className = "symbol-float";
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    el.style.left = Math.random() * 100 + "%";
    el.style.top = "100%";
    document.body.appendChild(el);

    el.animate([
      { transform: "translateY(0)", opacity: 1 },
      { transform: `translateY(-${200 + Math.random() * 800}px)`, opacity: 0 }
    ], {
      duration: 2000 + Math.random() * 2000,
      easing: "ease-out"
    });

    setTimeout(() => el.remove(),4000);
  }

}
