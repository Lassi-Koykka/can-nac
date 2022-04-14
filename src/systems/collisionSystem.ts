import {
  Collider,
  Direction,
  EntityStatus,
  EntityTag,
  Health,
  Position,
  Speed,
  Status,
  Tag,
  Transform,
} from "../components";
import { Entity, System } from "../ecs";
import { getOrigin } from "../utils";

export default class CollisionSystem extends System {
  canvas: HTMLCanvasElement;
  componentsRequired = new Set<Function>([
    Position,
    Direction,
    Speed,
    Transform,
    Collider,
  ]);

  constructor(canvas: HTMLCanvasElement) {
    super();
    this.canvas = canvas;
  }

  public update(entities: Set<Entity>, delta: number): void {
    const { height, width } = this.canvas;

    const gameObjects = Array.from(entities).map((e) => {
      const comps = this.ecs.getComponents(e);

      return {
        entity: e,
        tag: comps.get(Tag)?.value,
        status: comps.get(Status)?.value,
        health: comps.get(Health),
        pos: comps.get(Position),
        speed: comps.get(Speed),
        dir: comps.get(Direction),
        col: comps.get(Collider),
        trans: comps.get(Transform),
      };
    });

    gameObjects.forEach((gameObject) => {
      const { tag, status, entity, pos, dir, speed, col, trans } = gameObject;

      let newPosX = pos.x + dir.x * speed.value * delta;
      let newPosY = pos.y + dir.y * speed.value * delta;

      // Check collisions
      const collisions = gameObjects.filter((go) =>
        collision(pos, trans, go.pos, go.trans)
      );

      if (tag === EntityTag.PLAYER) {
        if (newPosX < 2 || newPosX > width - 2 - trans.width) newPosX = pos.x;
        if (newPosY < 2 || newPosY > height - 2 - trans.height) newPosY = pos.y;
      }

      if (tag === EntityTag.PROJECTILE) {
        const target = collisions.find(
          (c) =>
            c.tag ===
            (status === EntityStatus.FRIENDLY
              ? EntityTag.ENEMY
              : EntityTag.PLAYER)
        );
        if (isOOB(newPosX, newPosY, width, height, 10) || target) {
          if (target) this.ecs.removeEntity(target.entity);
          console.log("Removing bullet");
          this.ecs.removeEntity(entity);
        }
      }

      pos.x = newPosX;
      pos.y = newPosY;
    });
  }
}
// TODO Collisions
const collision = (
  pos1: Position,
  trans1: Transform,
  pos2: Position,
  trans2: Transform
) => {
  const { width: w1, height: h1 } = trans1;
  const { width: w2, height: h2 } = trans2;
  const { x: x1, y: y1 } = getOrigin(pos1, trans1);
  const { x: x2, y: y2 } = getOrigin(pos2, trans2);

  if (x1 < x2 - w1 || x1 > x2 + w2 || y1 < y2 - h1 || y1 > y2 + h2)
    return false;
  return true;
};

const isOOB = (
  x: number,
  y: number,
  width: number,
  height: number,
  margin: number = 0
) => {
  const minX = -margin;
  const minY = -margin;
  const maxX = width + margin;
  const maxY = height + margin;

  if (x < minX || x > maxX || y < minY || y > maxY) return true;
  return false;
};
