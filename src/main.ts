import {createAudioManager} from "./audioManager";
import { ECS } from "./ecs";
import { spawnPlayer } from "./entities/player";
import "./style.css";
import AnimationSystem from "./systems/animationSystem";
import CollisionSystem from "./systems/collisionSystem";
import EnemySpawnerSystem from "./systems/enemySpawnerSystem";
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
      url:"assets/laserShoot.wav",
    },
    {
      name: "explosion",
      url: "assets/explosion.wav"
    },
    {
      name: "death",
      url: "assets/death.wav"
    },
    {
      name: "hitHurt",
      url: "assets/hitHurt.wav"
    },
  ];
  const [spritesheetImg, backgroundImg, audioClipBuffers] = await Promise.all([
    loadImage("assets/spritesheet.png"),
    loadImage("assets/nebula-background.png"),
    loadAudioClips(audioCtx, AUDIOCLIPS),
  ]); 
  

  console.log("AudioClipBuffers", audioClipBuffers)
  globalThis.AUDIO_MANAGER = createAudioManager(audioCtx, audioClipBuffers, 0.2)

  // --- INITIALIZE ECS ---
  const ecs = new ECS();
  globalThis.SYSTEMS = {
    "collisionSystem": new CollisionSystem(canvas),
    "renderingSystem": new RenderingSystem(
      ctx,
      canvas,
      { backgroundImg, spritesheetImg },
    ),
    "animationSystem": new AnimationSystem(),
    "inputSystem": new PlayerInputSystem(),
    "enemySpawnerSystem": new EnemySpawnerSystem(canvas.width, 7),
  }

  Object.values(SYSTEMS).forEach((sys) => ecs.addSystem(sys));

  spawnPlayer(ecs, canvas.width / 2, canvas.height - 30);

  // --- ANIMATION PROPERTIES ---
  let lastTime = 0;
  const fps = 60;
  const nextFrame = 1000 / fps;

  // --- START GAME LOOP ---
  // @ts-ignore
  let frame = requestAnimationFrame(loop);

  function loop(t: number) {
    const delta = t - lastTime;
    if (delta > nextFrame) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      lastTime = t;

      // Run systems
      ecs.update(delta * 0.001);

      // Set keymap history
      KEYMAP_PREV = Object.assign(KEYMAP_PREV, KEYMAP);
    }
    frame = requestAnimationFrame(loop);
  }

})();
