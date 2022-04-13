import {Health, Position, Sprite, Direction, SpriteType, Transform, InputListener, Speed, Gun, FireMode, Collider, ColliderType, ColliderTag} from "../components";
import {Component, ECS} from "../ecs";


export const spawnEnemy = (ecs: ECS, x: number, y: number) => {
    const enemy = ecs.addEntity()
    const components: Component[] = [
        new Position(x, y),
        new Transform(10, 10),
        new Collider(ColliderType.RECTANGLE, ColliderTag.ENEMY),
        new Direction(-1, 0),
        new Speed(20),
        new Health(3, 3),
        new Sprite(SpriteType.PLACEHOLDER, "blue"),
    ]

    components.forEach(c => {
        ecs.addComponent(enemy, c)
    });

    return enemy;
}
