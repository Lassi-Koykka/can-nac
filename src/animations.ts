import { createAnimation } from "./utils";

const animations = {
  ship1_default: createAnimation([{ x: 0, y: 0 }]),
  ship1_turning_right: createAnimation(
    [
      { x: 28, y: 0 },
      { x: 56, y: 0 },
    ],
    "hold"
  ),
  ship1_turning_left: createAnimation(
    [
      { x: 84, y: 0 },
      { x: 112, y: 0 },
    ],
    "hold"
  ),
  explosion_small: createAnimation(
    [
      { x: 84, y: 112 },
      { x: 98, y: 112 },
      { x: 84, y: 126 },
    ],
    "single",
    12,
    (ecs, entity) => ecs.removeEntity(entity)
  ),
  explosion_large: createAnimation(
    [
      { x: 0, y: 112 },
      { x: 28, y: 112 },
      { x: 56, y: 112 },
    ],
    "single",
    12,
    (ecs, entity) => ecs.removeEntity(entity)
  ),
};
export default animations;
