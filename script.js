/* =========================================================
   AMONG US — THE SKELD
   Standalone script.js
   Works with the HTML structure you provided.
   ========================================================= */

"use strict";

/* =========================
   HELPERS
========================= */

const $ = (id) => document.getElementById(id);

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

const rand = (min, max) =>
    Math.random() * (max - min) + min;

const choose = (arr) =>
    arr[Math.floor(Math.random() * arr.length)];

const distance = (a, b) =>
    Math.hypot(a.x - b.x, a.y - b.y);

const COLORS = {
    red: "#c51111",
    blue: "#132ed1",
    green: "#117f2d",
    lime: "#50ef39",
    pink: "#ed54ba",
    purple: "#6b2fbc",
    brown: "#71491e",
    tan: "#92877d",
    grey: "#758593",
    white: "#d6e0f0",
    orange: "#ef7d0e",
    yellow: "#f5f557",
    cyan: "#38fedc"
};

/* =========================
   GAME SETTINGS
========================= */

const DEFAULT_SETTINGS = {
    players: 10,
    impostors: 2,
    vision: 1,
    speed: 1,
    tasks: 4,
    killCooldown: 25,
    ventCooldown: 15
};

let settings = { ...DEFAULT_SETTINGS };

/* =========================
   GAME STATE
========================= */

const Game = {
    running: false,
    state: "menu",

    time: 0,

    player: null,
    players: [],

    bodies: [],

    completedTasks: 0,
    totalTasks: 0,

    sabotage: null,

    meeting: false,
    meetingTimer: 0,

    doorsClosed: false,
    doorTimer: 0,

    messages: [],

    cameraOpen: false,
    mapOpen: false,

    particles: [],

    lastTime: 0
};

/* =========================
   MAP
========================= */

const ROOMS = [
    { name: "Cafeteria", x: 500, y: 30, w: 400, h: 220 },
    { name: "Weapons", x: 1000, y: 60, w: 220, h: 170 },
    { name: "O2", x: 1000, y: 270, w: 120, h: 100 },
    { name: "Navigation", x: 1260, y: 330, w: 140, h: 160 },
    { name: "Shields", x: 1050, y: 600, w: 220, h: 180 },
    { name: "Comms", x: 720, y: 680, w: 160, h: 120 },
    { name: "Storage", x: 470, y: 520, w: 230, h: 250 },
    { name: "Admin", x: 760, y: 380, w: 200, h: 140 },
    { name: "Electrical", x: 310, y: 560, w: 140, h: 140 },
    { name: "Lower Engine", x: 60, y: 600, w: 220, h: 200 },
    { name: "Security", x: 300, y: 350, w: 120, h: 160 },
    { name: "Reactor", x: 40, y: 330, w: 180, h: 200 },
    { name: "Upper Engine", x: 60, y: 60, w: 220, h: 200 },
    { name: "Medbay", x: 330, y: 90, w: 150, h: 150 }
];

const TASK_LOCATIONS = [
    ["Swipe Card", 920, 410],
    ["Scan", 400, 210],
    ["Asteroids", 1150, 100],
    ["Fix Wiring", 350, 600],
    ["Download Data", 570, 70],
    ["Prime Shields", 1220, 740],
    ["Align Engine", 110, 120],
    ["Empty Garbage", 650, 570],
    ["Calibrate Distributor", 420, 660],
    ["Chart Course", 1360, 380],
    ["Fuel Engines", 520, 730],
    ["Unlock Manifolds", 80, 400],
    ["Clean O2 Filter", 1090, 350],
    ["Inspect Sample", 360, 130],
    ["Upload Data", 860, 440]
];

/* =========================
   ROLES
========================= */

const CREWMATE_ROLES = [
    "Crewmate",
    "Engineer",
    "Scientist",
    "Tracker",
    "Detective"
];

const IMPOSTOR_ROLES = [
    "Impostor",
    "Viper",
    "Shapeshifter",
    "Phantom"
];

