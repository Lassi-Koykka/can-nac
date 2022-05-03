import { Animations, Sprite } from "../components";
import { Entity, System } from "../ecs";

export default class AnimationSystem extends System {
  componentsRequired = new Set<Function>([Animations, Sprite]);

  public update(entities: Set<Entity>, _: number): void {
    entities.forEach((e) => {
      const comps = this.ecs.getComponents(e);
      let sprite = comps.get(Sprite);
      let a = comps.get(Animations);
      const now = new Date().getTime();

      // If animation not found, set defaults
      if (a.animations[a.state] === undefined) {
        a.setState("default");
      }

      let animation = a.animations[a.state];
      const frameDuration = 1000 / animation.fps;

      // If animation has no frames, don't do anything
      if (animation.frames.length < 1) return;

      if (!a.lastFrameTime) a.lastFrameTime = now;

      if (
        (now - a.lastFrameTime > frameDuration &&
          sprite.currSprite !== animation.frames[a.currFrame]) ||
        !animation.frames.includes(sprite.currSprite)
      ) {
        // Animation types
        if (animation.type === "loop")
          a.currFrame = a.currFrame % animation.frames.length;
        else if (
          animation.type === "single" &&
          a.currFrame >= animation.frames.length
        ) {
          if(animation.callback) {
            animation.callback(this.ecs, e);
            return;
          }
        } else if (
          animation.type === "hold" &&
          a.currFrame >= animation.frames.length
        )
          a.currFrame = animation.frames.length - 1;

        const frameCoords = animation.frames[a.currFrame];
        sprite.currSprite = frameCoords;
        a.lastFrameTime = now;
        a.currFrame += 1;
      }
    });
  }
}
