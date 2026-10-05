```javascript
"use strict";

/* =========================================
   BEAN CREW
   PLAYABLE SOCIAL-DEDUCTION PROTOTYPE
========================================= */

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let WIDTH = window.innerWidth;
let HEIGHT = window.innerHeight;

canvas.width = WIDTH;
canvas.height = HEIGHT;

window.addEventListener("resize", () => {
  WIDTH = window.innerWidth;
  HEIGHT = window.innerHeight;

  canvas.width = WIDTH;
  canvas.height = HEIGHT;
});


/* =========================================
   COLORS
========================================= */

const COLORS = {
  red: "#e53945",
  blue: "#3d82f6",
  white: "#eeeeee",
  green: "#3bbb68",
  lime: "#8ed63f",
  pink: "#ff79b8",
  rose: "#d95a79",
  purple: "#915de8",
  brown: "#986b46",
  tan: "#c7a878",
  gray: "#7b8798",
  banana: "#f1d53c",
  orange: "#ee8632",
  yellow: "#f3e650",
  cyan: "#35d4dc"
};

const COLOR_NAMES = Object.keys(COLORS);


/* =========================================
   MAP
========================================= */

const rooms = [

  {
    name: "Cafeteria",
    x: 520,
    y: 250,
    width: 360,
    height: 220
  },

  {
    name: "Weapons",
    x: 930,
    y: 90,
    width: 240,
    height: 180
  },

  {
    name: "O2",
    x: 930,
    y: 300,
    width: 240,
    height: 150
  },

  {
    name: "Navigation",
    x: 1190,
    y: 300,
    width: 270,
    height: 220
  },

  {
    name: "Shields",
    x: 950,
    y: 520,
    width: 250,
    height: 170
  },

  {
    name: "Communications",
    x: 650,
    y: 520,
    width: 240,
    height: 150
  },

  {
    name: "Storage",
    x: 430,
    y: 500,
    width: 230,
    height: 190
  },

  {
    name: "Electrical",
    x: 180,
    y: 500,
    width: 220,
    height: 170
  },

  {
    name: "Lower Engine",
    x: 80,
    y: 300,
    width: 260,
    height: 150
  },

  {
    name: "Upper Engine",
    x: 80,
    y: 90,
    width: 260,
    height: 150
  },

  {
    name: "MedBay",
    x: 350,
    y: 85,
    width: 150,
    height: 155
  },

  {
    name: "Security",
    x: 330,
    y: 300,
    width: 160,
    height: 130
  }

];


/* =========================================
   TASKS
========================================= */

const TASKS = [

  {
    name: "Submit Scan",
    room: "MedBay",
    visual: true
  },

  {
    name: "Clear Asteroids",
    room: "Weapons",
    visual: true
  },

  {
    name: "Clean O2 Filter",
    room: "O2",
    visual: false
  },

  {
    name: "Fix Wiring",
    room: "Electrical",
    visual: false
  },

  {
    name: "Fuel Engines",
    room: "Storage",
    visual: false
  },

  {
    name: "Chart Course",
    room: "Navigation",
    visual: false
  },

  {
    name: "Download Data",
    room: "Communications",
    visual: false
  },

  {
    name: "Prime Shields",
    room: "Shields",
    visual: false
  },

  {
    name: "Align Engine",
    room: "Upper Engine",
    visual: false
  },

  {
    name: "Align Engine",
    room: "Lower Engine",
    visual: false
  }

];


/* =========================================
   GAME STATE
========================================= */

let game = null;

const keys = {};

window.addEventListener("keydown", event => {

  const key = event.key.toLowerCase();

  keys[key] = true;

  if (
    ["w", "a", "s", "d", "e", "q", "r", "m"]
      .includes(key)
  ) {
    event.preventDefault();
  }

});

window.addEventListener("keyup", event => {
  keys[event.key.toLowerCase()] = false;
});


/* =========================================
   UI HELPERS
========================================= */

function show(id) {
  document.getElementById(id).classList.remove("hidden");
}

function hide(id) {
  document.getElementById(id).classList.add("hidden");
}

function toast(message) {

  const element = document.getElementById("toast");

  element.textContent = message;

  element.classList.add("show");

  clearTimeout(game.toastTimer);

  game.toastTimer = setTimeout(() => {
    element.classList.remove("show");
  }, 1800);

}


/* =========================================
   START GAME
========================================= */

document.getElementById("startBtn").onclick = startGame;

function startGame() {

  hide("menu");
  show("game");

  const playerCount =
    Number(document.getElementById("playerCount").value);

  const impostorCount =
    Number(document.getElementById("impostorCount").value);

  const taskCount =
    Number(document.getElementById("taskCount").value);

  const vision =
    Number(document.getElementById("vision").value);

  game = {

    running: true,

    players: [],

    impostorCount,

    taskCount,

    vision,

    cameraX: 0,
    cameraY: 0,

    meeting: false,

    sabotage: null,

    sabotageTime: 0,

    toastTimer: null

  };

  createPlayers(playerCount);

  assignTasks();

  updateHUD();

  requestAnimationFrame(gameLoop);

}


/* =========================================
   CREATE PLAYERS
========================================= */

function createPlayers(count) {

  const player = {

    id: 0,

    name: "YOU",

    x: 700,

    y: 360,

    color: "cyan",

    role: "Crewmate",

    alive: true,

    isPlayer: true,

    speed: 155,

    tasks: [],

    killCooldown: 0,

    venting: false

  };

  game.players.push(player);


  const colors =
    [...COLOR_NAMES]
      .sort(() => Math.random() - .5);


  for (let i = 1; i < count; i++) {

    const spawn = randomSpawn();

    game.players.push({

      id: i,

      name: "Bean " + (i + 1),

      x: spawn.x,

      y: spawn.y,

      color: colors[i - 1],

      role: "Crewmate",

      alive: true,

      isPlayer: false,

      speed: 120 + Math.random() * 30,

      tasks: [],

      killCooldown: 0,

      aiTimer: 0,

      aiX: 0,

      aiY: 0

    });

  }


  /* Pick impostors */

  const shuffled =
    [...game.players]
      .sort(() => Math.random() - .5);

  let impostors = 0;

  for (const player of shuffled) {

    if (impostors >= game.impostorCount)
      break;

    player.role = "Impostor";

    impostors++;

  }


  /* Special roles */

  const specialRoles = [
    "Engineer",
    "Noisemaker",
    "Tracker",
    "Detective",
    "Scientist",
    "Judge"
  ];

  game.players
    .filter(player => player.role === "Crewmate")
    .slice(0, specialRoles.length)
    .forEach((player, index) => {

      player.role = specialRoles[index];

    });


  /* Impostor special roles */

  const specialImpostors = [
    "Viper",
    "Shapeshifter",
    "Phantom"
  ];

  game.players
    .filter(player => player.role === "Impostor")
    .forEach(player => {

      if (Math.random() < .3) {

        player.role =
          specialImpostors[
            Math.floor(
              Math.random() *
              specialImpostors.length
            )
          ];

      }

    });

}


/* =========================================
   RANDOM SPAWN
========================================= */

function randomSpawn() {

  const room =
    rooms[
      Math.floor(Math.random() * rooms.length)
    ];

  return {

    x:
      room.x +
      room.width / 2 +
      (Math.random() - .5) * 80,

    y:
      room.y +
      room.height / 2 +
      (Math.random() - .5) * 80

  };

}


/* =========================================
   TASK ASSIGNMENT
========================================= */

function assignTasks() {

  for (const player of game.players) {

    if (isImpostor(player)) {

      /*
       IMPORTANT:
       Impostors DO NOT receive tasks.
      */

      player.tasks = [];

      continue;

    }

    const shuffled =
      [...TASKS]
        .sort(() => Math.random() - .5);

    player.tasks =
      shuffled
        .slice(0, game.taskCount)
        .map((task, index) => ({
          ...task,
          id: index,
          completed: false
        }));

  }

}


/* =========================================
   ROLE HELPERS
========================================= */

function isImpostor(player) {

  return [
    "Impostor",
    "Viper",
    "Shapeshifter",
    "Phantom"
  ].includes(player.role);

}

function getPlayer() {

  return game.players[0];

}

function aliveCrew() {

  return game.players.filter(
    p => p.alive && !isImpostor(p)
  );

}

function aliveImpostors() {

  return game.players.filter(
    p => p.alive && isImpostor(p)
  );

}


/* =========================================
   ROOM HELPERS
========================================= */

function roomAt(x, y) {

  return rooms.find(room =>

    x > room.x &&
    x < room.x + room.width &&
    y > room.y &&
    y < room.y + room.height

  );

}

function roomName(x, y) {

  const room = roomAt(x, y);

  return room ? room.name : "Hallway";

}


/* =========================================
   UPDATE HUD
========================================= */

function updateHUD() {

  const player = getPlayer();

  document.getElementById("roleText")
    .textContent =
    player.role.toUpperCase();


  document.getElementById("roleText")
    .style.color =
    isImpostor(player)
      ? "#ff5e67"
      : "#66e8ff";


  const completed =
    player.tasks
      .filter(task => task.completed)
      .length;


  document.getElementById("taskText")
    .textContent =
    completed +
    " / " +
    player.tasks.length;


  document.getElementById("killBtn")
    .classList.toggle(
      "hidden",
      !isImpostor(player)
    );


  document.getElementById("ventBtn")
    .classList.toggle(
      "hidden",
      !(
        isImpostor(player) ||
        player.role === "Engineer"
      )
    );


  if (game.sabotage) {

    show("sabotageBox");

    document.getElementById("sabotageText")
      .textContent =
      game.sabotage.toUpperCase();

  } else {

    hide("sabotageBox");

  }

}


/* =========================================
   GAME LOOP
========================================= */

let lastTime = performance.now();

function gameLoop(time) {

  const delta =
    Math.min(
      .05,
      (time - lastTime) / 1000
    );

  lastTime = time;

  if (game.running) {

    update(delta);

    draw();

  }

  requestAnimationFrame(gameLoop);

}


/* =========================================
   GAME UPDATE
========================================= */

function update(delta) {

  if (game.meeting)
    return;


  const player = getPlayer();


  /* PLAYER MOVEMENT */

  if (player.alive) {

    let x = 0;
    let y = 0;

    if (keys.w) y--;
    if (keys.s) y++;
    if (keys.a) x--;
    if (keys.d) x++;

    const length =
      Math.hypot(x, y) || 1;

    movePlayer(
      player,
      x / length *
      player.speed *
      delta,

      y / length *
      player.speed *
      delta
    );

  }


  /* BOT MOVEMENT */

  for (
    const bot of game.players.slice(1)
  ) {

    if (!bot.alive)
      continue;


    bot.aiTimer -= delta;


    if (bot.aiTimer <= 0) {

      bot.aiTimer =
        .5 +
        Math.random() * 1.5;

      bot.aiX =
        Math.random() * 2 - 1;

      bot.aiY =
        Math.random() * 2 - 1;

    }


    movePlayer(
      bot,

      bot.aiX *
      bot.speed *
      delta,

      bot.aiY *
      bot.speed *
      delta
    );


    /* Bot impostor kills */

    if (isImpostor(bot)) {

      bot.killCooldown -= delta;

      const target =
        game.players.find(target =>

          target.alive &&
          !isImpostor(target) &&
          distance(bot, target) < 50

        );


      if (
        target &&
        bot.killCooldown <= 0 &&
        Math.random() < .12
      ) {

        killPlayer(bot, target);

      }

    }

  }


  /* Sabotage timer */

  if (
    game.sabotage &&
    Date.now() >
    game.sabotageTime
  ) {

    endGame(
      "IMPOSTORS WIN",
      "The sabotage was not fixed in time!"
    );

  }


  checkWin();

  updateHUD();

}


/* =========================================
   MOVEMENT
========================================= */

function movePlayer(player, dx, dy) {

  const newX = player.x + dx;
  const newY = player.y + dy;


  if (
    newX < 30 ||
    newX > 1470 ||
    newY < 30 ||
    newY > 750
  ) {

    return;

  }


  player.x = newX;
  player.y = newY;

}


/* =========================================
   DISTANCE
========================================= */

function distance(a, b) {

  return Math.hypot(
    a.x - b.x,
    a.y - b.y
  );

}


/* =========================================
   KILL
========================================= */

document.getElementById("killBtn")
  .onclick = killNearby;


function killNearby() {

  const player = getPlayer();

  if (
    !isImpostor(player) ||
    !player.alive
  ) {

    return;

  }


  const target =
    game.players
      .filter(
        p =>
          p.alive &&
          !isImpostor(p) &&
          p.id !== player.id
      )
      .sort(
        (a, b) =>
          distance(player, a) -
          distance(player, b)
      )[0];


  if (
    target &&
    distance(player, target) < 75
  ) {

    killPlayer(player, target);

  } else {

    toast("No one is close enough!");

  }

}


/* =========================================
   KILL PLAYER
========================================= */

function killPlayer(killer, target) {

  target.alive = false;

  target.body = true;

  target.deathTime = Date.now();


  /*
   Viper special ability
  */

  if (killer.role === "Viper") {

    target.dissolveTime =
      Date.now() + 6000;

  }


  /*
   Noisemaker
  */

  if (target.role === "Noisemaker") {

    toast(
      "NOISEMAKER ALERT!"
    );

  }


  killer.killCooldown = 15;

  toast(
    killer.name +
    " eliminated someone!"
  );

}


/* =========================================
   REPORT
========================================= */

document.getElementById("reportBtn")
  .onclick = reportBody;


document.getElementById("useBtn")
  .onclick = interact;


document.getElementById("meetingBtn")
  .onclick = () =>
    openMeeting(
      "Emergency meeting called!"
    );


function reportBody() {

  const player = getPlayer();


  const body =
    game.players.find(
      p =>
        !p.alive &&
        p.body &&
        distance(player, p) < 80
    );


  if (body) {

    openMeeting(
      "A body was reported!"
    );

  } else {

    toast(
      "There is no body nearby."
    );

  }

}


/* =========================================
   INTERACT
========================================= */

function interact() {

  const player = getPlayer();


  if (!player.alive)
    return;


  /* BODY */

  const body =
    game.players.find(
      p =>
        !p.alive &&
        p.body &&
        distance(player, p) < 80
    );


  if (body) {

    openMeeting(
      "A body was reported!"
    );

    return;

  }


  /* SABOTAGE */

  if (game.sabotage) {

    fixSabotage();

    return;

  }


  /* TASK */

  const room =
    roomName(
      player.x,
      player.y
    );


  const task =
    player.tasks.find(
      t =>
        !t.completed &&
        t.room === room
    );


  if (task) {

    openTask(task);

    return;

  }


  /* EMERGENCY */

  if (
    room === "Cafeteria" &&
    Math.hypot(
      player.x - 700,
      player.y - 360
    ) < 100
  ) {

    openMeeting(
      "Emergency meeting called!"
    );

    return;

  }


  toast(
    "Nothing to use here."
  );

}


/* =========================================
   TASK
========================================= */

function openTask(task) {

  document.getElementById("taskTitle")
    .textContent =
    task.name;


  document.getElementById("taskDescription")
    .textContent =
    task.visual
      ? "Visual Task — other players can see you doing it!"
      : "Complete this task.";


  show("taskModal");


  const fill =
    document.getElementById("taskFill");


  let progress = 0;


  const interval =
    setInterval(() => {

      progress +=
        Math.random() * 12;

      if (progress >= 100) {

        progress = 100;

        clearInterval(interval);

      }

      fill.style.width =
        progress + "%";

    }, 100);


  document.getElementById("finishTask")
    .onclick = () => {

      if (progress < 100) {

        toast(
          "You haven't finished yet!"
        );

        return;

      }


      task.completed = true;

      hide("taskModal");

      checkWin();

      updateHUD();

    };

}


document
  .querySelector(".closeModal")
  .onclick = () =>
    hide("taskModal");


/* =========================================
   VENT
========================================= */

document.getElementById("ventBtn")
  .onclick = useVent;


function useVent() {

  const player = getPlayer();


  if (
    !isImpostor(player) &&
    player.role !== "Engineer"
  ) {

    return;

  }


  player.venting =
    !player.venting;


  if (player.venting) {

    toast(
      "You entered the vent!"
    );

  } else {

    toast(
      "You left the vent!"
    );

  }

}


/* =========================================
   MEETING
========================================= */

function openMeeting(reason) {

  if (
    game.meeting ||
    !game.running
  ) {

    return;

  }


  game.meeting = true;


  document.getElementById("meetingReason")
    .textContent =
    reason;


  const grid =
    document.getElementById("voteGrid");


  grid.innerHTML = "";


  game.players
    .filter(p => p.alive)
    .forEach(player => {

      const button =
        document.createElement("button");


      button.className =
        "voteButton";


      button.textContent =
        player.name;


      button.onclick =
        () => vote(player.id);


      grid.appendChild(button);

    });


  show("meetingModal");

}


/* =========================================
   VOTING
========================================= */

function vote(playerID) {

  const alive =
    game.players.filter(
      p => p.alive
    );


  const votes = {};


  alive.forEach(
    p => votes[p.id] = 0
  );


  votes.skip = 0;


  votes[playerID]++;


  /* BOT VOTES */

  for (
    const bot of alive.filter(
      p => !p.isPlayer
    )
  ) {

    const candidates =
      alive.filter(
        p => p.id !== bot.id
      );


    if (
      candidates.length &&
      Math.random() < .7
    ) {

      const target =
        candidates[
          Math.floor(
            Math.random() *
            candidates.length
          )
        ];


      votes[target.id]++;

    } else {

      votes.skip++;

    }

  }


  let highest = -1;
  let selected = null;


  for (
    const [id, amount]
    of Object.entries(votes)
  ) {

    if (
      id !== "skip" &&
      amount > highest
    ) {

      highest = amount;

      selected =
        game.players.find(
          p => p.id === Number(id)
        );

    }

  }


  if (!selected) {

    document.getElementById("voteStatus")
      .textContent =
      "Nobody was ejected.";

  } else {

    selected.alive = false;

    selected.body = false;

    document.getElementById("voteStatus")
      .textContent =
      selected.name +
      " was ejected! " +
      (
        isImpostor(selected)
          ? "They were an Impostor!"
          : "They were not an Impostor."
      );

  }


  setTimeout(() => {

    hide("meetingModal");

    game.meeting = false;

    checkWin();

  }, 1600);

}


document.getElementById("skipVote")
  .onclick = () =>
    vote(-1);


/* =========================================
   SABOTAGE
========================================= */

function sabotage(type) {

  if (game.sabotage)
    return;


  game.sabotage = type;


  game.sabotageTime =
    Date.now() + 30000;


  toast(
    type +
    " SABOTAGED!"
  );

}


function fixSabotage() {

  game.sabotage = null;

  game.sabotageTime = 0;

  toast(
    "Sabotage fixed!"
  );

}


/* Random bot sabotage */

setInterval(() => {

  if (
    !game ||
    !game.running ||
    game.meeting
  ) {

    return;

  }


  if (
    aliveImpostors().length &&
    Math.random() < .15
  ) {

    const types = [
      "LIGHTS",
      "COMMUNICATIONS",
      "O2",
      "REACTOR"
    ];


    sabotage(
      types[
        Math.floor(
          Math.random() *
          types.length
        )
      ]
    );

  }

}, 4000);


/* =========================================
   WIN CONDITIONS
========================================= */

function checkWin() {

  if (!game.running)
    return;


  const crew =
    aliveCrew().length;


  const impostors =
    aliveImpostors().length;


  /* All impostors gone */

  if (impostors === 0) {

    endGame(
      "CREWMATES WIN",
      "All impostors have been eliminated!"
    );

    return;

  }


  /* Impostors reach parity */

  if (impostors >= crew) {

    endGame(
      "IMPOSTORS WIN",
      "The impostors have reached parity with the crew!"
    );

    return;

  }


  /* Tasks */

  const player =
    getPlayer();


  if (
    !isImpostor(player) &&
    player.tasks.length > 0 &&
    player.tasks.every(
      task => task.completed
    )
  ) {

    endGame(
      "CREWMATES WIN",
      "All of your tasks are complete!"
    );

  }

}


/* =========================================
   END GAME
========================================= */

function endGame(title, reason) {

  game.running = false;


  document.getElementById("winTitle")
    .textContent =
    title;


  document.getElementById("winReason")
    .textContent =
    reason;


  show("winScreen");

}


/* =========================================
   PLAY AGAIN
========================================= */

document.getElementById("playAgain")
  .onclick = () => {

    hide("winScreen");

    hide("game");

    show("menu");

  };


/* =========================================
   DRAW MAP
========================================= */

function draw() {

  ctx.clearRect(
    0,
    0,
    WIDTH,
    HEIGHT
  );


  const player =
    getPlayer();


  game.cameraX =
    player.x -
    WIDTH / 2;


  game.cameraY =
    player.y -
    HEIGHT / 2;


  ctx.save();


  ctx.translate(
    -game.cameraX,
    -game.cameraY
  );


  drawMap();

  drawBodies();

  drawPlayers();

  drawVents();


  ctx.restore();


  drawVision();

}


/* =========================================
   DRAW MAP
========================================= */

function drawMap() {

  ctx.fillStyle =
    "#0c111b";


  ctx.fillRect(
    0,
    0,
    1500,
    780
  );


  /* HALLWAYS */

  ctx.strokeStyle =
    "#1b2638";

  ctx.lineWidth = 48;

  ctx.lineCap = "round";


  const hallways = [

    [250,165,700,360],

    [700,360,1050,185],

    [700,360,1050,375],

    [700,360,1080,605],

    [700,360,550,595],

    [550,595,290,585],

    [290,585,210,375],

    [210,375,210,165],

    [210,165,430,165],

    [430,165,430,320],

    [430,320,700,360],

    [1050,375,1330,410]

  ];


  hallways.forEach(path => {

    ctx.beginPath();

    ctx.moveTo(
      path[0],
      path[1]
    );

    ctx.lineTo(
      path[2],
      path[3]
    );

    ctx.stroke();

  });


  /* ROOMS */

  rooms.forEach(room => {

    ctx.fillStyle =
      "#263246";

    ctx.strokeStyle =
      "#45536d";

    ctx.lineWidth = 3;


    roundRect(
      room.x,
      room.y,
      room.width,
      room.height,
      15
    );


    ctx.fill();

    ctx.stroke();


    ctx.fillStyle =
      "#d7dfed";

    ctx.font =
      "bold 14px Arial";

    ctx.textAlign =
      "center";


    ctx.fillText(
      room.name,
      room.x +
      room.width / 2,
      room.y + 22
    );

  });


  /* CAFETERIA TABLE */

  ctx.fillStyle =
    "#56657b";


  ctx.beginPath();

  ctx.ellipse(
    700,
    360,
    80,
    38,
    0,
    0,
    Math.PI * 2
  );

  ctx.fill();

}


/* =========================================
   ROUND RECT
========================================= */

function roundRect(
  x,
  y,
  width,
  height,
  radius
) {

  ctx.beginPath();

  ctx.moveTo(
    x + radius,
    y
  );

  ctx.arcTo(
    x + width,
    y,
    x + width,
    y + height,
    radius
  );

  ctx.arcTo(
    x + width,
    y + height,
    x,
    y + height,
    radius
  );

  ctx.arcTo(
    x,
    y + height,
    x,
    y,
    radius
  );

  ctx.arcTo(
    x,
    y,
    x + width,
    y,
    radius
  );

}


/* =========================================
   DRAW PLAYERS
========================================= */

function drawPlayers() {

  for (
    const player of game.players
  ) {

    if (
      !player.alive ||
      player.venting
    ) {

      continue;

    }


    drawBean(player);

  }

}


/* =========================================
   DRAW BEAN
========================================= */

function drawBean(player) {

  ctx.save();


  ctx.translate(
    player.x,
    player.y
  );


  /* Body */

  ctx.fillStyle =
    COLORS[player.color];


  roundRect(
    -14,
    -22,
    28,
    43,
    12
  );


  ctx.fill();


  /* Goggles */

  ctx.fillStyle =
    "#c8f2ff";


  ctx.strokeStyle =
    "#162c3b";

  ctx.lineWidth = 2;


  ctx.beginPath();

  ctx.ellipse(
    2,
    -8,
    11,
    7,
    0,
    0,
    Math.PI * 2
  );

  ctx.fill();

  ctx.stroke();


  /* Backpack */

  ctx.fillStyle =
    COLORS[player.color];


  ctx.fillRect(
    -20,
    -5,
    8,
    18
  );


  /* Highlight player */

  if (player.isPlayer) {

    ctx.strokeStyle =
      "#ffffff";

    ctx.lineWidth = 2;

    ctx.beginPath();

    ctx.arc(
      0,
      0,
      25,
      0,
      Math.PI * 2
    );

    ctx.stroke();

  }


  /* Name */

  ctx.fillStyle =
    "white";

  ctx.font =
    "11px Arial";

  ctx.textAlign =
    "center";


  ctx.fillText(
    player.name,
    0,
    36
  );


  ctx.restore();

}


/* =========================================
   DRAW BODIES
========================================= */

function drawBodies() {

  for (
    const player of game.players
  ) {

    if (
      player.alive ||
      !player.body
    ) {

      continue;

    }


    /* Viper dissolve */

    if (
      player.dissolveTime &&
      Date.now() >
      player.dissolveTime
    ) {

      player.body = false;

      continue;

    }


    ctx.save();


    ctx.translate(
      player.x,
      player.y
    );


    ctx.fillStyle =
      "#d63b45";


    ctx.beginPath();

    ctx.ellipse(
      -7,
      5,
      14,
      8,
      0,
      0,
      Math.PI * 2
    );

    ctx.fill();


    ctx.fillStyle =
      COLORS[player.color];


    ctx.fillRect(
      -13,
      -5,
      20,
      10
    );


    ctx.restore();

  }

}


/* =========================================
   DRAW VENTS
========================================= */

function drawVents() {

  const vents = [

    [430,320],

    [550,595],

    [1040,375],

    [210,375],

    [1080,605]

  ];


  vents.forEach(
    ([x,y]) => {

      ctx.fillStyle =
        "#080b11";

      ctx.strokeStyle =
        "#6c788d";

      ctx.lineWidth = 3;


      ctx.beginPath();

      ctx.ellipse(
        x,
        y,
        22,
        10,
        0,
        0,
        Math.PI * 2
      );

      ctx.fill();

      ctx.stroke();

    }
  );

}


/* =========================================
   VISION
========================================= */

function drawVision() {

  const player =
    getPlayer();


  if (!player.alive)
    return;


  let radius =
    game.vision;


  /* LIGHTS SABOTAGE */

  if (
    game.sabotage ===
    "LIGHTS"
  ) {

    radius *= .4;

  }


  const screenX =
    player.x -
    game.cameraX;


  const screenY =
    player.y -
    game.cameraY;


  const gradient =
    ctx.createRadialGradient(
      screenX,
      screenY,
      radius * .35,
      screenX,
      screenY,
      radius
    );


  gradient.addColorStop(
    0,
    "rgba(0,0,0,0)"
  );


  gradient.addColorStop(
    1,
    "rgba(0,0,0,.82)"
  );


  ctx.fillStyle =
    gradient;


  ctx.fillRect(
    0,
    0,
    WIDTH,
    HEIGHT
  );

}


/* =========================================
   KEYBOARD CONTROLS
========================================= */

setInterval(() => {

  if (
    !game ||
    !game.running
  ) {

    return;

  }


  if (keys.e) {

    keys.e = false;

    interact();

  }


  if (keys.q) {

    keys.q = false;

    killNearby();

  }


  if (keys.r) {

    keys.r = false;

    reportBody();

  }


  if (keys.m) {

    keys.m = false;

    openMeeting(
      "Emergency meeting called!"
    );

  }

}, 80);

})();
```
