import { Animations, Sprite } from "../components";
import { Entity, System } from "../ecs";

export default class AnimationSystem extends System {

  componentsRequired = new Set<Function>([Animations, Sprite]);
  
  public update(entities: Set<Entity>, _: number): void {
    entities.forEach((e) => {
      const comps = this.ecs.getComponents(e);
      //@ts-ignore
      let sprite = comps.get(Sprite);
      let a =
        comps.get(Animations);
      const now = new Date().getTime();

      // If animation not found, set defaults
      if (a.animations[a.state] === undefined) {
        a.state = "default";
        a.currFrame = 0;
        a.lastFrameTime = now;
      }

      let animation = a.animations[a.state];
      const frameDuration = 1000 / animation.fps;
      
      // If animation has no frames, don't do anything
      if (animation.frames.length < 1) return;

      if (now - a.lastFrameTime > frameDuration || sprite.coords !== animation.frames[a.currFrame]) {
        a.currFrame += 1
        if(animation.type === "loop")
          a.currFrame = a.currFrame % animation.frames.length;
        else if(animation.type === "single" && a.currFrame >= animation.frames.length) {
          a.state = "default";
          a.currFrame = 0;
          a.lastFrameTime = now;
        }
        console.log(a.currFrame)

        const frameCoords = animation.frames[a.currFrame];
        sprite.coords = frameCoords;
        a.lastFrameTime = now;
      }
    });
  }
}
