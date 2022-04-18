import {
  Health,
  Position,
  Sprite,
  Direction,
  SpriteType,
  Transform,
  InputListener,
  Speed,
  Guns,
  FireMode,
  Collider,
  ColliderType,
  Tag,
  EntityTag,
} from "../components";
import { Component, ECS } from "../ecs";

export const spawnPlayer = (ecs: ECS, x: number, y: number) => {
  const player = ecs.addEntity();
  const components: Component[] = [
    new Position(x, y),
    new Tag(EntityTag.PLAYER),
    new Transform(28, 28),
    new Collider(ColliderType.RECTANGLE),
    new Direction(0, -1),
    new Speed(80),
    new Health(3, 3),
    new Guns([{fireMode: FireMode.SEMIAUTO, fireRate: 120, bulletSize: 6, count: 1, damage: 1}]),
    new Sprite(SpriteType.STATIC, "white", {x:0, y:0}),
    new InputListener(),
  ];

  components.forEach((c) => {
    ecs.addComponent(player, c);
  });

  return player;
};
