import {Direction, MovementPattern, Position} from "../components";
import {Entity, System} from "../ecs";
import {MovementPatternType} from "../enums";
import {normalizeVector} from "../utils";

export default class PatternMovementSystem extends System {
  componentsRequired = new Set<Function>([ Direction, MovementPattern ]);

  constructor(){
    super();
  }

  public update(entities: Set<Entity>, _: number): void {
    entities.forEach(entity => {
      const comps = this.ecs.getComponents(entity)
      const pattern = comps.get(MovementPattern)
      const dir = comps.get(Direction)
      const pos = comps.get(Position)
      const sineModifier = Math.sin(new Date().getTime() / 500)
      if(pattern.type === MovementPatternType.SINE_HORIZONTAL)
        dir.x = sineModifier
      else if(pattern.type === MovementPatternType.SINE_VERTICAL)
        dir.y = sineModifier
      else if(pattern.type === MovementPatternType.HORIZONTAL_BAF) {
        if(pos.y > 5) {
          dir.y = 0
          if(pos.x < 0) dir.x = 1
          else if (pos.x > canvas.width - 14) dir.x = -1
          else if (dir.x === 0) dir.x = Math.random() > 0.5 ? -1 : 1
        }
      } else if(pattern.type === MovementPatternType.FOLLOW) {
        const playerComps = this.ecs.getComponents(GAMESTATE.playerEntity);
        if(playerComps) {
          const playerPos = playerComps.get(Position);
          const tempX = playerPos.x - pos.x;
          const tempY = playerPos.y - pos.y;

          const newDir = normalizeVector({x: tempX, y: tempY});
          dir.x = newDir.x;
          dir.y = newDir.y;
        } else {
          dir.x = 0;
          dir.y = pos.x > 0 ? -1 : 0;
        }
      }
    })
  }
}
