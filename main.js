const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const menu = document.getElementById('menu');
const ui = document.getElementById('ui');
const statusText = document.getElementById('status');
const gameOverDiv = document.getElementById('gameOver');
const gameOverText = document.getElementById('gameOverText');

let player, enemies = [];
let level = 1;
let lives = 2;
let keys = {};
let gameRunning = false;

class Player {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.size = 30;
    this.color = color;
    this.speed = 4;
  }
  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.size, this.size);
  }
  move() {
    if (keys['ArrowUp']) this.y -= this.speed;
    if (keys['ArrowDown']) this.y += this.speed;
    if (keys['ArrowLeft']) this.x -= this.speed;
    if (keys['ArrowRight']) this.x += this.speed;
    this.x = Math.max(0, Math.min(canvas.width - this.size, this.x));
    this.y = Math.max(0, Math.min(canvas.height - this.size, this.y));
  }
}

class Enemy {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 25;
    this.color = 'red';
    this.speed = 2;
  }
  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.size, this.size);
  }
  move() {
    if (player.x > this.x) this.x += this.speed;
    if (player.x < this.x) this.x -= this.speed;
    if (player.y > this.y) this.y += this.speed;
    if (player.y < this.y) this.y -= this.speed;
  }
}

function startGame(classType) {
  menu.style.display = 'none';
  canvas.style.display = 'block';
  ui.style.display = 'block';
  player = new Player(400, 300, classType === 'mage' ? 'blue' : classType === 'archer' ? 'green' : 'white');
  level = 1;
  lives = 2;
  spawnEnemies(level);
  gameRunning = true;
  gameLoop();
}

function spawnEnemies(num) {
  enemies = [];
  for (let i = 0; i < num; i++) {
    let ex = Math.random() * (canvas.width - 25);
    let ey = Math.random() * (canvas.height - 25);
    enemies.push(new Enemy(ex, ey));
  }
}

function checkCollisions() {
  for (let e of enemies) {
    if (player.x < e.x + e.size &&
        player.x + player.size > e.x &&
        player.y < e.y + e.size &&
        player.y + player.size > e.y) {
      lives -= 1;
      if (lives <= 0) {
        endGame(false);
      } else {
        player.x = 400;
        player.y = 300;
      }
    }
  }
}

function gameLoop() {
  if (!gameRunning) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  player.move();
  player.draw();
  for (let e of enemies) {
    e.move();
    e.draw();
  }
  checkCollisions();
  if (enemies.length === 0) {
    level++;
    if (level > 10) {
      endGame(true);
      return;
    }
    spawnEnemies(level);
  }
  statusText.textContent = `Level: ${level} | Lives: ${lives}`;
  requestAnimationFrame(gameLoop);
}

function endGame(won) {
  gameRunning = false;
  gameOverDiv.classList.remove('hidden');
  gameOverText.textContent = won ? 'You Win!' : 'Game Over';
}

document.addEventListener('keydown', (e) => keys[e.key] = true);
document.addEventListener('keyup', (e) => keys[e.key] = false);
