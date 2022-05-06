import {AutofireGun, Position, Status} from "../components";
import {Entity, System} from "../ecs";
import {shoot} from "../entities/bullet";

export default class AutofireSystem extends System {

  componentsRequired = new Set<Function>([
    AutofireGun,
    Position,
    Status
  ]);

  public update(entities: Set<Entity>, _: number): void {
    Array.from(entities).forEach((e) => {
      const comps = this.ecs.getComponents(e);
      const { gun, defaultOffset } = comps.get(AutofireGun);
      const { value: status } = comps.get(Status)
      const pos = comps.get(Position);

      shoot(this.ecs, gun, pos, status, defaultOffset)
    });
  }
}
