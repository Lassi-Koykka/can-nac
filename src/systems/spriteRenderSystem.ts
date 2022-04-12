import {Align, Position, Sprite, SpriteType, Transform} from "../components";
import {Entity, System} from "../ecs";

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
        const drawX = getOrigin(
          pos.x,
          transform.width,
          transform.horizontalAlign
        );
        const drawY = getOrigin(
          pos.y,
          transform.height,
          transform.verticalAlign
        );
        ctx.beginPath();
        ctx.fillRect(drawX, drawY, transform.width, transform.height);
      }
    });
  }
}

const getOrigin = (coord: number, width: number, align: Align) => {
  switch (align) {
    case Align.START:
      return coord;
    case Align.CENTER:
      return coord - width / 2;
    case Align.END:
      return coord - width;
    default:
      return coord;
  }
};

