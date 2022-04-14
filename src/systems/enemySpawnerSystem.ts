import {Position, Status, Tag} from "../components";
import {Entity, System} from "../ecs";

export default class EnemySpawnerSystem extends System {
  height: number
  maxEnemyCount: number
  timeSinceLastSpawn: number
  componentsRequired = new Set<Function>([Position, Status, Tag]);

  constructor(height: number, maxEnemyCount: number) {
    super()
    this.height = height
    this.maxEnemyCount = maxEnemyCount
    this.timeSinceLastSpawn = 0
  }

  public update(entities: Set<Entity>, _: number): void {

  }
}
