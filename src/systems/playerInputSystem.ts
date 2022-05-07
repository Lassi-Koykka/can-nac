import {
  Animations,
  Direction,
  GunInventory,
  InputListener,
  Position,
  Transform,
} from "../components";
import { Entity, System } from "../ecs";
import { shoot } from "../entities/bullet";
import { EntityStatus, FireMode } from "../enums";
import { normalizeVector } from "../utils";

const INPUT = {
  UP: ["w", "arrowup"],
  DOWN: ["s", "arrowdown"],
  LEFT: ["a", "arrowleft"],
  RIGHT: ["d", "arrowright"],
  ACTION1: [" "],
  MENU: ["escape"]
};

export default class PlayerInputSystem extends System {
  componentsRequired = new Set<Function>([
    InputListener,
    Position,
    Transform,
    Direction,
    GunInventory,
  ]);
  public update(entities: Set<Entity>, _: number): void {
    entities.forEach((e) => {
      const comps = this.ecs.getComponents(e);
      let dir = comps.get(Direction);
      let pos = comps.get(Position);
      let transform = comps.get(Transform);
      let animations = comps.get(Animations);
      let guns = comps.get(GunInventory);

      // Open menu
      if(keyPress("MENU")) GAMESTATE.paused = !GAMESTATE.paused

      if(GAMESTATE.paused) return;

      // Static movement, no acceleration
      if (keyPress("UP") || (!keyDown("DOWN") && keyDown("UP"))) dir.y = -1;
      if (keyPress("DOWN") || (!keyDown("UP") && keyDown("DOWN"))) dir.y = 1;
      if (!keyDown("UP") && !keyDown("DOWN")) dir.y = 0;

      if (keyPress("LEFT") || (!keyDown("RIGHT") && keyDown("LEFT")))
        dir.x = -1;
      if (keyPress("RIGHT") || (!keyDown("LEFT") && keyDown("RIGHT")))
        dir.x = 1;
      if (!keyDown("LEFT") && !keyDown("RIGHT")) dir.x = 0;

      const normVel = normalizeVector({ x: dir.x, y: dir.y });
      dir.x = normVel.x;
      dir.y = normVel.y;

      if (animations) {
        if (dir.x < 0 && animations.state !== "turning_left") {
          if (animations.state === "turning_right")
            animations.setState("default");
          animations.setState("turning_left");
        } else if (dir.x > 0 && animations.state !== "turning_right") {
          if (animations.state === "turning_left")
            animations.setState("default");
          animations.setState("turning_right");
        } else if (dir.x === 0 && animations.state !== "default") {
          animations.setState("default");
        }
      }

      const gun = guns.getActive();
      if (
        (gun.fireMode === FireMode.SEMIAUTO && keyPress("ACTION1")) ||
        (gun.fireMode === FireMode.AUTO && keyDown("ACTION1"))
      ) {
        const defaultOffset = { x: transform.width / 2, y: -5 };
        shoot(this.ecs, gun, pos, EntityStatus.FRIENDLY, defaultOffset);
      }
    });
  }
}

const keyDown = (input: keyof typeof INPUT) =>
  INPUT[input].some((key) => KEYMAP[key]);
const keyPress = (input: keyof typeof INPUT) =>
  INPUT[input].some((key) => KEYMAP[key]) &&
  INPUT[input].every((key) => !KEYMAP_PREV[key]);
const keyUp = (input: keyof typeof INPUT) =>
  INPUT[input].some((key) => !KEYMAP[key]) &&
  INPUT[input].every((key) => KEYMAP_PREV[key]);
