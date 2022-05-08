import {
  Animations,
  Collider,
  Damage,
  Direction,
  Status,
  Tag,
  Position,
  Speed,
  Sprite,
  Transform,
} from "../components";
import { Component, ECS } from "../ecs";
import {
  Align,
  ColliderType,
  EntityStatus,
  EntityTag,
  SpriteType,
} from "../enums";
import { Gun } from "../types";
import { createAnimation } from "../utils";

export const bullet_type_comps = (bulletType: string): Component[] => {
  switch (bulletType) {
    case "ball_purple":
      return [
        new Transform(12, 12, Align.CENTER, Align.CENTER),
        new Sprite(SpriteType.SPRITE, "green", { x: 58, y: 85 }),
        // new Animations({"default": createAnimation([{x: 0, y: 85}, {x: 7, y: 85}, {x: 14, y: 85}, {x: 21, y: 85}], "loop", 12)})
      ];
    case "ball_green":
      return [
        new Transform(12, 12, Align.CENTER, Align.CENTER),
        new Sprite(SpriteType.SPRITE, "purple", { x: 70, y: 85 }),
        // new Animations({"default": createAnimation([{x: 0, y: 85}, {x: 7, y: 85}, {x: 14, y: 85}, {x: 21, y: 85}], "loop", 12)})
      ];
    case "ball_purple_small":
      return [
        new Transform(5, 5, Align.CENTER, Align.CENTER),
        new Sprite(SpriteType.SPRITE, "green", { x: 57, y: 99 }),
        // new Animations({"default": createAnimation([{x: 0, y: 85}, {x: 7, y: 85}, {x: 14, y: 85}, {x: 21, y: 85}], "loop", 12)})
      ];
    case "ball_green_small":
      return [
        new Transform(5, 5, Align.CENTER, Align.CENTER),
        new Sprite(SpriteType.SPRITE, "purple", { x: 62, y: 99 }),
        // new Animations({"default": createAnimation([{x: 0, y: 85}, {x: 7, y: 85}, {x: 14, y: 85}, {x: 21, y: 85}], "loop", 12)})
      ];
    case "wave_u":
      return [
        new Transform(12, 5, Align.CENTER, Align.CENTER),
        new Sprite(SpriteType.SPRITE, "yellow", { x: 1, y: 99 }),
      ];
    case "wave_d":
      return [
        new Transform(12, 5, Align.CENTER, Align.CENTER),
        new Sprite(SpriteType.SPRITE, "yellow", { x: 1, y: 105 }),
      ];
    case "wave_l":
      return [
        new Transform(5, 12, Align.CENTER, Align.CENTER),
        new Sprite(SpriteType.SPRITE, "yellow", { x: 1, y: 85 }),
      ];
    case "wave_r":
      return [
        new Transform(5, 12, Align.CENTER, Align.CENTER),
        new Sprite(SpriteType.SPRITE, "yellow", { x: 8, y: 85 }),
      ];
    case "laser_h":
      return [
        new Transform(12, 4, Align.CENTER, Align.CENTER),
        new Sprite(SpriteType.SPRITE, "yellow", { x: 15, y: 83 }),
        new Animations({
          default: createAnimation(
            [
              { x: 15, y: 84 },
              { x: 15, y: 89 },
              { x: 15, y: 94 },
            ],
            "loop",
            12
          ),
        }),
      ];
    case "laser_v":
      return [
        new Transform(4, 12, Align.CENTER, Align.CENTER),
        new Sprite(SpriteType.SPRITE, "yellow", { x: 14, y: 99 }),
        new Animations({
          default: createAnimation(
            [
              { x: 14, y: 99 },
              { x: 19, y: 99 },
              { x: 24, y: 99 },
            ],
            "loop",
            12
          ),
        }),
      ];
    default:
      return [
        new Transform(8, 8, Align.CENTER, Align.CENTER),
        new Sprite(
          SpriteType.DIRECTIONAL_SPRITE,
          "yellow",
          { x: 38, y: 86 },
          {
            N: { x: 38, y: 86 },
            NE: { x: 46, y: 86 },
            E: { x: 46, y: 94 },
            SE: { x: 46, y: 102 },
            S: { x: 38, y: 102 },
            SW: { x: 30, y: 102 },
            W: { x: 30, y: 94 },
            NW: { x: 30, y: 86 },
          }
        ),
      ];
  }
};

const spawnBullet = (
  ecs: ECS,
  status: EntityStatus = EntityStatus.FRIENDLY,
  x: number,
  y: number,
  dir: { x: number; y: number } = { x: 0, y: -1 },
  bulletType: string,
  damage: number = 1,
  speed: number = 200
) => {
  const bullet = ecs.addEntity();
  const components: Component[] = [
    new Tag(EntityTag.PROJECTILE),
    new Status(status),
    new Position(x, y),
    new Damage(damage),
    new Speed(speed),
    new Collider(ColliderType.RECTANGLE),
    new Direction(dir.x, dir.y),
    ...bullet_type_comps(bulletType),
  ];

  components.forEach((c) => {
    ecs.addComponent(bullet, Object.create(c));
  });

  return bullet;
};

export const shoot = (
  ecs: ECS,
  gun: Gun,
  pos: Position,
  status: EntityStatus,
  defaultOffset: { x: number; y: number } = { x: 0, y: 0 }
) => {
  const fireDelay = 60000 / gun.fireRate;
  const now = new Date().getTime();
  if (!gun.lastShotTime || now - gun.lastShotTime > fireDelay) {
    AUDIO_MANAGER.playClip("laserShot");
    gun.lastShotTime = now;
    gun.bullets.forEach(({ dirX, dirY, offsetX, offsetY, type }) => {
      spawnBullet(
        ecs,
        status,
        pos.x + (offsetX ? defaultOffset.x + offsetX : defaultOffset.x),
        pos.y + (offsetY ? defaultOffset.y + offsetY : defaultOffset.y),
        { x: dirX, y: dirY },
        type ?? gun.bulletType,
        gun.damage
      );
    });
  }
};
