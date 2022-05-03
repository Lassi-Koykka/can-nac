import animations from "../animations";
import {
  Health,
  Position,
  Sprite,
  Direction,
  Transform,
  Speed,
  Collider,
  Status,
  Tag,
  MovementPattern,
  Animations,
} from "../components";
import { Component, ECS } from "../ecs";
import {ColliderType, EntityStatus, EntityTag, MovementPatternType, SpriteType} from "../enums";
import {createAnimation} from "../utils";

export type enemyType = "large1" | "small1" | "small2" | "small3" | "small4"
const ENEMY_TYPES: {[key: string]: Component[]} = {
  "large1": [
    new Speed(20),
    new Health(3, 3),
    new Transform(28, 28),
    new Sprite(SpriteType.SPRITE, "blue", {x:28, y:56}),
    new Animations({
      default: createAnimation([{ x:28, y:56 }]),
      death: animations.explosion_large,
    })
  ],
  "small1": [
    new Speed(120),
    new Health(1, 1),
    new Transform(14, 14),
    new Sprite(SpriteType.SPRITE, "blue", {x:0, y:56}),
    new Animations({
      default: createAnimation([{ x:0, y:56 }]),
      death: animations.explosion_small,
    })
  ],
  "small2": [
    new Speed(20),
    new Health(1, 1),
    new Transform(14, 14),
    new Sprite(SpriteType.SPRITE, "blue", {x:14, y:56}),
    new Animations({
      default: createAnimation([{ x:14, y:56 }]),
      death: animations.explosion_small,
    })
  ],
  "small3": [
    new Speed(75),
    new Health(1, 1),
    new Transform(14, 14),
    new Sprite(SpriteType.SPRITE, "blue", {x:0, y:70}),
    new MovementPattern(MovementPatternType.SINE_HORIZONTAL),
    new Animations({
      default: createAnimation([{ x:0, y:70 }]),
      death: animations.explosion_small,
    })
  ],
  "small4": [
    new Speed(20),
    new Health(1, 1),
    new Transform(14, 14),
    new Sprite(SpriteType.SPRITE, "blue", {x:14, y:70}),
    new Animations({
      default: createAnimation([{ x:14, y:70 }]),
      death: animations.explosion_small,
    })
  ]
}

export const spawnEnemy = (ecs: ECS, x: number, y: number, enemyType: enemyType) => {
  const enemy = ecs.addEntity();
  let components: Component[] = [
    new Position(x, y),
    new Tag(EntityTag.ENEMY),
    new Status(EntityStatus.ENEMY),
    new Collider(ColliderType.RECTANGLE),
    new Direction(0, 1),
    ...ENEMY_TYPES[enemyType]
  ];
  

  components.forEach((c) => {
    ecs.addComponent(enemy, Object.create(c));
  });

  return enemy;
};
