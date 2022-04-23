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
import {Align, ColliderType, EntityStatus, EntityTag, SpriteType} from "../enums";
import {createAnimation} from "../utils";
import { bulletType } from "../types";


const BULLET_TYPES: {[key: string]: Component[]} = {
  "ball": [
    new Transform(6, 12, Align.CENTER, Align.CENTER),
    new Sprite(SpriteType.SPRITE, "yellow", {x: 0, y: 85}),
    new Animations({"default": createAnimation([{x: 0, y: 85}, {x: 7, y: 85}, {x: 14, y: 85}, {x: 21, y: 85}], "loop", 12)})

  ],
  "wave": [
    new Transform(12, 4, Align.CENTER, Align.CENTER),
    new Sprite(SpriteType.SPRITE, "yellow", {x: 0, y: 99}),
    new Animations({"default": createAnimation([{x: 0, y: 99}, {x: 0, y: 103}], "loop", 12)})
  ],
  "laser": [
    new Transform(4, 12, Align.CENTER, Align.CENTER),
    new Sprite(SpriteType.SPRITE, "yellow", {x: 14, y: 99}),
    new Animations({"default": createAnimation([{x: 14, y: 99}, {x: 19, y: 99}, {x: 24, y: 99}], "loop", 12)})
  ],
}

export const spawnBullet = (
  ecs: ECS,
  status: EntityStatus = EntityStatus.FRIENDLY,
  x: number,
  y: number,
  dir: { x: number, y: number } = {x: 0, y: -1},
  bulletType: bulletType,
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
    ...BULLET_TYPES[bulletType]
  ];

  components.forEach((c) => {
    ecs.addComponent(bullet, c);
  });

  return bullet;
};
