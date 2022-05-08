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
  AutofireGun,
} from "../components";
import { Component, ECS } from "../ecs";
import {ColliderType, EntityStatus, EntityTag, FireMode, MovementPatternType, SpriteType} from "../enums";
import {createAnimation, rotateVector, vecToDir} from "../utils";

export type enemyType = "large1" | "small1" | "small2" | "small3" | "small4"
const enemy_type_comps = (enemytype: enemyType): Component[] => {
  switch (enemytype) {
  case "large1": return [
    new Speed(30),
    new Health(5, 5),
    new Transform(28, 28),
    new Sprite(SpriteType.SPRITE, "blue", {x:28, y:56}),
    new Animations({
      default: createAnimation([{ x:28, y:56 }]),
      damage: createAnimation([{ x:84, y:56 }], "single", 12),
      death: animations.explosion_large,
    }),
    new MovementPattern(MovementPatternType.FOLLOW),
    new AutofireGun(
      {
        fireMode: FireMode.AUTO,
        fireRate: 60,
        damage: 1,
        bulletType: "ball_purple_small",
        bullets: [
          {dirX: 0, dirY: -1, offsetX: 0, offsetY: -14},
          {...vecToDir(rotateVector(0, -1, 45)), offsetX: 7, offsetY: -7},
          {dirX: 1, dirY: 0, offsetX: 14, offsetY: 0},
          {...vecToDir(rotateVector(0, 1, -45)), offsetX: 7, offsetY: 7},
          {dirX: 0, dirY: 1, offsetX: 0, offsetY: 14},
          {...vecToDir(rotateVector(0, 1, 45)), offsetX: -7, offsetY: 7},
          {dirX: -1, dirY: 0, offsetX: -14, offsetY: 0},
          {...vecToDir(rotateVector(0, -1, -45)), offsetX: -7, offsetY: -7},
        ]
      },
      {
        x: 14,
        y: 14
      }
    ),
  ]
  case "small1": return [
    new Speed(150),
    new Health(1, 1),
    new Transform(14, 14),
    new Sprite(SpriteType.SPRITE, "blue", {x:0, y:56}),
    new Animations({
      default: createAnimation([{ x:0, y:56 }]),
      damage: createAnimation([{ x:56, y:56 }], "single", 12),
      death: animations.explosion_small,
    })
  ]
  case "small2": return [
    new Speed(40),
    new Health(1, 1),
    new Transform(14, 14),
    new MovementPattern(MovementPatternType.HORIZONTAL_BAF),
    new Sprite(SpriteType.SPRITE, "blue", {x:14, y:56}),
    new AutofireGun(
      {
        fireMode: FireMode.AUTO,
        fireRate: 60,
        damage: 2,
        bulletType: "ball_purple",
        bullets: [
          {dirX: 0, dirY: 1},
        ]
      },
      {
        x: 7,
        y: 18
      }
    ),
    new Animations({
      default: createAnimation([{ x:14, y:56 }]),
      damage: createAnimation([{ x:70, y:56 }], "single", 12),
      death: animations.explosion_small,
    })
  ]
  case "small3": 
    return [
    new Speed(75),
    new Health(1, 1),
    new Transform(14, 14),
    new Sprite(SpriteType.SPRITE, "blue", {x:0, y:70}),
    new MovementPattern(MovementPatternType.SINE_HORIZONTAL),
    new Animations({
      default: createAnimation([{ x:0, y:70 }]),
      damage: createAnimation([{ x:56, y:70 }], "single", 12),
      death: animations.explosion_small,
    }),
    new AutofireGun(
      {
        fireMode: FireMode.AUTO,
        fireRate: 60,
        damage: 2,
        bulletType: "ball_purple_small",
        bullets: [
          vecToDir(rotateVector(0, 1, 45)),
          vecToDir(rotateVector(0, 1, -45)),
        ]
      },
      {
        x: 7,
        y: 18
      }
    ),
  ]
  case "small4":
  return [
    new Speed(20),
    new Health(1, 1),
    new Transform(14, 14),
    new Sprite(SpriteType.SPRITE, "blue", {x:14, y:70}),
    new MovementPattern(MovementPatternType.SINE_VERTICAL),
    new Animations({
      default: createAnimation([{ x:14, y:70 }]),
      damage: createAnimation([{ x:70, y:70 }], "single", 12),
      death: animations.explosion_small,
    }),
    new AutofireGun(
      {
        fireMode: FireMode.AUTO,
        fireRate: 60,
        damage: 1,
        bulletType: "laser_h",
        bullets: [
          {dirX: 1, dirY: 0, offsetX: 7, offsetY: 0},
          {dirX: -1, dirY: 0, offsetX: -7, offsetY: 0},
        ]
      },
      {
        x: 7,
        y: 8
      }
    ),
  ]
  }
}

export const spawnEnemy = (ecs: ECS, x: number, y: number, enemyType: enemyType) => {
  const enemy = ecs.addEntity();
  let components: Component[] = [
    new Position(x, y),
    new Tag(EntityTag.ENEMY),
    new Status(EntityStatus.ENEMY),
    new Collider(ColliderType.RECTANGLE),
    new Direction(0, 1),
    ...enemy_type_comps(enemyType)
  ];

  components.forEach((c) => {
    ecs.addComponent(enemy, Object.create(c));
  });

  return enemy;
};
