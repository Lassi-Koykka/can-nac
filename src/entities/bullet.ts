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
  bulletSize: number,
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
    new Transform(bulletSize, bulletSize, Align.CENTER, Align.CENTER),
    new Direction(1, 0),
    new Speed(160),
    new Sprite(SpriteType.PLACEHOLDER, "red"),
  ];

  components.forEach((c) => {
    ecs.addComponent(player, c);
  });

  return player;
};
