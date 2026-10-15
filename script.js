/* upgrade.js — load AFTER game.js. Overrides functions from game.js. */

/* ================= BOT NERFS ================= */

// Bots walk 20% slower than before.
const _mv = mv;
mv = function (p, dx, dy, sp, dt) { return _mv(p, dx, dy, p.id ? sp * 0.8 : sp, dt); };

// Bug fix: bot cooldowns used to tick down twice per frame (update() + bot()).
// Now they tick at 75% speed, and crew bots do tasks ~40% slower.
const _bot = bot;
bot = function (b, dt) {
  if (b.id) b.cd += dt * 1.25;
  if (!b.imp && b.wait > 0) dt *= 0.6;
  _bot(b, dt);
};

// Impostor bots need a closer, rarer, less certain opening: nobody within 340px
// (including you), shorter reach, and a random hesitation each frame.
hunt = function (b) {
  const v = G.pl[b.goal.v];
  if (!v.alive || v.vent >= 0) { b.goal = null; b.path = []; return; }
  if (dist(v, b) < 58 && b.cd <= 0 &&
      !G.pl.some(o => o.alive && o !== b && o !== v && dist(o, b) < 340) &&
      Math.random() < 0.04) {
    kill(b, v); b.goal = null; b.path = []; b.wait = 1;
  }
};

// Impostor bots spend more time faking tasks instead of hunting.
const _pg = pickGoal;
pickGoal = function (b) {
  if (b.imp && Math.random() < 0.4) {
    const t = pick(TK);
    return go(b, t[1], t[2], { k: 'task', t: { d: t, done: 0 }, fake: 1 });
  }
  return _pg(b);
};

// Longer cooldown after each bot kill + screen feedback for every kill.
const _kill = kill;
kill = function (k, v) {
  const was = v.alive;
  _kill(k, v);
  if (was && !v.alive) {
    G.flash = 0.5; G.shake = 0.35;
    if (k.id) k.cd = S.kcd * 1.4;
  }
};

// Bots start with a long grace period and the first sabotage comes later.
const _sg = startGame;
startGame = function () {
  _sg();
  G.pl.forEach(p => { if (p.id) p.cd = 20 + Math.random() * 12; });
  G.sabCd = 30;
};

/* ================= VISUALS ================= */

// Twinkling stars in the void around the ship.
const STARS = Array.from({ length: 260 }, () => ({
  x: rnd(-700, 2150), y: rnd(-500, 1350), r: rnd(0.6, 2.2), p: rnd(0, 6.28)
}));

const _dw = drawWorld;
drawWorld = function (c, me) {
  const t = G ? G.t : 0;
  c.save();
  c.fillStyle = '#cfe';
  STARS.forEach(s => { c.globalAlpha = 0.4 + 0.5 * Math.sin(t * 1.5 + s.p); c.fillRect(s.x, s.y, s.r, s.r); });
  c.restore();

  // Neon hull glow (turns red during sabotage).
  c.save();
  c.fillStyle = '#8fa0d8';
  c.shadowColor = G && G.sab ? '#f33' : '#3df';
  c.shadowBlur = 28;
  RECTS.forEach(r => c.fillRect(r[0] - 4, r[1] - 4, r[2] + 8, r[3] + 8));
  c.restore();

  _dw(c, me);

  // Faint floor grid in rooms.
  c.save();
  c.globalAlpha = 0.08; c.strokeStyle = '#8cf'; c.lineWidth = 1; c.beginPath();
  RM.forEach(r => {
    for (let x = r[1] + 40; x < r[1] + r[3]; x += 40) { c.moveTo(x, r[2]); c.lineTo(x, r[2] + r[4]); }
    for (let y = r[2] + 40; y < r[2] + r[4]; y += 40) { c.moveTo(r[1], y); c.lineTo(r[1] + r[3], y); }
  });
  c.stroke();
  c.restore();
};

// Ground shadows + colored glow on your own bean.
const _bean = bean;
bean = function (c, p, x, y, al, name, ghost) {
  c.save(); c.globalAlpha = al * 0.4; c.fillStyle = '#000';
  c.beginPath(); c.ellipse(x, y + 3, 15, 5, 0, 0, 7); c.fill(); c.restore();
  if (!ghost && p.id === 0) {
    c.save(); c.shadowColor = COLORS[p.col]; c.shadowBlur = 16;
    _bean(c, p, x, y, al, name, ghost); c.restore();
  } else _bean(c, p, x, y, al, name, ghost);
};

