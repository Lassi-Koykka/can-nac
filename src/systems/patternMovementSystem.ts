import {Direction, MovementPattern, Position} from "../components";
import {Entity, System} from "../ecs";
import {MovementPatternType} from "../enums";

export default class PatternMovementSystem extends System {
  componentsRequired = new Set<Function>([ Direction, MovementPattern ]);

  public update(entities: Set<Entity>, _: number): void {
    entities.forEach(entity => {
      const comps = this.ecs.getComponents(entity)
      const pattern = comps.get(MovementPattern)
      const dir = comps.get(Direction)
      const sineModifier = Math.sin(new Date().getTime() / 500)
      if(pattern.type === MovementPatternType.SINE_HORIZONTAL)
        dir.x = sineModifier
      else if(pattern.type === MovementPatternType.SINE_VERTICAL)
        dir.y = sineModifier
    })
  }
}
