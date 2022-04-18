import {
  Direction,
  EntityStatus,
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
      let {gunList, active} = comps.get(Guns);

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

      if (keymap[" "] && !keymapLastFrame[" "]) {
        const gun = gunList[active];
        spawnBullet(
          this.ecs,
          pos.x + transform.width / 2 + 1,
          pos.y - gun.bulletSize,
          { x: 0, y: -1 },
          gun.bulletSize,
          gun.damage,
          EntityStatus.FRIENDLY
        );
      }
    });
  }
}

const keyDown = (key: string) => window.keymap[key];
const keyPress = (key: string) =>
  window.keymap[key] && !window.keymapLastFrame[key];
const keyUp = (key: string) =>
  !window.keymap[key] && window.keymapLastFrame[key];
