import {
  Align,
  Animations,
  Collider,
  ColliderType,
  Damage,
  Direction,
  Status,
  Tag,
  EntityStatus,
  EntityTag,
  Position,
  Speed,
  Sprite,
  SpriteType,
  Transform,
} from "../components";
import { Component, ECS } from "../ecs";
import {createAnimation} from "../utils";


export type bulletType = "ball" | "wave" | "laser"
const BULLET_TYPES: {[key: string]: Component[]} = {
  "ball": [
    new Transform(6, 12, Align.CENTER, Align.CENTER),
    new Sprite(SpriteType.SPRITE, "yellow", {x: 0, y: 85}),
    new Animations({"default": createAnimation([{x: 0, y: 85}, {x: 7, y: 85}, {x: 14, y: 85}, {x: 21, y: 85}])})

  ],
  "wave": [
    new Transform(12, 4, Align.CENTER, Align.CENTER),
    new Sprite(SpriteType.SPRITE, "yellow", {x: 0, y: 99}),
    new Animations({"default": createAnimation([{x: 0, y: 99}, {x: 0, y: 103}])})
  ],
  "laser": [
    new Transform(4, 12, Align.CENTER, Align.CENTER),
    new Sprite(SpriteType.SPRITE, "yellow", {x: 14, y: 99}),
    new Animations({"default": createAnimation([{x: 14, y: 99}, {x: 19, y: 99}, {x: 24, y: 99}])})
  ],
}

export const spawnBullet = (
  ecs: ECS,
  x: number,
  y: number,
  bulletType: bulletType,
  status: EntityStatus = EntityStatus.FRIENDLY,
  dir: { x: number, y: number } = {x: 0, y: -1},
  damage: number = 1,
  speed: number = 160
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
    ...BULLET_TYPES[bulletType]
  ];

  components.forEach((c) => {
    ecs.addComponent(bullet, c);
  });

  return bullet;
};
