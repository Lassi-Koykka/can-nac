import animations from "../animations";
import {
  Health,
  Position,
  Sprite,
  Direction,
  Transform,
  InputListener,
  Speed,
  GunInventory,
  Collider,
  Tag,
  Animations,
} from "../components";
import { Component, ECS } from "../ecs";
import {ColliderType, EntityTag, FireMode, SpriteType} from "../enums";
import { createAnimation, rotateVector } from "../utils";

const vecToDir = ({x,y}: {x: number, y: number}) => ({dirX: x, dirY: y})
export const spawnPlayer = (ecs: ECS, x: number, y: number) => {
  const player = ecs.addEntity();
  const components: Component[] = [
    new InputListener(),
    new Position(x, y),
    new Tag(EntityTag.PLAYER),
    new Transform(28, 28),
    new Collider(ColliderType.RECTANGLE),
    new Direction(0, -1),
    new Speed(120),
    new Health(3, 3),
    new GunInventory([
      {
        fireMode: FireMode.AUTO,
        fireRate: 300,
        damage: 1,
        bulletType: "default",
        bullets: [
          {dirX: 0, dirY: -1},
          // {x: -1, y: 0},
          // {x: 1, y: 0},
          vecToDir(rotateVector(0, -1, 45)),
          vecToDir(rotateVector(0, -1, -45))
        ]
      },
    ]),
    new Sprite(SpriteType.SPRITE, "white", { x: 0, y: 0 }),
    new Animations({
      default: animations.ship1_default,
      turning_right: animations.ship1_turning_right,
      turning_left: animations.ship1_turning_left,
      death: animations.explosion_large
    }),
  ];

  components.forEach((c) => {
    ecs.addComponent(player, Object.create(c));
  });

  return player;
};
