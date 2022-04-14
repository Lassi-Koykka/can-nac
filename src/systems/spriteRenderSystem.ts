import {Position, Sprite, SpriteType, Transform} from "../components";
import {Entity, System} from "../ecs";
import {getOrigin} from "../utils";

export default class SpriteRenderSystem extends System {
  ctx: CanvasRenderingContext2D;
  componentsRequired = new Set<Function>([Position, Sprite]);

  constructor(ctx: CanvasRenderingContext2D) {
    super();
    this.ctx = ctx;
  }

  public update(entities: Set<Entity>, _: number): void {
    entities.forEach((e) => {
      const ctx = this.ctx;
      const comps = this.ecs.getComponents(e);
      const pos = comps.get(Position);
      const sprite = comps.get(Sprite);
      const transform = comps.get(Transform);
      if (sprite.spriteType === SpriteType.PLACEHOLDER) {
        ctx.strokeStyle = sprite.source;
        ctx.fillStyle = sprite.source;
        const {x: drawX, y: drawY} = getOrigin(pos, transform)
        ctx.beginPath();
        ctx.fillRect(Math.round(drawX), Math.round(drawY), transform.width, transform.height);
      }
    });
  }
}


