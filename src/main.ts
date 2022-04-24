import { createAudioManager } from "./audioManager";
import { ECS } from "./ecs";
import { spawnPlayer } from "./entities/player";
import "./style.css";
import AnimationSystem from "./systems/animationSystem";
import CollisionSystem from "./systems/collisionSystem";
import EnemySpawnerSystem from "./systems/enemySpawnerSystem";
import PatternMovementSystem from "./systems/patternMovementSystem";
import PlayerInputSystem from "./systems/playerInputSystem";
import RenderingSystem from "./systems/renderingSystem";
import { loadAudioClips, loadImage } from "./utils";

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
  ];
  const [spritesheetImg, backgroundImg, audioClipBuffers] = await Promise.all([
    loadImage("assets/spritesheet.png"),
    loadImage("assets/nebula-background.png"),
    loadAudioClips(audioCtx, AUDIOCLIPS),
  ]);

  console.log("AudioClipBuffers", audioClipBuffers);
  globalThis.AUDIO_MANAGER = createAudioManager(
    audioCtx,
    audioClipBuffers,
    0.2
  );

  // --- INITIALIZE ECS ---
  const ecs = new ECS();
  globalThis.SYSTEMS = {
    inputSystem: new PlayerInputSystem(),
    movementPatternSystem: new PatternMovementSystem(),
    collisionSystem: new CollisionSystem(canvas),
    enemySpawnerSystem: new EnemySpawnerSystem(canvas.width, 7),
    animationSystem: new AnimationSystem(),
    renderingSystem: new RenderingSystem(ctx, canvas, {
      backgroundImg,
      spritesheetImg,
    }),
  };

  Object.values(SYSTEMS).forEach((sys) => ecs.addSystem(sys));

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

    lastTime = t;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Run systems
    ecs.update(delta/1000);

    // Set keymap history
    KEYMAP_PREV = Object.assign(KEYMAP_PREV, KEYMAP);
  }
})();
