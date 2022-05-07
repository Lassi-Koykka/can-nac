import { Direction, Health, Position, Speed, Sprite, Tag, Transform } from "../components";
import { Component, Entity, System } from "../ecs";
import { Align, EntityTag, SpriteType } from "../enums";
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

  // Assets
  spritesheet: HTMLImageElement;
  background: HTMLImageElement;
  fonts: { [name: string]: IFont };
  stars: Entity[] = [];
  lastStarSpawn: number = 0;
  starSpeeds = [80, 100, 130, 220];
  starColors = ["#a4e4fc", "#b8f8d8", "#fcfcfc"];

  backgroundYOffset = 0;
  backgroundMoveSpeed = 250;

  constructor(
    ctx: CanvasRenderingContext2D,
    assets: {
      spritesheetImg: HTMLImageElement;
      backgroundImg: HTMLImageElement;
    },
    fonts: { [name: string]: IFont }
  ) {
    super();
    this.ctx = ctx;
    this.spritesheet = assets.spritesheetImg;
    this.background = assets.backgroundImg;
    this.fonts = fonts;
  }

  drawBackground(delta: number) {
    const ctx = this.ctx;

    const backgroundY = Math.round(
      this.background.naturalHeight - canvas.height - this.backgroundYOffset
    );
    if (backgroundY < 0) {
      ctx.drawImage(
        this.background,
        0,
        this.background.naturalHeight - Math.abs(backgroundY) - 2,
        canvas.width,
        canvas.height,
        0,
        0,
        canvas.width,
        canvas.height
      );
    }
    ctx.drawImage(
      this.background,
      0,
      backgroundY,
      canvas.width,
      canvas.height,
      0,
      0,
      canvas.width,
      canvas.height
    );
    this.backgroundYOffset += this.backgroundMoveSpeed * delta;

    if (backgroundY <= -canvas.height) {
      this.backgroundYOffset = 2;
    }

    this.drawStars();
  }

  drawStars() {
    const ctx = this.ctx;
    const now = new Date().getTime();
    if (!GAMESTATE.paused && now - this.lastStarSpawn > 50) {
      const newStar = this.ecs.addEntity();
      const x = randomInt(1, canvas.width);
      const distanceIdx = randomInt(0, this.starSpeeds.length);
      const speed = this.starSpeeds[distanceIdx];
      const size = 1;
      const components: Component[] = [
        new Position(x, -5),
        new Transform(size, size),
        new Speed(speed),
        new Direction(0, 1),
      ];
      components.forEach((c) => this.ecs.addComponent(newStar, c));
      this.lastStarSpawn = now;
      this.stars.push(newStar);
    }
    this.stars.forEach((e) => {
      const comps = this.ecs.getComponents(e);

      if(!comps) {
        this.stars = this.stars.filter(ent => ent !== e)
        return;
      }

      const pos = comps.get(Position);
      const { width } = comps.get(Transform);

      if (pos.y > canvas.height) {
        this.stars = this.stars.filter((s) => s !== e);
        this.ecs.removeEntity(e);
        return;
      }

      ctx.save();
      const color = this.starColors[pos.x % this.starColors.length];
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.fillRect(Math.round(pos.x), Math.round(pos.y), width, width);
      if (width >= 3) {
        ctx.fillStyle = "#fcfcfc";
        ctx.fillRect(Math.round(pos.x) + 1, Math.round(pos.y) + 1, 1, 1);
      }
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
      const health = comps.get(Health);
      const tag = comps.get(Tag);
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
      if(!GAMESTATE.paused && tag?.value === EntityTag.PLAYER) {
        for (let i = 0; i < health.curr * 3; i += 3) {
          ctx.save();
          ctx.fillStyle = "#a81000"
          ctx.fillRect(pos.x + 10 + i, pos.y + transform.height + 1, 2, 2)
          ctx.restore();
        }

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
    return { w: textWidth, h: textHeight };
  }

  drawHUD(delta: number) {
    // Draw pause menu
    const pauseTextLocation = {
        x: canvas.width / 2,
        y: canvas.height / 2 - 30
    }
    let pauseTextSize: {w: number, h: number}
    if (GAMESTATE.paused && GAMESTATE.scene !== "menu") {
      pauseTextSize = this.drawText(
        GAMESTATE.scene === "game" ? "PAUSED" : "GAME OVER",
        pauseTextLocation.x,
        pauseTextLocation.y,
        {
          horizontalAlign: Align.CENTER,
          verticalAlign: Align.CENTER,
          shadow: {
            color: "#a80020",
            offsetX: 1,
            offsetY: 1,
          },
        }
      );
    }

    // Draw score
    const scoreTextLocation = GAMESTATE.paused ? {x: Math.floor(canvas.width / 2 - pauseTextSize!.w / 2), y: pauseTextLocation.y + 16 } : {x: 2, y: 2}
    const scoreTextSize = this.drawText(GAMESTATE.score.toString() + `${GAMESTATE.paused ? " PTS" : ""}`, scoreTextLocation.x, scoreTextLocation.y, {
      horizontalAlign: Align.START,
      verticalAlign: Align.START,
      color: "red",
      shadow: {
        color: "#0058f8",
        offsetX: 1,
        offsetY: 0,
      },
    });

    const livesText = GAMESTATE.paused 
      ? GAMESTATE.lives + " ships"
      : Array(GAMESTATE.lives > 0 ? GAMESTATE.lives : 0).fill("♥").join("")
    // Draw lives
    GAMESTATE.scene === "game" && this.drawText(
      livesText,
      scoreTextLocation.x,
      scoreTextLocation.y + scoreTextSize.h + 2,
      {
        horizontalAlign: Align.START,
        verticalAlign: Align.START,
        color: "red",
        shadow: {
          color: "#a80020",
          offsetX: 1,
          offsetY: 0,
        },
      }
    );

    if (GAMESTATE.paused && GAMESTATE.scene !== "menu") {
      this.drawText(
        "PRESS R TO RESTART",
        canvas.width / 2,
        canvas.height - 50,
        {
          horizontalAlign: Align.CENTER,
          verticalAlign: Align.CENTER,
          shadow: {
            color: "#00b800",
            offsetX: 1,
            offsetY: 1,
          },
        }
      );
    }

    // Draw FPS
    false &&
      this.drawText("FPS:" + Math.round(1 / delta), canvas.width, 0, {
        horizontalAlign: Align.END,
        verticalAlign: Align.START,
        color: "red",
        shadow: {
          color: "#a80020",
          offsetX: 1,
          offsetY: 0,
        },
      });
  }

  public update(entities: Set<Entity>, delta: number): void {
    // DRAW MENU IF GAMESTATE IS NOT RUNNING

    // DRAW BACKGROUND
    this.drawStars();
    // this.drawBackground(delta);

    // DRAW ENTITIES
    this.drawEntities(entities);

    // DRAW HUD
    this.drawHUD(delta);
  }
}
