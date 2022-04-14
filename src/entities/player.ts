import {
  Health,
  Position,
  Sprite,
  Direction,
  SpriteType,
  Transform,
  InputListener,
  Speed,
  Gun,
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
    new Transform(16, 16),
    new Collider(ColliderType.RECTANGLE),
    new Direction(1, 0),
    new Speed(80),
    new Health(3, 3),
    new Gun(FireMode.SEMIAUTO, 120, 4, 1, 1),
    new Sprite(SpriteType.PLACEHOLDER, "white"),
    new InputListener(),
  ];

  components.forEach((c) => {
    ecs.addComponent(player, c);
  });

  return player;
};
