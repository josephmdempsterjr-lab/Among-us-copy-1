```javascript
document.addEventListener("DOMContentLoaded", () => {

  console.log("Bean Crew loaded!");

  // =========================
  // GET HTML ELEMENTS
  // =========================

  const menu = document.getElementById("menu");
  const game = document.getElementById("game");

  const startBtn = document.getElementById("startBtn");
  const startMessage = document.getElementById("startMessage");

  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  const playerCountInput = document.getElementById("playerCount");
  const impostorCountInput = document.getElementById("impostorCount");
  const taskCountInput = document.getElementById("taskCount");
  const visionInput = document.getElementById("vision");

  const roleText = document.getElementById("roleText");
  const taskText = document.getElementById("taskText");

  const meetingBtn = document.getElementById("meetingBtn");
  const reportBtn = document.getElementById("reportBtn");
  const useBtn = document.getElementById("useBtn");
  const ventBtn = document.getElementById("ventBtn");
  const killBtn = document.getElementById("killBtn");

  const taskModal = document.getElementById("taskModal");
  const taskTitle = document.getElementById("taskTitle");
  const taskDescription = document.getElementById("taskDescription");
  const taskFill = document.getElementById("taskFill");
  const finishTask = document.getElementById("finishTask");
  const closeTask = document.getElementById("closeTask");

  const meetingModal = document.getElementById("meetingModal");
  const meetingReason = document.getElementById("meetingReason");
  const voteGrid = document.getElementById("voteGrid");
  const voteStatus = document.getElementById("voteStatus");
  const skipVote = document.getElementById("skipVote");

  const winScreen = document.getElementById("winScreen");
  const winTitle = document.getElementById("winTitle");
  const winReason = document.getElementById("winReason");
  const playAgain = document.getElementById("playAgain");

  const toast = document.getElementById("toast");

  const sabotageBox = document.getElementById("sabotageBox");

  // =========================
  // GAME VARIABLES
  // =========================

  let gameStarted = false;

  let playerCount = 15;
  let impostorCount = 2;
  let totalTasks = 5;

  let visionRadius = 250;

  let keys = {};

  let animationFrame;

  let bots = [];

  let tasks = [];

  let player = {
    x: canvas.width / 2,
    y: canvas.height / 2,

    speed: 4,

    radius: 18,

    color: "#55aaff",

    role: "Crewmate",

    alive: true,

    tasksDone: 0,

    venting: false
  };

  let sabotage = null;

  // =========================
  // START ROUND
  // =========================

  startBtn.addEventListener("click", startRound);

  function startRound() {

    console.log("START ROUND CLICKED");

    startMessage.textContent = "Starting round...";

    playerCount = Number(playerCountInput.value);
    impostorCount = Number(impostorCountInput.value);
    totalTasks = Number(taskCountInput.value);

    visionRadius = Number(visionInput.value);

    // Make sure impostors never exceed a reasonable amount
    if (impostorCount >= playerCount) {
      impostorCount = Math.max(1, playerCount - 1);
    }

    // Hide menu
    menu.classList.add("hidden");

    // Show game
    game.classList.remove("hidden");

    // Reset player
    player = {
      x: canvas.width / 2,
      y: canvas.height / 2,

      speed: 4,

      radius: 18,

      color: "#55aaff",

      role: "Crewmate",

      alive: true,

      tasksDone: 0,

      venting: false
    };

    // Create game
    createTasks();
    createBots();
    assignRoles();

    updateHUD();

    gameStarted = true;

    // Start game loop
    cancelAnimationFrame(animationFrame);

    gameLoop();

    showToast("Round started! Use W A S D to move.");

  }


  // =========================
  // CREATE TASKS
  // =========================

  function createTasks() {

    tasks = [];

    const taskLocations = [
      { x: 180, y: 150, name: "Electrical" },
      { x: 450, y: 120, name: "Cafeteria" },
      { x: 800, y: 150, name: "Weapons" },
      { x: 180, y: 470, name: "MedBay" },
      { x: 500, y: 500, name: "Storage" },
      { x: 800, y: 470, name: "Navigation" },
      { x: 500, y: 300, name: "Admin" }
    ];

    for (let i = 0; i < totalTasks; i++) {

      const location = taskLocations[i % taskLocations.length];

      tasks.push({
        x: location.x,
        y: location.y,

        name: location.name,

        completed: false
      });

    }

  }


  // =========================
  // CREATE BOTS
  // =========================

  function createBots() {

    bots = [];

    for (let i = 0; i < playerCount - 1; i++) {

      bots.push({

        id: i,

        x: 80 + Math.random() * 840,

        y: 80 + Math.random() * 490,

        radius: 18,

        color: randomColor(),

        role: "Crewmate",

        alive: true,

        isImpostor: false,

        body: false

      });

    }

  }


  // =========================
  // ASSIGN ROLES
  // =========================

  function assignRoles() {

    let impostorsAssigned = 0;

    // Randomly choose impostor bots
    while (impostorsAssigned < impostorCount) {

      const index = Math.floor(Math.random() * bots.length);

      if (!bots[index].isImpostor) {

        bots[index].isImpostor = true;
        bots[index].role = "Impostor";

        impostorsAssigned++;

      }

    }

    // Small chance player is impostor
    if (Math.random() < 0.25 && impostorCount > 0) {

      player.role = "Impostor";

      player.isImpostor = true;

      // Turn one bot back into crewmate
      const bot = bots.find(b => b.isImpostor);

      if (bot) {

        bot.isImpostor = false;
        bot.role = "Crewmate";

      }

    } else {

      player.role = "Crewmate";
      player.isImpostor = false;

    }

    if (player.isImpostor) {

      roleText.textContent = "Role: IMPOSTOR";

      killBtn.classList.remove("hidden");
      ventBtn.classList.remove("hidden");
      sabotageBox.classList.remove("hidden");

    } else {

      roleText.textContent = "Role: Crewmate";

      killBtn.classList.add("hidden");
      ventBtn.classList.add("hidden");
      sabotageBox.classList.add("hidden");

    }

  }


  // =========================
  // MOVEMENT
  // =========================

  window.addEventListener("keydown", event => {

    keys[event.key.toLowerCase()] = true;

  });

  window.addEventListener("keyup", event => {

    keys[event.key.toLowerCase()] = false;

  });


  function movePlayer() {

    if (!gameStarted || !player.alive) {
      return;
    }

    let dx = 0;
    let dy = 0;

    if (keys["w"]) dy -= 1;
    if (keys["s"]) dy += 1;
    if (keys["a"]) dx -= 1;
    if (keys["d"]) dx += 1;

    // Normalize diagonal movement
    if (dx !== 0 || dy !== 0) {

      const length = Math.sqrt(dx * dx + dy * dy);

      dx /= length;
      dy /= length;

    }

    player.x += dx * player.speed;
    player.y += dy * player.speed;

    // Keep player on map
    player.x = Math.max(30, Math.min(canvas.width - 30, player.x));
    player.y = Math.max(30, Math.min(canvas.height - 30, player.y));

  }


  // =========================
  // BOT MOVEMENT
  // =========================

  function moveBots() {

    for (const bot of bots) {

      if (!bot.alive) continue;

      if (Math.random() < 0.02) {

        bot.dx = Math.random() * 2 - 1;
        bot.dy = Math.random() * 2 - 1;

      }

      bot.x += (bot.dx || 0) * 1.2;
      bot.y += (bot.dy || 0) * 1.2;

      bot.x = Math.max(30, Math.min(canvas.width - 30, bot.x));
      bot.y = Math.max(30, Math.min(canvas.height - 30, bot.y));

    }

  }


  // =========================
  // GAME LOOP
  // =========================

  function gameLoop() {

    if (!gameStarted) return;

    movePlayer();
    moveBots();

    draw();

    animationFrame = requestAnimationFrame(gameLoop);

  }


  // =========================
  // DRAW GAME
  // =========================

  function draw() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawMap();

    // Draw tasks
    for (const task of tasks) {

      if (!task.completed) {

        ctx.fillStyle = "#ffd84d";

        ctx.beginPath();
        ctx.arc(task.x, task.y, 8, 0, Math.PI * 2);
        ctx.fill();

      }

    }

    // Draw bots
    for (const bot of bots) {

      if (!bot.alive) {

        drawBody(bot);
        continue;

      }

      // Impostors are visible
      drawBean(
        bot.x,
        bot.y,
        bot.color
      );

    }

    // Draw player
    if (player.alive) {

      drawBean(
        player.x,
        player.y,
        player.color
      );

    }

    drawVision();

  }


  // =========================
  // MAP
  // =========================

  function drawMap() {

    ctx.fillStyle = "#293241";

    ctx.fillRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    // Rooms
    drawRoom(60, 60, 250, 180, "Electrical");
    drawRoom(350, 60, 300, 180, "Cafeteria");
    drawRoom(690, 60, 250, 180, "Weapons");

    drawRoom(60, 350, 250, 220, "MedBay");
    drawRoom(350, 350, 300, 220, "Storage");
    drawRoom(690, 350, 250, 220, "Navigation");

    // Hallways
    ctx.fillStyle = "#394554";

    ctx.fillRect(310, 120, 40, 350);
    ctx.fillRect(650, 120, 40, 350);

    ctx.fillRect(150, 240, 700, 50);

  }


  function drawRoom(x, y, width, height, name) {

    ctx.fillStyle = "#303b4a";

    ctx.fillRect(x, y, width, height);

    ctx.strokeStyle = "#566477";
    ctx.lineWidth = 5;

    ctx.strokeRect(x, y, width, height);

    ctx.fillStyle = "#aeb8c7";

    ctx.font = "16px Arial";

    ctx.fillText(
      name,
      x + 15,
      y + 25
    );

  }


  // =========================
  // BEAN CHARACTER
  // =========================

  function drawBean(x, y, color) {

    ctx.save();

    // Body
    ctx.fillStyle = color;

    ctx.beginPath();

    ctx.arc(
      x,
      y,
      18,
      0,
      Math.PI * 2
    );

    ctx.fill();

    // Backpack
    ctx.fillStyle = "#30343b";

    ctx.fillRect(
      x - 23,
      y - 5,
      8,
      17
    );

    // Goggles
    ctx.fillStyle = "#bfe9ff";

    ctx.beginPath();

    ctx.ellipse(
      x + 5,
      y - 6,
      12,
      8,
      0,
      0,
      Math.PI * 2
    );

    ctx.fill();

    ctx.strokeStyle = "#e7f8ff";
    ctx.lineWidth = 2;

    ctx.stroke();

    ctx.restore();

  }


  // =========================
  // VISION
  // =========================

  function drawVision() {

    // Darken the whole map slightly
    ctx.fillStyle = "rgba(0, 0, 0, 0.28)";

    ctx.fillRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    // Bright vision around player
    const gradient = ctx.createRadialGradient(
      player.x,
      player.y,
      visionRadius * 0.35,

      player.x,
      player.y,
      visionRadius
    );

    gradient.addColorStop(
      0,
      "rgba(0,0,0,0)"
    );

    gradient.addColorStop(
      0.75,
      "rgba(0,0,0,0.05)"
    );

    gradient.addColorStop(
      1,
      "rgba(0,0,0,0.48)"
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


  // =========================
  // TASKS
  // =========================

  useBtn.addEventListener("click", useNearby);

  function useNearby() {

    if (!player.alive) return;

    let closest = null;
    let closestDistance = Infinity;

    for (const task of tasks) {

      if (task.completed) continue;

      const distance = Math.hypot(
        task.x - player.x,
        task.y - player.y
      );

      if (distance < closestDistance) {

        closestDistance = distance;
        closest = task;

      }

    }

    if (closest && closestDistance < 60) {

      openTask(closest);

    } else {

      showToast("Move closer to a task.");

    }

  }


  function openTask(task) {

    if (player.isImpostor) {

      showToast("Impostors cannot complete tasks!");

      return;

    }

    taskModal.classList.remove("hidden");

    taskTitle.textContent = task.name;

    taskDescription.textContent =
      "Complete this task to help the crew.";

    taskFill.style.width = "0%";

    finishTask.onclick = () => {

      task.completed = true;

      player.tasksDone++;

      taskModal.classList.add("hidden");

      updateHUD();

      showToast("Task completed!");

      checkWin();

    };

  }


  closeTask.addEventListener("click", () => {

    taskModal.classList.add("hidden");

  });


  // =========================
  // KILL
  // =========================

  killBtn.addEventListener("click", killNearby);

  function killNearby() {

    if (!player.isImpostor) return;

    let target = null;
    let distance = Infinity;

    for (const bot of bots) {

      if (!bot.alive || bot.isImpostor) continue;

      const d = Math.hypot(
        bot.x - player.x,
        bot.y - player.y
      );

      if (d < distance) {

        distance = d;
        target = bot;

      }

    }

    if (target && distance < 65) {

      target.alive = false;
      target.body = true;

      showToast("You eliminated a crewmate.");

      checkWin();

    } else {

      showToast("No crewmate nearby.");

    }

  }


  // =========================
  // REPORT
  // =========================

  reportBtn.addEventListener("click", reportBody);

  function reportBody() {

    let bodyFound = false;

    for (const bot of bots) {

      if (!bot.body) continue;

      const distance = Math.hypot(
        bot.x - player.x,
        bot.y - player.y
      );

      if (distance < 80) {

        bodyFound = true;
        break;

      }

    }

    if (bodyFound) {

      openMeeting("Body reported!");

    } else {

      showToast("No body nearby.");

    }

  }


  // =========================
  // EMERGENCY MEETING
  // =========================

  meetingBtn.addEventListener("click", () => {

    openMeeting("Emergency meeting!");

  });


  function openMeeting(reason) {

    meetingModal.classList.remove("hidden");

    meetingReason.textContent = reason;

    voteStatus.textContent = "";

    voteGrid.innerHTML = "";

    bots.forEach(bot => {

      if (!bot.alive) return;

      const button = document.createElement("button");

      button.className = "voteButton";

      button.textContent = "Bean " + (bot.id + 1);

      button.onclick = () => vote(bot);

      voteGrid.appendChild(button);

    });

  }


  function vote(bot) {

    meetingModal.classList.add("hidden");

    bot.alive = false;

    showToast("Vote complete.");

    checkWin();

  }


  skipVote.addEventListener("click", () => {

    meetingModal.classList.add("hidden");

    showToast("Skipped vote.");

  });


  // =========================
  // VENT
  // =========================

  ventBtn.addEventListener("click", () => {

    if (!player.isImpostor) return;

    player.venting = !player.venting;

    if (player.venting) {

      showToast("You entered a vent.");

    } else {

      showToast("You left the vent.");

    }

  });


  // =========================
  // SABOTAGE
  // =========================

  document.getElementById("lightsBtn").addEventListener(
    "click",
    () => sabotageGame("Lights")
  );

  document.getElementById("commsBtn").addEventListener(
    "click",
    () => sabotageGame("Communications")
  );

  document.getElementById("reactorBtn").addEventListener(
    "click",
    () => sabotageGame("Reactor")
  );

  document.getElementById("o2Btn").addEventListener(
    "click",
    () => sabotageGame("O2")
  );


  function sabotageGame(type) {

    if (!player.isImpostor) return;

    sabotage = type;

    showToast(type + " sabotaged!");

    setTimeout(() => {

      if (sabotage === type) {

        if (type === "Reactor" || type === "O2") {

          endGame(
            "IMPOSTORS WIN",
            type + " was not fixed in time!"
          );

        } else {

          sabotage = null;

        }

      }

    }, 30000);

  }


  // =========================
  // WIN CONDITIONS
  // =========================

  function checkWin() {

    if (!gameStarted) return;

    const livingCrew = bots.filter(
      bot => bot.alive && !bot.isImpostor
    ).length
    + (
      player.alive && !player.isImpostor
        ? 1
        : 0
    );

    const livingImpostors = bots.filter(
      bot => bot.alive && bot.isImpostor
    ).length
    + (
      player.alive && player.isImpostor
        ? 1
        : 0
    );

    if (livingImpostors === 0) {

      endGame(
        "CREWMATES WIN",
        "All impostors have been eliminated!"
      );

      return;

    }

    if (livingImpostors >= livingCrew) {

      endGame(
        "IMPOSTORS WIN",
        "The impostors have taken control!"
      );

      return;

    }

    if (
      !player.isImpostor &&
      player.tasksDone >= totalTasks
    ) {

      endGame(
        "CREWMATES WIN",
        "You completed all your tasks!"
      );

    }

  }


  function endGame(title, reason) {

    gameStarted = false;

    cancelAnimationFrame(animationFrame);

    winTitle.textContent = title;
    winReason.textContent = reason;

    winScreen.classList.remove("hidden");

  }


  // =========================
  // PLAY AGAIN
  // =========================

  playAgain.addEventListener("click", () => {

    winScreen.classList.add("hidden");

    menu.classList.remove("hidden");

    game.classList.add("hidden");

    startMessage.textContent = "";

    gameStarted = false;

  });


  // =========================
  // HUD
  // =========================

  function updateHUD() {

    taskText.textContent =
      "Tasks: " +
      player.tasksDone +
      "/" +
      totalTasks;

  }


  // =========================
  // TOAST
  // =========================

  function showToast(message) {

    toast.textContent = message;

    toast.style.opacity = "1";

    clearTimeout(showToast.timer);

    showToast.timer = setTimeout(() => {

      toast.style.opacity = "0";

    }, 2000);

  }


  // =========================
  // BODY
  // =========================

  function drawBody(bot) {

    ctx.fillStyle = "#555";

    ctx.beginPath();

    ctx.arc(
      bot.x,
      bot.y,
      15,
      0,
      Math.PI * 2
    );

    ctx.fill();

  }


  // =========================
  // COLORS
  // =========================

  function randomColor() {

    const colors = [
      "#e53935",
      "#42a5f5",
      "#ffffff",
      "#43a047",
      "#ff69b4",
      "#9c27b0",
      "#8d6e63",
      "#ff9800",
      "#fdd835",
      "#90a4ae"
    ];

    return colors[
      Math.floor(Math.random() * colors.length)
    ];

  }

});
```
