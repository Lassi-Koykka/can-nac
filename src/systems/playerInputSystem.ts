import {
  Animations,
  Direction,
  EntityStatus,
  FireMode,
  Guns,
  InputListener,
  Position,
  Transform,
} from "../components";
import { Entity, System } from "../ecs";
import { spawnBullet } from "../entities/bullet";
import { normalizeVector } from "../utils";

export default class PlayerInputSystem extends System {
  componentsRequired = new Set<Function>([
    InputListener,
    Position,
    Transform,
    Direction,
    Guns,
  ]);
  public update(entities: Set<Entity>, _: number): void {
    entities.forEach((e) => {
      const comps = this.ecs.getComponents(e);
      let dir = comps.get(Direction);
      let pos = comps.get(Position);
      let transform = comps.get(Transform);
      let animations = comps.get(Animations);
      let guns = comps.get(Guns);

      // Static movement, no acceleration
      if (keyPress("w") || (!keyDown("s") && keyDown("w"))) dir.y = -1;
      if (keyPress("s") || (!keyDown("w") && keyDown("s"))) dir.y = 1;
      if (!keyDown("w") && !keyDown("s")) dir.y = 0;

      if (keyPress("a") || (!keyDown("d") && keyDown("a"))) dir.x = -1;
      if (keyPress("d") || (!keyDown("a") && keyDown("d"))) dir.x = 1;
      if (!keyDown("a") && !keyDown("d")) dir.x = 0;

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
      if (gun.fireMode === FireMode.SEMIAUTO && keyPress(" ") 
          || gun.fireMode === FireMode.AUTO && keyDown(" ")) {

        const fireDelay = 60000 / gun.fireRate;
        const now = new Date().getTime();
        if (!gun.lastShotTime || now - gun.lastShotTime > fireDelay) {
          gun.lastShotTime = now;
          gun.bulletDirections.forEach((dir) => {
            spawnBullet(
              this.ecs,
              EntityStatus.FRIENDLY,
              pos.x + (transform.width / 2),
              pos.y - 5,
              dir,
              gun.bulletType,
              gun.damage
            );
          });
        }
      }
    });
  }
}

const keyDown = (key: string) => window.keymap[key];
const keyPress = (key: string) =>
  window.keymap[key] && !window.keymapLastFrame[key];
const keyUp = (key: string) =>
  !window.keymap[key] && window.keymapLastFrame[key];
