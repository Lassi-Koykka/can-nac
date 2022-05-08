import { Position, Status, Tag } from "../components";
import { Entity, System } from "../ecs";
import { enemyType, spawnEnemy } from "../entities/enemy";
import { EntityTag } from "../enums";
import { randomInt } from "../utils";

export default class EnemySpawnerSystem extends System {
  baseMaxEnemyCount: number;
  spawnCooldown: number;
  lastSpawn: number = 0;
  componentsRequired = new Set<Function>([Position, Status, Tag]);

  constructor(maxEnemyCount: number, spawnCooldown: number = 1.5) {
    super();
    this.baseMaxEnemyCount = maxEnemyCount;
    this.spawnCooldown = spawnCooldown * 1000;
  }

  public update(entities: Set<Entity>, _: number): void {
    const now = new Date().getTime();
    const currEnemyCount = Array.from(entities).filter((e) => {
      const components = this.ecs.getComponents(e);
      const { value: tag } = components.get(Tag);
      if (tag === EntityTag.ENEMY) return true;
      return false;
    }).length;

    const modifier= Math.floor(GAMESTATE.score / 75)

    if (
      currEnemyCount <
        this.baseMaxEnemyCount + modifier  &&
      now - this.lastSpawn > this.spawnCooldown - (modifier * 0.05)
    ) {
      const enemyList: enemyType[] = [
        "large1",
        "small1",
        "small2",
        "small3",
        "small4",
      ];
      // const enemyList: enemyType[] = ["small2"]
      const rndEnemy = enemyList[Math.floor(Math.random() * enemyList.length)];
      let spawnX = randomInt(0, canvas.width - 28);
      let spawnY = -28;

      spawnEnemy(this.ecs, spawnX, spawnY, rndEnemy);
      this.lastSpawn = now;
    }
  }
}
