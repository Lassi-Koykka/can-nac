import {
  Collider,
  Direction,
  Position,
  Speed,
  Sprite,
  Transform,
} from "../components";
import { Component, Entity, System } from "../ecs";
import { Align, ColliderType, SpriteType } from "../enums";
import { IFont } from "../types";
import { getDirKey, getOrigin, randomInt } from "../utils";

interface IDrawTextOptions<T = undefined> {
  font?: IFont;
  horizontalAlign?: Align;
  verticalAlign?: Align;
  scale?: number;
  color?: string;
  shadow?: {
    color: string;
    offsetX: number;
    offsetY: number;
  };
}

export default class RenderingSystem extends System {
  componentsRequired = new Set<Function>([Position, Sprite]);

  // PROPERTIES
  ctx: CanvasRenderingContext2D;
  canvasWidth: number;
  canvasHeight: number;

  // Assets
  spritesheet: HTMLImageElement;
  background: HTMLImageElement;
  fonts: { [name: string]: IFont };
  stars: Entity[] = [];
  lastStarSpawn: number = 0;
  starSpeeds = [100, 160, 220];

  // backgroundYOffset = 0;
  // backgroundMoveSpeed = 250;

  constructor(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    assets: {
      spritesheetImg: HTMLImageElement;
      backgroundImg: HTMLImageElement;
    },
    fonts: { [name: string]: IFont }
  ) {
    super();
    this.ctx = ctx;
    this.canvasWidth = canvas.width;
    this.canvasHeight = canvas.height;
    this.spritesheet = assets.spritesheetImg;
    this.background = assets.backgroundImg;
    this.fonts = fonts;
  }

  // drawBackgroundV1(delta: number) {
  //   const ctx = this.ctx;

  //   const backgroundY = Math.round(
  //     this.background.naturalHeight - this.canvasHeight - this.backgroundYOffset
  //   );
  //   if (backgroundY < 0) {
  //     ctx.drawImage(
  //       this.background,
  //       0,
  //       this.background.naturalHeight - Math.abs(backgroundY) - 2,
  //       this.canvasWidth,
  //       this.canvasHeight,
  //       0,
  //       0,
  //       this.canvasWidth,
  //       this.canvasHeight
  //     );
  //   }
  //   ctx.drawImage(
  //     this.background,
  //     0,
  //     backgroundY,
  //     this.canvasWidth,
  //     this.canvasHeight,
  //     0,
  //     0,
  //     this.canvasWidth,
  //     this.canvasHeight
  //   );
  //   this.backgroundYOffset += this.backgroundMoveSpeed * delta;

  //   if (backgroundY <= -this.canvasHeight) {
  //     this.backgroundYOffset = 2;
  //   }
  // }

  drawBackgroundV2() {
    const ctx = this.ctx;
    const now = new Date().getTime();
    if (now - this.lastStarSpawn > 100) {
      const newStar = this.ecs.addEntity();
      const x = randomInt(1, this.canvasWidth);
      const distanceIdx = randomInt(0, this.starSpeeds.length)
      const speed = this.starSpeeds[distanceIdx];
      const components: Component[] = [
        new Position(x, -5),
        new Transform(distanceIdx + 1 , distanceIdx + 1),
        new Speed(speed),
        new Direction(0, 1),
      ];
      components.forEach((c) =>
        this.ecs.addComponent(newStar, c)
      );
      this.lastStarSpawn = now;
      this.stars.push(newStar);
    }
    this.stars.forEach((e) => {
      const comps = this.ecs.getComponents(e);
      const pos = comps.get(Position);
      const transform = comps.get(Transform);

      ctx.save();
      ctx.strokeStyle = "white";
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.fillRect(
        Math.round(pos.x),
        Math.round(pos.y),
        transform.width,
        transform.height
      );
      ctx.restore();
    });
  }

  drawEntities(entities: Set<Entity>) {
    const ctx = this.ctx;

    entities.forEach((e) => {
      const comps = this.ecs.getComponents(e);
      const pos = comps.get(Position);
      const sprite = comps.get(Sprite);
      const transform = comps.get(Transform);
      const dir = comps.get(Direction);
      const { x: drawX, y: drawY } = getOrigin(pos, transform);
      if (sprite.spriteType === SpriteType.SPRITE) {
        const { x, y } = sprite.currSprite;
        ctx.drawImage(
          this.spritesheet,
          x,
          y,
          transform.width,
          transform.height,
          drawX,
          drawY,
          transform.width,
          transform.height
        );
      } else if (sprite.spriteType === SpriteType.DIRECTIONAL_SPRITE && dir) {
        // console.log(dir)
        const dirKey = getDirKey(dir);
        const { x, y } = sprite.sprites[dirKey] || sprite.sprites.default;
        ctx.drawImage(
          this.spritesheet,
          x,
          y,
          transform.width,
          transform.height,
          drawX,
          drawY,
          transform.width,
          transform.height
        );
      } else {
        ctx.save();
        ctx.strokeStyle = sprite.style;
        ctx.fillStyle = sprite.style;
        ctx.beginPath();
        ctx.fillRect(
          Math.round(drawX),
          Math.round(drawY),
          transform.width,
          transform.height
        );
        ctx.restore();
      }
    });
  }

  drawText(
    text: string,
    x: number,
    y: number,
    options: IDrawTextOptions<typeof this.fonts>
  ) {
    const ctx = this.ctx;
    const {
      font = this.fonts["default"],
      verticalAlign = Align.END,
      horizontalAlign = Align.START,
      scale = 1,
      // color = "white",
      shadow,
    } = options;

    let textWidth = text.length * font.charWidth;
    let textHeight = font.charHeight;
    if (shadow) {
      textWidth += Math.abs(shadow.offsetX);
      textHeight += Math.abs(shadow.offsetY);
    }

    const chars = Array.from(font.caseSensitive ? text : text.toLowerCase());
    const { x: originX, y: originY } = getOrigin(
      { x, y },
      { width: textWidth, height: textHeight, horizontalAlign, verticalAlign }
    );

    ctx.save();
    chars.forEach((c, i) => {
      let charIndex = font.characterIndexes[c];
      if (c === " " || charIndex === undefined) return;

      if (shadow) {
        (ctx.shadowColor = shadow.color), (ctx.shadowOffsetX = shadow.offsetX);
        ctx.shadowOffsetY = shadow.offsetY;
      }
      const cols = Math.floor(font.img.naturalWidth / font.charWidth);
      const charX = (charIndex % cols) * font.charWidth;
      const charY =
        Math.floor((charIndex * font.charWidth) / font.img.naturalWidth) *
        font.charHeight;

      ctx.drawImage(
        font.img,
        charX,
        charY,
        font.charWidth,
        font.charHeight,
        originX + font.charWidth * i,
        originY,
        font.charWidth * scale,
        font.charHeight * scale
      );
    });
    ctx.restore();
  }

  drawHUD(delta: number) {
    // DrawFPS
    this.drawText("FPS:" + Math.round(1 / delta), this.canvasWidth, 0, {
      horizontalAlign: Align.END,
      verticalAlign: Align.START,
      color: "red",
      shadow: {
        color: "red",
        offsetX: 1,
        offsetY: 0,
      },
    });
  }

  public update(entities: Set<Entity>, delta: number): void {
    // DRAW MENU IF GAMESTATE IS NOT RUNNING

    // DRAW BACKGROUND
    this.drawBackgroundV2();

    // DRAW ENTITIES
    this.drawEntities(entities);

    // DRAW HUD
    this.drawHUD(delta);
  }
}
