// Game constants
const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 90;
const PADDLE_MARGIN = 10;
const BALL_SIZE = 16;
const PLAYER_COLOR = '#00e0ff';
const AI_COLOR = '#ff2070';
const BALL_COLOR = '#fff';

let playerY = HEIGHT/2 - PADDLE_HEIGHT/2;
let aiY = HEIGHT/2 - PADDLE_HEIGHT/2;
let ballX = WIDTH/2 - BALL_SIZE/2;
let ballY = HEIGHT/2 - BALL_SIZE/2;
let ballSpeedX = Math.random() > 0.5 ? 5 : -5;
let ballSpeedY = (Math.random() * 4 - 2);

let playerScore = 0, aiScore = 0;

function drawRect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI*2, false);
  ctx.closePath();
  ctx.fill();
}

function drawText(text, x, y, color, size=32) {
  ctx.fillStyle = color;
  ctx.font = `${size}px monospace`;
  ctx.textAlign = 'center';
  ctx.fillText(text, x, y);
}

function resetBall() {
  ballX = WIDTH/2 - BALL_SIZE/2;
  ballY = HEIGHT/2 - BALL_SIZE/2;
  ballSpeedX = Math.random() > 0.5 ? 5 : -5;
  ballSpeedY = (Math.random() * 4 - 2);
}

// Mouse movement for left paddle
canvas.addEventListener('mousemove', function(evt) {
  const rect = canvas.getBoundingClientRect();
  const mouseY = evt.clientY - rect.top;
  playerY = mouseY - PADDLE_HEIGHT/2;
  if (playerY < 0) playerY = 0;
  if (playerY > HEIGHT - PADDLE_HEIGHT) playerY = HEIGHT - PADDLE_HEIGHT;
});

function aiMove() {
  // Simple AI: move towards the ball with a little lag
  let aiCenter = aiY + PADDLE_HEIGHT/2;
  if (aiCenter < ballY + BALL_SIZE/2 - 15) {
    aiY += 4;
  } else if (aiCenter > ballY + BALL_SIZE/2 + 15) {
    aiY -= 4;
  }
  // Clamp AI paddle position
  if (aiY < 0) aiY = 0;
  if (aiY > HEIGHT - PADDLE_HEIGHT) aiY = HEIGHT - PADDLE_HEIGHT;
}

function collision(paddleX, paddleY) {
  // Checks collision with a paddle
  return (
    ballX < paddleX + PADDLE_WIDTH &&
    ballX + BALL_SIZE > paddleX &&
    ballY < paddleY + PADDLE_HEIGHT &&
    ballY + BALL_SIZE > paddleY
  );
}

function update() {
  // Move ball
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Wall collision (top/bottom)
  if (ballY < 0) {
    ballY = 0;
    ballSpeedY *= -1;
  }
  if (ballY + BALL_SIZE > HEIGHT) {
    ballY = HEIGHT - BALL_SIZE;
    ballSpeedY *= -1;
  }

  // Paddle collisions
  // Left paddle (player)
  if (collision(PADDLE_MARGIN, playerY)) {
    ballX = PADDLE_MARGIN + PADDLE_WIDTH;
    ballSpeedX *= -1;
    // Add some randomness to ball Y speed
    ballSpeedY += (Math.random() - 0.5) * 2;
  }

  // Right paddle (AI)
  if (collision(WIDTH - PADDLE_MARGIN - PADDLE_WIDTH, aiY)) {
    ballX = WIDTH - PADDLE_MARGIN - PADDLE_WIDTH - BALL_SIZE;
    ballSpeedX *= -1;
    ballSpeedY += (Math.random() - 0.5) * 2;
  }

  // Score
  if (ballX < 0) {
    aiScore++;
    resetBall();
  }
  if (ballX + BALL_SIZE > WIDTH) {
    playerScore++;
    resetBall();
  }

  aiMove();
}

function draw() {
  // Clear
  drawRect(0, 0, WIDTH, HEIGHT, '#111');

  // Center dashed line
  ctx.strokeStyle = '#333';
  ctx.setLineDash([12, 12]);
  ctx.beginPath();
  ctx.moveTo(WIDTH/2, 0);
  ctx.lineTo(WIDTH/2, HEIGHT);
  ctx.stroke();
  ctx.setLineDash([]);

  // Player paddle
  drawRect(PADDLE_MARGIN, playerY, PADDLE_WIDTH, PADDLE_HEIGHT, PLAYER_COLOR);

  // AI paddle
  drawRect(WIDTH - PADDLE_MARGIN - PADDLE_WIDTH, aiY, PADDLE_WIDTH, PADDLE_HEIGHT, AI_COLOR);

  // Ball
  drawRect(ballX, ballY, BALL_SIZE, BALL_SIZE, BALL_COLOR);

  // Scores
  drawText(playerScore, WIDTH/4, 60, PLAYER_COLOR, 48);
  drawText(aiScore, WIDTH*3/4, 60, AI_COLOR, 48);
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();