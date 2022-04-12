import {Direction, Gun, InputListener, Position, Transform} from "../components";
import {Entity, System} from "../ecs";
import {spawnBullet} from "../entities/bullet";
import {Keymap} from "../types";
import {normalizeVector} from "../utils";

export default class PlayerInputSystem extends System {
  keymap: Keymap;
  keymapLastFrame: Keymap;
  componentsRequired = new Set<Function>([
    InputListener,
    Position,
    Transform,
    Direction,
    Gun,
  ]);

  constructor(keymap: Keymap, keymapLastFrame: Keymap) {
    super();
    this.keymap = keymap;
    this.keymapLastFrame = keymapLastFrame;
  }
  public update(entities: Set<Entity>, _: number): void {

    const keymap = this.keymap;
    const keymapLastFrame = this.keymapLastFrame;
    entities.forEach((e) => {
      const comps = this.ecs.getComponents(e);
      let dir = comps.get(Direction);
      let pos = comps.get(Position);
      let transform = comps.get(Transform);
      let gun = comps.get(Gun);

      // Static movement, no acceleration
      if (keymap["w"] === keymap["s"]) dir.y = 0;
      else {
        if (keymap["w"]) dir.y = -1;
        if (keymap["s"]) dir.y = 1;
      }

      if (keymap["a"] === keymap["d"]) dir.x = 0;
      else {
        if (keymap["a"]) dir.x = -1;
        if (keymap["d"]) dir.x = 1;
      }

      const normVel = normalizeVector({ x: dir.x, y: dir.y });
      dir.x = normVel.x;
      dir.y = normVel.y;

      if (keymap[" "] && !keymapLastFrame[" "]) {
        for (let i = 0; i < gun.count; i++) {
          spawnBullet(
            this.ecs,
            pos.x + transform.width,
            pos.y + transform.width / 2,
            gun.bulletSize,
            gun.damage
          );
        }
      }
    });
  }
}
