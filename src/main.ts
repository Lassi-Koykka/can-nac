import { ECS } from "./ecs";
import {spawnEnemy} from "./entities/enemy";
import { spawnPlayer } from "./entities/player";
import "./style.css";
import CollisionSystem from "./systems/collisionSystem";
import EnemySpawnerSystem from "./systems/enemySpawnerSystem";
import PlayerInputSystem from "./systems/playerInputSystem";
import RenderingSystem from "./systems/renderingSystem";
import {randomInt} from "./utils";

const canvas = document.querySelector<HTMLCanvasElement>("#gameCanvas")!;
canvas.tabIndex = 1
const ctx = canvas.getContext("2d")!;
ctx.lineWidth = 2;
ctx.imageSmoothingEnabled = false;

// Input
window.keymap = {}
window.keymapLastFrame = {}

const resetKeymap = () => {
  console.log("RESETTING")
  window.keymap = {}
  window.keymapLastFrame = {}
};

const updateKeyMap = (e: KeyboardEvent) => {
  e.preventDefault()
  console.log("Keyevent: ", e.key);
  window.keymap[e.key.toLowerCase()] = e.type === "keydown";
};


const ecs = new ECS();
const collisionSystem = new CollisionSystem(canvas);
const renderingSystem = new RenderingSystem(ctx, canvas.width, canvas.height);
const playerInputSystem = new PlayerInputSystem();
const enemySpawnerSystem = new EnemySpawnerSystem(canvas.width, 7)
ecs.addSystem(playerInputSystem);
ecs.addSystem(renderingSystem);
ecs.addSystem(collisionSystem);
ecs.addSystem(enemySpawnerSystem)

const player = spawnPlayer(ecs, canvas.width / 2, canvas.height - 30);

const runGame = (ctx: CanvasRenderingContext2D) => {
  // ANIMATION PROPERTIES
  let lastTime = 0;
  const fps = 60;
  const nextFrame = 1000 / fps;

  // START
  let frame = requestAnimationFrame(loop);

  // LOOP
  function loop(t: number) {
    const delta = t - lastTime;
    if (delta > nextFrame) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      lastTime = t;

      // Run systems
      ecs.update(delta * 0.001);

      // Set keymap history
      keymapLastFrame = Object.assign(keymapLastFrame, keymap);
    }
    frame = requestAnimationFrame(loop);
  }
};

// EventListeners

window.addEventListener("blur", () => resetKeymap())
window.addEventListener("focus", () => resetKeymap())
window.addEventListener("load", () => runGame(ctx));
window.addEventListener("keydown", updateKeyMap);
window.addEventListener("keyup", updateKeyMap);
