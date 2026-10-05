```javascript
"use strict";

/* =====================================================
   BEAN CREW
   FIXED START ROUND VERSION
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  const menu = document.getElementById("menu");
  const gameScreen = document.getElementById("game");
  const startButton = document.getElementById("startBtn");

  let game = null;

  let WIDTH = window.innerWidth;
  let HEIGHT = window.innerHeight;

  const keys = {};

  /* =====================================================
     CANVAS
  ===================================================== */

  function resizeCanvas() {
    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;

    canvas.width = WIDTH;
    canvas.height = HEIGHT;
  }

  resizeCanvas();

  window.addEventListener("resize", resizeCanvas);


  /* =====================================================
     COLORS
  ===================================================== */

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


  /* =====================================================
     MAP
  ===================================================== */

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


  /* =====================================================
     TASKS
  ===================================================== */

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
    }
  ];


  /* =====================================================
     KEYBOARD
  ===================================================== */

  window.addEventListener("keydown", event => {

    const key = event.key.toLowerCase();

    keys[key] = true;

    if (
      ["w", "a", "s", "d", "e", "q", "r", "m"]
        .includes(key)
    ) {
      event.preventDefault();
    }
```