/* =========================
   PLAYER CREATION
========================= */

function createPlayer(index, color, impostor) {
    const player = {
        id: index,

        name:
            index === 0
                ? "You"
                : `Player ${index}`,

        color,

        x: 700 + rand(-100, 100),
        y: 150 + rand(-40, 40),

        speed: 150,

        alive: true,

        impostor,

        role: impostor
            ? choose(IMPOSTOR_ROLES)
            : choose(CREWMATE_ROLES),

        tasks: [],

        taskProgress: 0,

        killCooldown: 0,

        ventCooldown: 0,

        venting: false,

        invisible: false,

        shielded: false,

        target: null,

        moving: false,

        direction: 1,

        aiTimer: rand(0, 2),

        aiTarget: null
    };

    if (index === 0) {
        player.role = impostor ? choose(IMPOSTOR_ROLES) : choose(CREWMATE_ROLES);
    }

    return player;
}

/* =========================
   START GAME
========================= */

function startGame() {

    if (Game.running) return;

    settings.players =
        Number($("s_n")?.value || DEFAULT_SETTINGS.players);

    settings.impostors =
        Number($("s_imp")?.value || DEFAULT_SETTINGS.impostors);

    settings.vision =
        Number($("s_vision")?.value || DEFAULT_SETTINGS.vision);

    settings.speed =
        Number($("s_speed")?.value || DEFAULT_SETTINGS.speed);

    settings.tasks =
        Number($("s_tasks")?.value || DEFAULT_SETTINGS.tasks);

    settings.killCooldown =
        Number($("s_kcd")?.value || DEFAULT_SETTINGS.killCooldown);

    settings.ventCooldown =
        Number($("s_engCd")?.value || DEFAULT_SETTINGS.ventCooldown);

    Game.running = true;
    Game.state = "playing";
    Game.time = 0;

    Game.players = [];
    Game.bodies = [];

    Game.completedTasks = 0;
    Game.totalTasks = 0;

    Game.sabotage = null;

    Game.meeting = false;

    const colors = Object.keys(COLORS);

    for (let i = 0; i < settings.players; i++) {

        const impostor =
            i < settings.impostors;

        const player = createPlayer(
            i,
            colors[i % colors.length],
            impostor
        );

        if (!impostor) {

            const shuffled =
                [...TASK_LOCATIONS]
                    .sort(() => Math.random() - 0.5);

            player.tasks =
                shuffled
                    .slice(0, settings.tasks)
                    .map(task => ({
                        name: task[0],
                        x: task[1],
                        y: task[2],
                        completed: false
                    }));

            Game.totalTasks += player.tasks.length;
        }

        Game.players.push(player);
    }

    Game.player = Game.players[0];

    $("menu")?.classList.add("hide");
    $("intro")?.classList.remove("hide");

    if ($("intro")) {

        $("intro").innerHTML = `
            <div class="pn" style="text-align:center">
                <h1 style="font-size:42px">
                    ${Game.player.impostor ? "IMPOSTOR" : "CREWMATE"}
                </h1>

                <h2>${Game.player.role}</h2>

                <p>
                    ${
                        Game.player.impostor
                            ? "Eliminate the crew and sabotage the ship."
                            : "Complete your tasks and find the impostor."
                    }
                </p>
            </div>
        `;

        setTimeout(() => {

            $("intro").classList.add("hide");

            $("hud")?.classList.remove("hide");

            showMessage("Game started!");

        }, 2200);
    }

    createButtons();

    updateHUD();
}

/* =========================
   BUTTONS
========================= */

function createButtons() {

    const container = $("btns");

    if (!container) return;

    container.innerHTML = `
        <button onclick="useAction()">USE</button>
        <button onclick="reportBody()">REPORT</button>
        <button onclick="killPlayer()">KILL</button>
        <button onclick="toggleVent()">VENT</button>
        <button onclick="useAbility()">ABILITY</button>
        <button onclick="toggleMap()">MAP</button>
    `;
}

