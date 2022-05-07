import { createAudioManager } from "./audioManager";
import { ECS } from "./ecs";
import { spawnPlayer } from "./entities/player";
import "./style.css";
import AnimationSystem from "./systems/animationSystem";
import AutofireSystem from "./systems/autofireSystem";
import CollisionSystem from "./systems/collisionSystem";
import EnemySpawnerSystem from "./systems/enemySpawnerSystem";
import PatternMovementSystem from "./systems/patternMovementSystem";
import PlayerInputSystem from "./systems/playerInputSystem";
import RenderingSystem from "./systems/renderingSystem";
import {IFont} from "./types";
import { indexChars, loadAudioClips, loadImage } from "./utils";

// --- Canvas ---
const canvas = document.querySelector<HTMLCanvasElement>("#gameCanvas")!;
canvas.tabIndex = 1;

// --- Context ---
const ctx = canvas.getContext("2d")!;
ctx.lineWidth = 2;
ctx.imageSmoothingEnabled = false;
ctx.font = "8px 'Press Start 2P'";

// --- Audio Context ---
//@ts-ignore
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// --- Input Setup ---
globalThis.KEYMAP = {};
globalThis.KEYMAP_PREV = {};

const updateKeyMap = (e: KeyboardEvent) => {
  // e.preventDefault()
  KEYMAP[e.key.toLowerCase()] = e.type === "keydown";
};

const resetKeymap = () => {
  KEYMAP = {};
  KEYMAP_PREV = {};
};

window.addEventListener("keydown", updateKeyMap);
window.addEventListener("keyup", updateKeyMap);
window.addEventListener("blur", () => resetKeymap());
window.addEventListener("focus", () => resetKeymap());

// --------------------------
// LOAD ASSETS AND START GAME
// --------------------------

(async () => {
  // --- PRELOAD ASSETS ---
  const AUDIOCLIPS = [
    {
      name: "laserShot",
      url: "assets/laserShoot.wav",
    },
    {
      name: "explosion",
      url: "assets/explosion.wav",
    },
    {
      name: "death",
      url: "assets/death.wav",
    },
    {
      name: "hitHurt",
      url: "assets/hitHurt.wav",
    },
    {
      name: "hitHurtEnemy",
      url: "assets/hitHurt2.wav",
    },
  ];
  const [audioClipBuffers, spritesheetImg, backgroundImg, defaultFontImg] = await Promise.all([
    loadAudioClips(audioCtx, AUDIOCLIPS),
    loadImage("assets/spritesheet.png"),
    loadImage("assets/background.png"),
    loadImage("assets/default-font-no-shadow.png")
  ]);

  globalThis.AUDIO_MANAGER = createAudioManager(
    audioCtx,
    audioClipBuffers,
    0.2
  );

  const fonts: {[key: string]: IFont} = {
    "default": {
      img: defaultFontImg,
      characterIndexes: indexChars("abcdefghijklmnopqrstuvwxyz0123456789.!-:"),
      charWidth: 9,
      charHeight: 11,
      caseSensitive: false
    }
  }

  // --- INITIALIZE ECS ---
  const ecs = new ECS();
  globalThis.SYSTEMS = {
    inputSystem: new PlayerInputSystem(),
    autofireSystem: new AutofireSystem(),
    movementPatternSystem: new PatternMovementSystem(canvas),
    collisionSystem: new CollisionSystem(canvas),
    enemySpawnerSystem: new EnemySpawnerSystem(canvas.width, 3),
    animationSystem: new AnimationSystem(),
    renderingSystem: new RenderingSystem(ctx, canvas, {
      backgroundImg,
      spritesheetImg,
    },
    fonts,
    ),
  };

  Object.values(SYSTEMS).forEach((sys) => ecs.addSystem(sys));

  // --- GAMESTATE ---
  globalThis.GAMESTATE = {
    level: 1,
    paused: false,
    scene: "menu",
    lives: 3,
    score: 0
  }

  const pause = () => {
  }

  spawnPlayer(ecs, canvas.width / 2, canvas.height - 30);

  // --- ANIMATION PROPERTIES ---
  let lastTime = 0;
  const maxFps = 72;
  const nextFrame = 1000 / maxFps;

  // --- START GAME LOOP ---
  

  requestAnimationFrame(loop);
  function loop(t: number) {
    requestAnimationFrame(loop);
    const delta = t - lastTime;
    if(delta <= nextFrame) return

    // PAUSE GAME
    [
      "autofireSystem",
      "collisionSystem",
      "enemySpawnerSystem",
      "animationSystem"
    ].forEach(s => {
      const sys = SYSTEMS[s]
      if(sys && sys.enabled === GAMESTATE.paused) sys.enabled = !GAMESTATE.paused
    })

    lastTime = t;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Run systems
    ecs.update(delta/1000);

    // Set keymap history
    KEYMAP_PREV = Object.assign(KEYMAP_PREV, KEYMAP);
  }
})();
