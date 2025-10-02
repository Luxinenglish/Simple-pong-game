const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Game constants
const PADDLE_WIDTH = 15;
const PADDLE_HEIGHT = 100;
const BALL_SIZE = 18;
const PLAYER_X = 20;
const AI_X = canvas.width - PLAYER_X - PADDLE_WIDTH;
const PADDLE_SPEED = 6;
const BALL_SPEED = 6;

// Game state
let playerY = canvas.height/2 - PADDLE_HEIGHT/2;
let aiY = canvas.height/2 - PADDLE_HEIGHT/2;
let ballX = canvas.width/2 - BALL_SIZE/2;
let ballY = canvas.height/2 - BALL_SIZE/2;
let ballVX = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
let ballVY = BALL_SPEED * (Math.random() * 2 - 1);
let playerScore = 0;
let aiScore = 0;

// Mouse controls for left paddle
canvas.addEventListener('mousemove', function(e) {
    const rect = canvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    playerY = mouseY - PADDLE_HEIGHT/2;
    // Clamp paddle
    if (playerY < 0) playerY = 0;
    if (playerY > canvas.height - PADDLE_HEIGHT) playerY = canvas.height - PADDLE_HEIGHT;
});

// Basic AI for right paddle
function updateAI() {
    let paddleCenter = aiY + PADDLE_HEIGHT/2;
    if (paddleCenter < ballY + BALL_SIZE/2 - 15) {
        aiY += PADDLE_SPEED;
    } else if (paddleCenter > ballY + BALL_SIZE/2 + 15) {
        aiY -= PADDLE_SPEED;
    }
    // Clamp AI paddle
    if (aiY < 0) aiY = 0;
    if (aiY > canvas.height - PADDLE_HEIGHT) aiY = canvas.height - PADDLE_HEIGHT;
}

// Ball movement and collision
function updateBall() {
    ballX += ballVX;
    ballY += ballVY;

    // Top/bottom wall collision
    if (ballY <= 0 || ballY + BALL_SIZE >= canvas.height) {
        ballVY *= -1;
        ballY = Math.max(0, Math.min(ballY, canvas.height - BALL_SIZE));
    }

    // Left paddle collision
    if (
        ballX <= PLAYER_X + PADDLE_WIDTH &&
        ballX >= PLAYER_X &&
        ballY + BALL_SIZE >= playerY &&
        ballY <= playerY + PADDLE_HEIGHT
    ) {
        ballVX *= -1;
        ballX = PLAYER_X + PADDLE_WIDTH;
        // Add some "spin" based on where the paddle was hit
        ballVY += (ballY + BALL_SIZE/2 - (playerY + PADDLE_HEIGHT/2)) * 0.20;
    }

    // Right paddle collision
    if (
        ballX + BALL_SIZE >= AI_X &&
        ballX + BALL_SIZE <= AI_X + PADDLE_WIDTH &&
        ballY + BALL_SIZE >= aiY &&
        ballY <= aiY + PADDLE_HEIGHT
    ) {
        ballVX *= -1;
        ballX = AI_X - BALL_SIZE;
        ballVY += (ballY + BALL_SIZE/2 - (aiY + PADDLE_HEIGHT/2)) * 0.20;
    }

    // Score check
    if (ballX < 0) {
        aiScore++;
        resetBall(-1);
    }
    if (ballX + BALL_SIZE > canvas.width) {
        playerScore++;
        resetBall(1);
    }
}

function resetBall(direction) {
    ballX = canvas.width/2 - BALL_SIZE/2;
    ballY = canvas.height/2 - BALL_SIZE/2;
    ballVX = BALL_SPEED * direction;
    ballVY = BALL_SPEED * (Math.random() * 2 - 1);
}

// Drawing
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw paddles
    ctx.fillStyle = "#fafafa";
    ctx.fillRect(PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT);
    ctx.fillRect(AI_X, aiY, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Draw ball
    ctx.fillStyle = "#2ff";
    ctx.fillRect(ballX, ballY, BALL_SIZE, BALL_SIZE);

    // Draw net
    ctx.strokeStyle = "#eee";
    ctx.setLineDash([8, 14]);
    ctx.beginPath();
    ctx.moveTo(canvas.width/2, 0);
    ctx.lineTo(canvas.width/2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw score
    ctx.fillStyle = "#fff";
    ctx.font = "36px Arial";
    ctx.textAlign = "center";
    ctx.fillText(playerScore, canvas.width/2 - 50, 50);
    ctx.fillText(aiScore, canvas.width/2 + 50, 50);
}

function gameLoop() {
    updateAI();
    updateBall();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();