/* =========================
   MESSAGE SYSTEM
========================= */

function showMessage(text, duration = 4) {

    Game.messages.push({
        text,
        time: duration
    });
}

function updateMessages(dt) {

    Game.messages.forEach(message => {
        message.time -= dt;
    });

    Game.messages =
        Game.messages.filter(message => message.time > 0);

    if ($("msgs")) {

        $("msgs").innerHTML =
            Game.messages
                .slice(-3)
                .map(message => `<div>${message.text}</div>`)
                .join("");
    }
}

/* =========================
   PLAYER MOVEMENT
========================= */

const keys = {};

document.addEventListener("keydown", event => {

    const key = event.key.toLowerCase();

    keys[key] = true;

    if (!Game.running) return;

    if (key === "e") useAction();
    if (key === "q") killPlayer();
    if (key === "r") reportBody();
    if (key === "v") toggleVent();
    if (key === "f") useAbility();
    if (key === "m") toggleMap();

});

document.addEventListener("keyup", event => {

    keys[event.key.toLowerCase()] = false;

});

function updatePlayerMovement(dt) {

    const player = Game.player;

    if (!player || !player.alive) return;

    if (player.venting) return;

    let dx = 0;
    let dy = 0;

    if (keys.w) dy -= 1;
    if (keys.s) dy += 1;
    if (keys.a) dx -= 1;
    if (keys.d) dx += 1;

    if (dx === 0 && dy === 0) {

        player.moving = false;
        return;
    }

    player.moving = true;

    const length = Math.hypot(dx, dy);

    dx /= length;
    dy /= length;

    player.x +=
        dx *
        player.speed *
        settings.speed *
        dt;

    player.y +=
        dy *
        player.speed *
        settings.speed *
        dt;

    player.x = clamp(player.x, 20, 1430);
    player.y = clamp(player.y, 20, 830);

    if (dx !== 0) {
        player.direction = dx > 0 ? 1 : -1;
    }
}

/* =========================
   TASKS
========================= */

function useAction() {

    const player = Game.player;

    if (!player || !player.alive) return;

    const nearbyTask =
        player.tasks.find(task =>
            !task.completed &&
            Math.hypot(
                task.x - player.x,
                task.y - player.y
            ) < 70
        );

    if (nearbyTask) {

        nearbyTask.completed = true;

        Game.completedTasks++;

        showMessage(
            `Task complete: ${nearbyTask.name}`
        );

        checkWin();

        updateHUD();

        return;
    }

    if (Game.sabotage === "lights") {

        fixLights();

        return;
    }

    if (Game.sabotage === "reactor") {

        fixSabotage();

        return;
    }

    if (Game.sabotage === "o2") {

        fixSabotage();

        return;
    }

    showMessage("Nothing to use here.");
}

/* =========================
   KILL SYSTEM
========================= */

function killPlayer() {

    const player = Game.player;

    if (!player ||
        !player.alive ||
        !player.impostor ||
        player.killCooldown > 0 ||
        player.venting) {

        return;
    }

    const targets =
        Game.players.filter(other =>
            other.alive &&
            !other.impostor &&
            other !== player &&
            distance(player, other) < 85
        );

    if (targets.length === 0) {

        showMessage("No target nearby.");

        return;
    }

    const target =
        targets.sort(
            (a, b) =>
                distance(player, a) -
                distance(player, b)
        )[0];

    kill(target);

    player.killCooldown =
        settings.killCooldown;
}

function kill(target) {

    target.alive = false;

    Game.bodies.push({
        x: target.x,
        y: target.y,
        color: target.color,
        playerId: target.id
    });

    showMessage(
        `${target.name} was eliminated.`
    );

    createParticles(
        target.x,
        target.y,
        "#ff3333",
        18
    );

    checkWin();
}

/* =========================
   REPORT BODY
========================= */

