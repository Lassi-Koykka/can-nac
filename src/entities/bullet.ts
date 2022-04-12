import {Align, Collider, ColliderTag, ColliderType, Damage, Direction, Position, Speed, Sprite, SpriteType, Transform} from "../components";
import {Component, ECS} from "../ecs";

export const spawnBullet = (ecs: ECS, x: number, y: number, bulletSize: number, damage: number) => {
    const player = ecs.addEntity()
    const components: Component[] = [
        new Position(x, y),
        new Damage(damage),
        new Collider(ColliderType.RECTANGLE, ColliderTag.PROJECTILE),
        new Transform(bulletSize, bulletSize, Align.CENTER, Align.CENTER),
        new Direction(1, 0),
        new Speed(160),
        new Sprite(SpriteType.PLACEHOLDER, "red"),
    ]

    components.forEach(c => {
        ecs.addComponent(player, c)
    });

    return player;
}
