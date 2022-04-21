import {Position, Sprite, SpriteType, Transform} from "../components";
import {Entity, System} from "../ecs";
import {getOrigin} from "../utils";

export default class RenderingSystem extends System {
  ctx: CanvasRenderingContext2D;
  canvasWidth: number;
  canvasHeight: number;
  componentsRequired = new Set<Function>([Position, Sprite]);
  spritesheet: HTMLImageElement;
  background: HTMLImageElement;
  backgroundYOffset = 0;
  backgroundMoveSpeed = 3;

  constructor(ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) {
    super();
    this.ctx = ctx;
    this.canvasWidth = canvasWidth
    this.canvasHeight = canvasHeight
    this.spritesheet = new Image()
    this.spritesheet.src = "shmup-spritesheet-v2.png"
    this.background = new Image()
    this.background.src = "nebula-background.png"
  }

  drawBackground() {
    const ctx = this.ctx;

    const backgroundY = this.background.naturalHeight - this.canvasHeight - this.backgroundYOffset
    if(backgroundY < 0) {
      ctx.drawImage(this.background, 0, this.background.naturalHeight - (Math.abs(backgroundY)) - 2, this.canvasWidth, this.canvasHeight, 0, 0, this.canvasWidth, this.canvasHeight )
    }
    ctx.drawImage(this.background, 0, backgroundY, this.canvasWidth, this.canvasHeight, 0, 0, this.canvasWidth, this.canvasHeight )
    this.backgroundYOffset += this.backgroundMoveSpeed

    if(backgroundY <= -this.canvasHeight) {
      this.backgroundYOffset = 2
    }
  }
  
  drawEntities(entities: Set<Entity>) {
    const ctx = this.ctx;

    entities.forEach((e) => {
      const comps = this.ecs.getComponents(e);
      const pos = comps.get(Position);
      const sprite = comps.get(Sprite);
      const transform = comps.get(Transform);
      const {x: drawX, y: drawY} = getOrigin(pos, transform)
      if (sprite.spriteType === SpriteType.SPRITE) {
        const {x, y} = sprite.coords
        ctx.drawImage(this.spritesheet, x, y, transform.width, transform.height, drawX, drawY, transform.width, transform.height)
      }
      else {
        ctx.strokeStyle = sprite.style;
        ctx.fillStyle = sprite.style;
        ctx.beginPath();
        ctx.fillRect(Math.round(drawX), Math.round(drawY), transform.width, transform.height);
      }
    });
  }

  public update(entities: Set<Entity>, _: number): void {
    // DRAW MENU IF GAMESTATE IS NOT RUNNING

    // DRAW BACKGROUND
    this.drawBackground()

    // DRAW ENTITIES
    this.drawEntities(entities)

    // DRAW HUD
  }
}