function reportBody() {

    const player = Game.player;

    if (!player || !player.alive) return;

    const body =
        Game.bodies.find(body =>
            Math.hypot(
                body.x - player.x,
                body.y - player.y
            ) < 100
        );

    if (!body) {

        showMessage("No body nearby.");

        return;
    }

    startMeeting(
        "Body reported!"
    );
}

/* =========================
   MEETINGS
========================= */

function startMeeting(title) {

    Game.meeting = true;
    Game.state = "meeting";
    Game.meetingTimer = 30;

    $("meet")?.classList.remove("hide");

    if ($("mh")) {
        $("mh").textContent = title;
    }

    populateMeeting();

    showMessage("Meeting started!");
}

function populateMeeting() {

    const rows = $("rows");

    if (!rows) return;

    rows.innerHTML = "";

    Game.players.forEach(player => {

        if (!player.alive) return;

        const row =
            document.createElement("div");

        row.className = "row";

        row.innerHTML = `
            <span
                class="dot"
                style="background:${COLORS[player.color]}"
            ></span>

            <b>${player.name}</b>

            <span style="flex:1">
                ${player.role === "Crewmate"
                    ? ""
                    : ""}
            </span>

            <button onclick="votePlayer(${player.id})">
                Vote
            </button>
        `;

        rows.appendChild(row);
    });
}

function votePlayer(id) {

    const target = Game.players[id];

    if (!target || !target.alive) return;

    const impostor = target.impostor;

    target.alive = false;

    showMessage(
        `${target.name} was voted out.`
    );

    $("meet")?.classList.add("hide");

    Game.meeting = false;
    Game.state = "playing";

    Game.bodies = [];

    checkWin();

    if (!Game.running) return;

    showMessage(
        impostor
            ? `${target.name} was an Impostor!`
            : `${target.name} was not an Impostor.`
    );
}

/* =========================
   VENTS
========================= */

function toggleVent() {

    const player = Game.player;

    if (!player || !player.alive) return;

    if (
        !player.impostor &&
        player.role !== "Engineer"
    ) {

        showMessage("You cannot use vents.");

        return;
    }

    if (player.ventCooldown > 0) {

        showMessage(
            `Vent cooldown: ${Math.ceil(player.ventCooldown)}s`
        );

        return;
    }

    player.venting =
        !player.venting;

    if (player.venting) {

        showMessage("You entered a vent.");

    } else {

        player.ventCooldown =
            settings.ventCooldown;

        showMessage("You left the vent.");
    }
}

/* =========================
   ABILITIES
========================= */

function useAbility() {

    const player = Game.player;

    if (!player || !player.alive) return;

    if (player.role === "Scientist") {

        showMessage(
            "Vitals: " +
            Game.players
                .map(p =>
                    `${p.name}: ${p.alive ? "ALIVE" : "DEAD"}`
                )
                .join(" • ")
        );

        return;
    }

    if (player.role === "Tracker") {

        const targets =
            Game.players.filter(p =>
                p.alive &&
                p !== player
            );

        if (targets.length) {

            const target =
                targets
                    .sort(
                        (a, b) =>
                            distance(player, a) -
                            distance(player, b)
                    )[0];

            showMessage(
                `${target.name} is near ${getRoom(target.x, target.y)}.`
            );
        }

        return;
    }

    if (player.role === "Shapeshifter") {

        const target =
            choose(
                Game.players.filter(
                    p => p !== player && p.alive
                )
            );

        if (target) {

            player.color = target.color;

            showMessage(
                `You shapeshifted into ${target.name}.`
            );
        }

        return;
    }

    if (player.role === "Phantom") {

        player.invisible = true;

        showMessage("You became invisible!");

        setTimeout(() => {

            if (player) {
                player.invisible = false;
            }

        }, 8000);

        return;
    }

    showMessage("Your role has no active ability.");
}

/* =========================
   SABOTAGE
========================= */

