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
import {spawnPlayer} from "../entities/player";
import { EntityStatus, FireMode } from "../enums";
import { keyDown, keyPress } from "../input";
import { normalizeVector } from "../utils";

export default class PlayerInputSystem extends System {
  componentsRequired = new Set<Function>([
    InputListener,
    Position,
    Transform,
    Direction,
    GunInventory,
  ]);

  updateListeners(entities: Set<number>) {
    entities.forEach((e) => {
      const comps = this.ecs.getComponents(e);
      let dir = comps.get(Direction);
      let pos = comps.get(Position);
      let transform = comps.get(Transform);
      let animations = comps.get(Animations);
      let guns = comps.get(GunInventory);

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

  public update(entities: Set<Entity>, _: number): void {
    // Open menu
    if (keyPress("MENU") && GAMESTATE.scene === "game")
      GAMESTATE.paused = !GAMESTATE.paused;
    if (keyPress("RESTART") && GAMESTATE.paused) {
      this.ecs.removeAllEntities()
      const p = spawnPlayer(this.ecs)
      GAMESTATE = {
        paused: false,
        scene: "game",
        playerEntity: p,
        lives: 3,
        score: 0
      }
    }

    // handle in-game listeners
    if (!GAMESTATE.paused && GAMESTATE.scene === "game") this.updateListeners(entities);
  }
}
