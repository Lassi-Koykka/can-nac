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
  Animations,
} from "../components";
import { Component, ECS } from "../ecs";
import {createAnimation} from "../utils";

export const spawnPlayer = (ecs: ECS, x: number, y: number) => {
  const player = ecs.addEntity();
  const components: Component[] = [
    new InputListener(),
    new Position(x, y),
    new Tag(EntityTag.PLAYER),
    new Transform(28, 28),
    new Collider(ColliderType.RECTANGLE),
    new Direction(0, -1),
    new Speed(80),
    new Health(3, 3),
    new Guns([{fireMode: FireMode.SEMIAUTO, fireRate: 120, bulletSize: 6, count: 1, damage: 1}]),
    new Sprite(SpriteType.SPRITE, "white", {x:0, y:0}),
    new Animations({"default": createAnimation([{x:0, y:0}]), "turning_right": createAnimation([{x:28, y:0}]), "turning_left": createAnimation([{x:56, y:0}])})

  ];

  components.forEach((c) => {
    ecs.addComponent(player, c);
  });

  return player;
};