function sabotage(type) {

    const player = Game.player;

    if (!player || !player.impostor) return;

    if (Game.sabotage) {

        showMessage(
            "A sabotage is already active."
        );

        return;
    }

    Game.sabotage = type;

    if (type === "doors") {

        Game.doorsClosed = true;
        Game.doorTimer = 10;

        showMessage(
            "🚪 Doors closed!"
        );

        return;
    }

    showMessage(
        `⚠ ${type.toUpperCase()} SABOTAGED!`
    );
}

function fixLights() {

    if (Game.sabotage !== "lights") return;

    Game.sabotage = null;

    showMessage(
        "💡 Lights fixed!"
    );
}

function fixSabotage() {

    if (
        Game.sabotage !== "reactor" &&
        Game.sabotage !== "o2"
    ) return;

    Game.sabotage = null;

    showMessage(
        "Sabotage fixed!"
    );
}

/* =========================
   AI
========================= */

function updateBots(dt) {

    Game.players.forEach(bot => {

        if (bot === Game.player) return;

        if (!bot.alive) return;

        bot.aiTimer -= dt;

        if (bot.aiTimer > 0) return;

        bot.aiTimer =
            rand(1, 3);

        const target =
            choose(
                Game.players.filter(
                    p => p !== bot && p.alive
                )
            );

        if (!target) return;

        const dx =
            target.x - bot.x;

        const dy =
            target.y - bot.y;

        const d =
            Math.hypot(dx, dy);

        if (d > 70) {

            bot.x +=
                dx / d *
                bot.speed *
                dt;

            bot.y +=
                dy / d *
                bot.speed *
                dt;

        } else if (
            bot.impostor &&
            !target.impostor
        ) {

            if (Math.random() < 0.35) {

                kill(target);
            }
        }
    });
}

/* =========================
   WIN CONDITIONS
========================= */

function checkWin() {

    const impostors =
        Game.players.filter(
            p => p.alive && p.impostor
        ).length;

    const crew =
        Game.players.filter(
            p => p.alive && !p.impostor
        ).length;

    if (impostors === 0) {

        endGame(
            "CREWMATES WIN!",
            "All impostors have been eliminated."
        );

        return;
    }

    if (impostors >= crew) {

        endGame(
            "IMPOSTORS WIN!",
            "The impostors have taken control."
        );

        return;
    }

    if (
        Game.completedTasks >=
        Game.totalTasks
    ) {

        endGame(
            "CREWMATES WIN!",
            "All tasks have been completed."
        );
    }
}

function endGame(title, reason) {

    Game.running = false;
    Game.state = "end";

    $("hud")?.classList.add("hide");
    $("meet")?.classList.add("hide");
    $("end")?.classList.remove("hide");

    if ($("end")) {

        $("end").innerHTML = `
            <div class="pn" style="text-align:center">

                <h1 style="font-size:48px">
                    ${title}
                </h1>

                <h2>${reason}</h2>

                <p>
                    Impostors:
                    ${Game.players
                        .filter(p => p.impostor)
                        .map(p => p.name)
                        .join(", ")}
                </p>

                <button onclick="location.reload()">
                    PLAY AGAIN
                </button>

            </div>
        `;
    }
}

/* =========================
   ROOM DETECTION
========================= */

function getRoom(x, y) {

    for (const room of ROOMS) {

        if (
            x >= room.x &&
            x <= room.x + room.w &&
            y >= room.y &&
            y <= room.y + room.h
        ) {

            return room.name;
        }
    }

    return "Hallway";
}

/* =========================
   PARTICLES
========================= */

function createParticles(
    x,
    y,
    color,
    amount = 10
) {

    for (let i = 0; i < amount; i++) {

        Game.particles.push({

            x,
            y,

            vx: rand(-100, 100),
            vy: rand(-100, 100),

            life: 1,

            color
        });
    }
}

function updateParticles(dt) {

    Game.particles.forEach(p => {

        p.x += p.vx * dt;
        p.y += p.vy * dt;

        p.life -= dt;
    });

    Game.particles =
        Game.particles.filter(
            p => p.life > 0
        );
}

/* =========================
   MAP TOGGLE
========================= */

