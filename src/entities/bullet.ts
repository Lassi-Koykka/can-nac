import {
  Align,
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

export const spawnBullet = (
  ecs: ECS,
  x: number,
  y: number,
  dir: { x: number, y: number },
  bulletSize: number | {width: number, height: number},
  damage: number,
  status: EntityStatus
) => {
  const player = ecs.addEntity();
  const components: Component[] = [
    new Tag(EntityTag.PROJECTILE),
    new Status(status),
    new Position(x, y),
    new Damage(damage),
    new Collider(ColliderType.RECTANGLE),
    (typeof bulletSize === "number" 
      ? new Transform(bulletSize, bulletSize, Align.CENTER, Align.CENTER)
      : new Transform(bulletSize.width, bulletSize.height, Align.CENTER, Align.CENTER)),
    new Direction(dir.x, dir.y),
    new Speed(160),
    new Sprite(SpriteType.STATIC, "yellow", {x: 15, y: 29}),
  ];

  components.forEach((c) => {
    ecs.addComponent(player, c);
  });

  return player;
};
