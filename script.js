```javascript
// ========================================
// BEAN CREW
// SIMPLE WORKING VERSION
// ========================================

console.log("SCRIPT.JS HAS LOADED!");


// Get the important HTML elements
const startButton = document.getElementById("startButton");
const menu = document.getElementById("menu");
const game = document.getElementById("game");
const canvas = document.getElementById("gameCanvas");
const statusText = document.getElementById("status");


// Canvas setup
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


// ========================================
// PLAYER
// ========================================

const player = {
  x: canvas.width / 2,
  y: canvas.height / 2,

  speed: 5,

  color: "#e53935"
};


// ========================================
// KEYBOARD
// ========================================

const keys = {};

document.addEventListener("keydown", function(event) {

  keys[event.key.toLowerCase()] = true;

});

document.addEventListener("keyup", function(event) {

  keys[event.key.toLowerCase()] = false;

});


// ========================================
// START BUTTON
// ========================================

startButton.addEventListener("click", function() {

  console.log("START ROUND BUTTON WAS CLICKED!");

  // Hide menu
  menu.classList.add("hidden");

  // Show game
  game.classList.remove("hidden");

  statusText.textContent = "Round started! Use W A S D to move.";

  // Start game
  gameLoop();

});


// ========================================
// PLAYER MOVEMENT
// ========================================

function movePlayer() {

  if (keys["w"]) {
    player.y -= player.speed;
  }

  if (keys["s"]) {
    player.y += player.speed;
  }

  if (keys["a"]) {
    player.x -= player.speed;
  }

  if (keys["d"]) {
    player.x += player.speed;
  }


  // Keep player inside screen

  if (player.x < 30) {
    player.x = 30;
  }

  if (player.x > canvas.width - 30) {
    player.x = canvas.width - 30;
  }

  if (player.y < 30) {
    player.y = 30;
  }

  if (player.y > canvas.height - 30) {
    player.y = canvas.height - 30;
  }

}


// ========================================
// DRAW PLAYER
// ========================================

function drawPlayer() {

  // Body

  ctx.fillStyle = player.color;

  ctx.beginPath();

  ctx.arc(
    player.x,
    player.y,
    25,
    0,
    Math.PI * 2
  );

  ctx.fill();


  // Backpack

  ctx.fillStyle = "#333";

  ctx.fillRect(
    player.x - 32,
    player.y - 8,
    10,
    20
  );


  // Goggles

  ctx.fillStyle = "#bdefff";

  ctx.beginPath();

  ctx.ellipse(
    player.x + 7,
    player.y - 8,
    17,
    11,
    0,
    0,
    Math.PI * 2
  );

  ctx.fill();


  // Goggles outline

  ctx.strokeStyle = "white";

  ctx.lineWidth = 3;

  ctx.stroke();

}


// ========================================
// DRAW MAP
// ========================================

function drawMap() {

  // Background

  ctx.fillStyle = "#29313d";

  ctx.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  );


  // Simple rooms

  drawRoom(
    80,
    80,
    250,
    180,
    "CAFETERIA"
  );

  drawRoom(
    canvas.width - 330,
    80,
    250,
    180,
    "WEAPONS"
  );

  drawRoom(
    80,
    canvas.height - 260,
    250,
    180,
    "MEDBAY"
  );

  drawRoom(
    canvas.width - 330,
    canvas.height - 260,
    250,
    180,
    "STORAGE"
  );

}


function drawRoom(x, y, width, height, name) {

  ctx.fillStyle = "#394554";

  ctx.fillRect(
    x,
    y,
    width,
    height
  );


  ctx.strokeStyle = "#687789";

  ctx.lineWidth = 5;

  ctx.strokeRect(
    x,
    y,
    width,
    height
  );


  ctx.fillStyle = "white";

  ctx.font = "18px Arial";

  ctx.fillText(
    name,
    x + 15,
    y + 30
  );

}


// ========================================
// VISION
// ========================================

function drawVision() {

  // Make the whole map slightly darker

  ctx.fillStyle = "rgba(0, 0, 0, 0.25)";

  ctx.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  );


  // Player vision

  const visionRadius = 260;


  const gradient = ctx.createRadialGradient(
    player.x,
    player.y,
    50,

    player.x,
    player.y,
    visionRadius
  );


  gradient.addColorStop(
    0,
    "rgba(0, 0, 0, 0)"
  );

  gradient.addColorStop(
    0.7,
    "rgba(0, 0, 0, 0.05)"
  );

  gradient.addColorStop(
    1,
    "rgba(0, 0, 0, 0.45)"
  );


  ctx.fillStyle = gradient;

  ctx.beginPath();

  ctx.arc(
    player.x,
    player.y,
    visionRadius,
    0,
    Math.PI * 2
  );

  ctx.fill();

}


// ========================================
// GAME LOOP
// ========================================

function gameLoop() {

  movePlayer();

  drawMap();

  drawPlayer();

  drawVision();


  requestAnimationFrame(gameLoop);

}


// ========================================
// RESIZE
// ========================================

window.addEventListener("resize", function() {

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  player.x = canvas.width / 2;
  player.y = canvas.height / 2;

});
```