function toggleMap() {

    Game.mapOpen =
        !Game.mapOpen;
}

/* =========================
   HUD
========================= */

function updateHUD() {

    const player = Game.player;

    if (!player) return;

    if ($("role")) {

        $("role").innerHTML = `
            <b style="
                color:${player.impostor
                    ? "#ff4444"
                    : "#55ccff"}
            ">
                ${player.role}
            </b>
            <br>
            ${player.impostor
                ? `Kill: ${
                    player.killCooldown > 0
                        ? Math.ceil(player.killCooldown) + "s"
                        : "READY"
                  }`
                : "Complete your tasks"}
        `;
    }

    if ($("tasks")) {

        $("tasks").innerHTML = `
            <b>
                ${player.impostor
                    ? "FAKE TASKS"
                    : "TASKS"}
            </b>

            <br>

            ${
                player.tasks.length
                    ? player.tasks
                        .map(task => `
                            <div style="
                                opacity:${task.completed ? ".4" : "1"}
                            ">
                                ${
                                    task.completed
                                        ? "✔"
                                        : "•"
                                }
                                ${task.name}
                            </div>
                        `)
                        .join("")
                    : "No tasks"
            }

            <div id="bar">
                <span
                    id="barf"
                    style="
                        width:${
                            Game.totalTasks === 0
                                ? 0
                                : (
                                    Game.completedTasks /
                                    Game.totalTasks *
                                    100
                                )
                        }%
                    "
                ></span>
            </div>
        `;
    }

    if ($("alert")) {

        if (Game.sabotage) {

            $("alert").textContent =
                `⚠ ${Game.sabotage.toUpperCase()} SABOTAGE`;
        } else {

            $("alert").textContent = "";
        }
    }
}

/* =========================
   RENDERING
========================= */

const canvas = $("c");

const ctx =
    canvas?.getContext("2d");

function resizeCanvas() {

    if (!canvas) return;

    canvas.width =
        window.innerWidth;

    canvas.height =
        window.innerHeight;
}

window.addEventListener(
    "resize",
    resizeCanvas
);

resizeCanvas();

/* =========================
   DRAW WORLD
========================= */

function drawWorld() {

    if (!ctx || !Game.player) return;

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.fillStyle = "#05060d";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    const player = Game.player;

    const zoom = 1;

    ctx.save();

    ctx.translate(
        canvas.width / 2 - player.x * zoom,
        canvas.height / 2 - player.y * zoom
    );

    ctx.scale(
        zoom,
        zoom
    );

    drawMap();
    drawTasks();
    drawBodies();
    drawPlayers();
    drawParticles();

    ctx.restore();

    drawVision();

    if (Game.mapOpen) {

        drawMiniMap();
    }
}

/* =========================
   MAP DRAWING
========================= */

function drawMap() {

    ROOMS.forEach(room => {

        ctx.fillStyle =
            "#283254";

        ctx.fillRect(
            room.x,
            room.y,
            room.w,
            room.h
        );

        ctx.strokeStyle =
            "#6474ad";

        ctx.lineWidth = 6;

        ctx.strokeRect(
            room.x,
            room.y,
            room.w,
            room.h
        );

        ctx.fillStyle =
            "#8fa0d8";

        ctx.font =
            "14px system-ui";

        ctx.textAlign =
            "left";

        ctx.fillText(
            room.name,
            room.x + 10,
            room.y + 22
        );
    });
}

/* =========================
   TASK DRAWING
========================= */

function drawTasks() {

    const player = Game.player;

    if (!player) return;

    if (
        player.impostor &&
        Game.sabotage === "comms"
    ) return;

    player.tasks.forEach(task => {

        if (task.completed) return;

        const pulse =
            10 +
            Math.sin(Game.time * 5) * 3;

        ctx.strokeStyle =
            "#ffe44d";

        ctx.lineWidth = 3;

        ctx.beginPath();

        ctx.arc(
            task.x,
            task.y,
            pulse,
            0,
            Math.PI * 2
        );

        ctx.stroke();

        ctx.fillStyle =
            "#ffe44d";

        ctx.font =
            "bold 18px system-ui";

        ctx.textAlign =
            "center";

        ctx.fillText(
            "!",
            task.x,
            task.y + 6
        );
    });
}

