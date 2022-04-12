import { ECS } from "./ecs";
import { spawnPlayer } from "./entities/player";
import "./style.css";
import CollisionSystem from "./systems/collisionSystem";
import PlayerInputSystem from "./systems/playerInputSystem";
import SpriteRenderSystem from "./systems/spriteRenderSystem";
import { Keymap } from "./types";

const canvas = document.querySelector<HTMLCanvasElement>("#gameCanvas")!;
canvas.tabIndex = 1
const ctx = canvas.getContext("2d")!;
ctx.lineWidth = 2;
ctx.imageSmoothingEnabled = false;

// Input
let keymap: Keymap = {};
let keymapLastFrame: Keymap = {};

const resetKeymap = () => {
  console.log("RESETTING")
  keymap = {}
  keymapLastFrame = {}
};

const updateKeyMap = (e: KeyboardEvent) => {
  e.preventDefault()
  console.log(document.hasFocus())
  if(!document.hasFocus()) {
    resetKeymap();
    return
  }
  console.log("Keyevent: ", e.key);
  keymap[e.key] = e.type === "keydown";
};


const ecs = new ECS();
const collisionSystem = new CollisionSystem(canvas);
const spriteRenderSystem = new SpriteRenderSystem(ctx);
const playerInputSystem = new PlayerInputSystem(keymap, keymapLastFrame);
ecs.addSystem(playerInputSystem);
ecs.addSystem(collisionSystem);
ecs.addSystem(spriteRenderSystem);

const player = spawnPlayer(ecs, 20, canvas.height / 2);

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

  return () => {
    // cancelAnimationFrame(frame);
  };
};

// EventListeners
window.addEventListener("load", runGame(ctx));
window.addEventListener("keydown", updateKeyMap);
window.addEventListener("keyup", updateKeyMap);
