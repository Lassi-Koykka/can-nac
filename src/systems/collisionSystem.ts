import {
  Collider,
  ColliderTag,
  Direction,
  Position,
  Speed,
  Transform,
} from "../components";
import { Entity, System } from "../ecs";

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

    entities.forEach((e) => {
      const comps = this.ecs.getComponents(e);
      let pos = comps.get(Position);
      let speed = comps.get(Speed);
      let dir = comps.get(Direction);
      let col = comps.get(Collider);
      let transform = comps.get(Transform);

      let newPosX = Math.round(pos.x + dir.x * speed.value * delta);
      let newPosY = Math.round(pos.y + dir.y * speed.value * delta);;

      if (col.tag === ColliderTag.PLAYER) {
        if(newPosX < 2 || newPosX > width - 2 - transform.width) newPosX = pos.x
        if(newPosY < 2 || newPosY > height - 2 - transform.height) newPosY = pos.y
      }

      if ( col.tag === ColliderTag.PROJECTILE && isOOB(newPosX, newPosY, width, height, 10)) {
        console.log("Removing bullet");
        this.ecs.removeEntity(e);
      }

      pos.x = newPosX;
      pos.y = newPosY;
    });
  }
}

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