// Post-processing: screen shake, vignette, scanlines, danger pulse, kill flash.
const SCAN = (() => {
  const s = document.createElement('canvas'); s.width = 4; s.height = 4;
  const x = s.getContext('2d'); x.fillStyle = 'rgba(0,0,0,.14)'; x.fillRect(0, 0, 4, 1); return s;
})();

const _render = render;
render = function () {
  const shk = G && G.phase === 'play' && G.shake > 0;
  if (shk) { ctx.save(); ctx.translate(rnd(-1, 1) * G.shake * 14, rnd(-1, 1) * G.shake * 14); }
  _render();
  if (shk) { ctx.restore(); G.shake = Math.max(0, G.shake - 0.016); }
  if (!G) return;

  const g = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.35, W / 2, H / 2, Math.max(W, H) * 0.75);
  g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,10,.65)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = ctx.createPattern(SCAN, 'repeat'); ctx.fillRect(0, 0, W, H);

  if (G.sab && G.sab.crit) {
    ctx.fillStyle = `rgba(255,0,0,${0.12 + 0.1 * Math.sin(G.t * 6)})`; ctx.fillRect(0, 0, W, H);
  }
  if (G.flash > 0) {
    ctx.fillStyle = `rgba(255,20,30,${G.flash * 0.6})`; ctx.fillRect(0, 0, W, H);
    G.flash -= 0.02;
  }
};

/* ================= v2: effects drawn ABOVE the vision mask ================= */

// Badge so you can confirm this file loaded.
(() => {
  const b = document.createElement('div');
  b.textContent = '✦ UPGRADE LOADED';
  b.style.cssText = 'position:fixed;left:50%;bottom:6px;transform:translateX(-50%);z-index:99;font:700 11px system-ui;letter-spacing:2px;color:#3df;text-shadow:0 0 8px #3df;pointer-events:none;opacity:.8';
  document.body.appendChild(b);
  document.title = 'Among Us ✦ Upgraded';
})();

// Screen-space starfield with parallax + dust motes, drawn additively over everything.
const SS = Array.from({ length: 140 }, () => ({ x: Math.random(), y: Math.random(), r: rnd(.6, 2), z: rnd(.02, .12), p: rnd(0, 6.28) }));
const DUST = Array.from({ length: 40 }, () => ({ x: Math.random(), y: Math.random(), v: rnd(.004, .02), r: rnd(1, 3) }));

const _render2 = render;
render = function () {
  _render2();
  if (!G || G.phase !== 'play') return;
  const me = G.pl[0], t = G.t;

  ctx.save();
  ctx.globalCompositeOperation = 'lighter';

  // Blue ambient wash so the dark areas aren't dead black.
  ctx.fillStyle = G.sab ? 'rgba(90,10,15,.14)' : 'rgba(20,45,110,.14)';
  ctx.fillRect(0, 0, W, H);

  // Parallax stars.
  SS.forEach(s => {
    const x = ((s.x * W - me.x * s.z) % W + W) % W, y = ((s.y * H - me.y * s.z) % H + H) % H;
    ctx.fillStyle = `rgba(190,225,255,${.35 + .45 * Math.sin(t * 2 + s.p)})`;
    ctx.fillRect(x, y, s.r, s.r);
  });

  // Floating dust motes.
  DUST.forEach(d => {
    d.y -= d.v * .016; if (d.y < 0) { d.y = 1; d.x = Math.random(); }
    ctx.fillStyle = 'rgba(120,200,255,.25)';
    ctx.beginPath(); ctx.arc(d.x * W + Math.sin(t + d.x * 9) * 12, d.y * H, d.r, 0, 7); ctx.fill();
  });

  // Colored light halo around you (your bean color).
  const g = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, 170);
  g.addColorStop(0, COLORS[me.col] + '44'); g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g; ctx.fillRect(W / 2 - 170, H / 2 - 170, 340, 340);

  ctx.restore();
};
