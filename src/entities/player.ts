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
import { rotateVector, vecToDir } from "../utils";

export const spawnPlayer = (ecs: ECS, x: number = canvas.width / 2 - 14, y: number = canvas.height - 50) => {
  const player = ecs.addEntity();
  GAMESTATE.playerEntity = player
  const components: Component[] = [
    new InputListener(),
    new Position(x, y),
    new Tag(EntityTag.PLAYER),
    new Transform(28, 28),
    new Collider(ColliderType.RECTANGLE),
    new Direction(0, -1),
    new Speed(120),
    new Health(5, 5),
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
      {
        fireMode: FireMode.AUTO,
        fireRate: 200,
        damage: 2,
        bulletType: "wave_u",
        bullets: [
          {dirX: 0, dirY: -1, offsetY: 7},
          {dirX: -1, dirY: 0, offsetX: -14, offsetY: 14, type: "wave_l"},
          {dirX: 1, dirY: 0, offsetX: 14, offsetY: 14, type: "wave_r"},
          ]
      },
      {
        fireMode: FireMode.AUTO,
        fireRate: 80,
        damage: 4,
        bulletType: "ball_green",
        bullets: [
          {dirX: 0, dirY: -1, offsetY: 7},
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
