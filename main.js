const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const bgm = document.getElementById('bgm');
const attackSound = document.getElementById('attackSound');

let player = { class: '', x: 50, y: 200, hp: 100, maxHp: 100, lives: 2, xp: 0, level: 1, spriteFrame: 0 };
let enemies = [];
let gameRunning = false;
let dialogueIndex = 0;
let dialogues = [
  "Welcome, traveler, to the multiverse arena.",
  "Choose your path: Mage, Warrior, or Archer.",
  "Survive 10 waves of enemies to prove your worth!"
];

// Placeholder images
let playerImg = new Image();
playerImg.src = 'assets/player.png';
let enemyImg = new Image();
enemyImg.src = 'assets/enemy.png';

function startGame() {
  document.getElementById('menu').classList.add('hidden');
  document.getElementById('class-selection').classList.remove('hidden');
}

function chooseClass(cls) {
  player.class = cls;
  document.getElementById('playerClass').innerText = cls;
  document.getElementById('class-selection').classList.add('hidden');
  document.getElementById('dialogue').classList.remove('hidden');
  document.getElementById('dialogueText').innerText = dialogues[0];
  bgm.play();
}

function nextDialogue() {
  dialogueIndex++;
  if (dialogueIndex < dialogues.length) {
    document.getElementById('dialogueText').innerText = dialogues[dialogueIndex];
  } else {
    document.getElementById('dialogue').classList.add('hidden');
    document.getElementById('gameCanvas').classList.remove('hidden');
    document.getElementById('hud').classList.remove('hidden');
    startLevel(1);
  }
}

function startLevel(level) {
  player.level = level;
  document.getElementById('level').innerText = level;
  enemies = [];
  for (let i = 0; i < level; i++) {
    enemies.push({ x: 700 - i * 60, y: 200, hp: 30, maxHp: 30, spriteFrame: 0 });
  }
  gameRunning = true;
  gameLoop();
}

function gameLoop() {
  if (!gameRunning) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw player
  ctx.drawImage(playerImg, player.spriteFrame * 32, 0, 32, 32, player.x, player.y, 32, 32);
  player.spriteFrame = (player.spriteFrame + 1) % 4;

  // Draw enemies
  enemies.forEach(enemy => {
    ctx.drawImage(enemyImg, enemy.spriteFrame * 32, 0, 32, 32, enemy.x, enemy.y, 32, 32);
    enemy.spriteFrame = (enemy.spriteFrame + 1) % 4;
    ctx.fillStyle = 'lime';
    ctx.fillRect(enemy.x, enemy.y - 10, (enemy.hp / enemy.maxHp) * 32, 5);
  });

  requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', (e) => {
  if (!gameRunning) return;
  if (e.key === 'ArrowUp') player.y -= 10;
  if (e.key === 'ArrowDown') player.y += 10;
  if (e.key === ' ') attack();
});

function attack() {
  attackSound.play();
  enemies.forEach(enemy => {
    let damage = 10;
    if (player.class === 'Mage') damage = 15;
    if (player.class === 'Archer') damage = 12;
    enemy.hp -= damage;
  });
  enemies = enemies.filter(enemy => enemy.hp > 0);

  if (enemies.length === 0) {
    player.xp += 10;
    document.getElementById('xp').innerText = player.xp;
    if (player.level < 10) {
      startLevel(player.level + 1);
    } else {
      endGame(true);
    }
  }
}

function endGame(win) {
  gameRunning = false;
  bgm.pause();
  document.getElementById('gameCanvas').classList.add('hidden');
  document.getElementById('hud').classList.add('hidden');
  document.getElementById('game-over').classList.remove('hidden');
  document.getElementById('gameResult').innerText = win ? 'You Win!' : 'Game Over!';
}

function restartGame() {
  player = { class: '', x: 50, y: 200, hp: 100, maxHp: 100, lives: 2, xp: 0, level: 1, spriteFrame: 0 };
  dialogueIndex = 0;
  document.getElementById('game-over').classList.add('hidden');
  document.getElementById('menu').classList.remove('hidden');
}