/* =========================
   BODY DRAWING
========================= */

function drawBodies() {

    Game.bodies.forEach(body => {

        ctx.fillStyle =
            COLORS[body.color];

        ctx.beginPath();

        ctx.ellipse(
            body.x,
            body.y,
            18,
            11,
            0,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.fillStyle =
            "#a8e8f8";

        ctx.beginPath();

        ctx.ellipse(
            body.x + 7,
            body.y - 3,
            6,
            4,
            0,
            0,
            Math.PI * 2
        );

        ctx.fill();
    });
}

/* =========================
   PLAYER DRAWING
========================= */

function drawPlayers() {

    Game.players.forEach(player => {

        if (!player.alive) return;

        if (
            player !== Game.player &&
            player.invisible
        ) return;

        if (player.venting) return;

        drawBean(player);
    });
}

function drawBean(player) {

    const bob =
        player.moving
            ? Math.sin(Game.time * 12) * 3
            : 0;

    ctx.save();

    ctx.translate(
        player.x,
        player.y + bob
    );

    ctx.globalAlpha =
        player.invisible
            ? 0.2
            : 1;

    /* body */

    ctx.fillStyle =
        COLORS[player.color];

    ctx.beginPath();

    ctx.roundRect(
        -16,
        -35,
        32,
        42,
        14
    );

    ctx.fill();

    /* legs */

    ctx.fillRect(
        -14,
        3,
        10,
        10
    );

    ctx.fillRect(
        4,
        3,
        10,
        10
    );

    /* visor */

    ctx.fillStyle =
        "#a8e8f8";

    ctx.beginPath();

    ctx.ellipse(
        player.direction * 7,
        -23,
        11,
        7,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();

    /* shine */

    ctx.fillStyle =
        "#ffffff";

    ctx.globalAlpha *= .7;

    ctx.fillRect(
        player.direction * 4,
        -27,
        5,
        2
    );

    ctx.globalAlpha = 1;

    /* player name */

    ctx.fillStyle =
        "#ffffff";

    ctx.font =
        "12px system-ui";

    ctx.textAlign =
        "center";

    ctx.fillText(
        player.name,
        0,
        -50
    );

    /* shield */

    if (player.shielded) {

        ctx.strokeStyle =
            "#55ddff";

        ctx.lineWidth = 3;

        ctx.beginPath();

        ctx.arc(
            0,
            -15,
            30,
            0,
            Math.PI * 2
        );

        ctx.stroke();
    }

    ctx.restore();
}

/* =========================
   PARTICLE DRAWING
========================= */

function drawParticles() {

    Game.particles.forEach(p => {

        ctx.globalAlpha =
            p.life;

        ctx.fillStyle =
            p.color;

        ctx.beginPath();

        ctx.arc(
            p.x,
            p.y,
            4,
            0,
            Math.PI * 2
        );

        ctx.fill();
    });

    ctx.globalAlpha = 1;
}

/* =========================
   VISION EFFECT
========================= */

function drawVision() {

    if (!Game.player) return;

    const player =
        Game.player;

    if (!player.alive) return;

    const vision =
        250 *
        settings.vision *
        (
            Game.sabotage === "lights"
                ? 0.35
                : 1
        );

    const gradient =
        ctx.createRadialGradient(
            canvas.width / 2,
            canvas.height / 2,
            vision * .25,
            canvas.width / 2,
            canvas.height / 2,
            vision
        );

    gradient.addColorStop(
        0,
        "rgba(0,0,0,0)"
    );

    gradient.addColorStop(
        .75,
        "rgba(0,0,0,.45)"
    );

    gradient.addColorStop(
        1,
        "rgba(0,0,0,.88)"
    );

    ctx.fillStyle =
        gradient;

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );
}

/* =========================
   MINI MAP
========================= */

function drawMiniMap() {

    const width = 360;
    const height = 230;

    const x =
        canvas.width -
        width -
        20;

    const y = 20;

    ctx.fillStyle =
        "rgba(5,6,13,.92)";

    ctx.fillRect(
        x,
        y,
        width,
        height
    );

    ctx.strokeStyle =
        "#4cf";

    ctx.lineWidth = 2;

    ctx.strokeRect(
        x,
        y,
        width,
        height
    );

    const scale = .23;

    ROOMS.forEach(room => {

        ctx.fillStyle =
            "#3a4678";

        ctx.fillRect(
            x + room.x * scale,
            y + room.y * scale,
            room.w * scale,
            room.h * scale
        );
    });

    Game.players.forEach(player => {

        if (!player.alive) return;

        ctx.fillStyle =
            COLORS[player.color];

        ctx.beginPath();

        ctx.arc(
            x + player.x * scale,
            y + player.y * scale,
            5,
            0,
            Math.PI * 2
        );

        ctx.fill();
    });
}

/* =========================
   GAME UPDATE
========================= */

function update(dt) {

    if (!Game.running) return;

    Game.time += dt;

    if (Game.state === "playing") {

        updatePlayerMovement(dt);

        updateBots(dt);

        updateParticles(dt);

        updateMessages(dt);

        if (Game.player.killCooldown > 0) {

            Game.player.killCooldown -= dt;
        }

        if (Game.player.ventCooldown > 0) {

            Game.player.ventCooldown -= dt;
        }

        if (Game.doorsClosed) {

            Game.doorTimer -= dt;

            if (Game.doorTimer <= 0) {

                Game.doorsClosed = false;

                showMessage(
                    "Doors opened."
                );
            }
        }

        if (Game.sabotage) {

            updateSabotage(dt);
        }

        updateHUD();
    }

    if (Game.state === "meeting") {

        Game.meetingTimer -= dt;

        if (Game.meetingTimer <= 0) {

            endMeeting();
        }
    }
}

/* =========================
   SABOTAGE UPDATE
========================= */

function updateSabotage(dt) {

    if (
        Game.sabotage !== "reactor" &&
        Game.sabotage !== "o2"
    ) return;

    if (!Game.sabotageTimer) {

        Game.sabotageTimer = 30;
    }

    Game.sabotageTimer -= dt;

    if (Game.sabotageTimer <= 0) {

        endGame(
            "IMPOSTORS WIN!",
            "The sabotage was not fixed in time."
        );

        Game.sabotageTimer = 0;
    }
}

/* =========================
   MEETING END
========================= */

function endMeeting() {

    Game.meeting = false;

    Game.state = "playing";

    Game.meetingTimer = 0;

    $("meet")?.classList.add("hide");

    showMessage(
        "Meeting ended."
    );
}

/* =========================
   GAME LOOP
========================= */

function gameLoop(timestamp) {

    const dt =
        Math.min(
            0.05,
            (timestamp - Game.lastTime) / 1000 || 0
        );

    Game.lastTime =
        timestamp;

    update(dt);

    if (Game.running) {

        drawWorld();
    }

    requestAnimationFrame(
        gameLoop
    );
}

/* =========================
   START BUTTON
========================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const startButton =
            $("go");

        if (startButton) {

            startButton.addEventListener(
                "click",
                startGame
            );
        }

        /* sabotage buttons */

        document.addEventListener(
            "keydown",
            event => {

                if (!Game.player?.impostor) return;

                if (event.key === "1")
                    sabotage("lights");

                if (event.key === "2")
                    sabotage("comms");

                if (event.key === "3")
                    sabotage("o2");

                if (event.key === "4")
                    sabotage("reactor");

                if (event.key === "5")
                    sabotage("doors");
            }
        );

        requestAnimationFrame(
            gameLoop
        );
    }
);
