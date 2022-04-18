import {EntityTag, Position, Status, Tag} from "../components";
import {Entity, System} from "../ecs";
import {spawnEnemy} from "../entities/enemy";
import {randomInt} from "../utils";

export default class EnemySpawnerSystem extends System {
  width: number
  maxEnemyCount: number
  spawnCooldown: number
  lastSpawn: number = 0
  componentsRequired = new Set<Function>([Position, Status, Tag]);

  constructor(width: number, maxEnemyCount: number, spawnCooldown: number = 1) {
    super()
    this.width = width
    this.maxEnemyCount = maxEnemyCount
    this.spawnCooldown = spawnCooldown * 1000;
  }

  public update(entities: Set<Entity>, _: number): void {

    const now = (new Date()).getTime()
    const currEnemyCount = Array.from(entities).filter(e => {
      const components = this.ecs.getComponents(e)
      const { value: tag } = components.get(Tag)
      if(tag === EntityTag.ENEMY) return true;
      return false
    }).length; 

    if(currEnemyCount < this.maxEnemyCount && now - this.lastSpawn > this.spawnCooldown ) {
      spawnEnemy(this.ecs, randomInt(0, this.width - 28), -28)
      this.lastSpawn = now

    }

  }
}
