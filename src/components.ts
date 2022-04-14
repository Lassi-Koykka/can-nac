import { Component } from "./ecs";

export enum SpriteType {
  PLACEHOLDER,
  STATIC,
  ANIMATED,
}

export enum Align {
  START,
  CENTER,
  END,
}

export enum EntityTag {
  PLAYER,
  PROJECTILE,
  ENEMY,
}

export enum EntityStatus {
  FRIENDLY,
  NEUTRAL,
  ENEMY,
}

export enum ColliderType {
  RECTANGLE,
  CIRCLE
}

export enum FireMode {
  SEMIAUTO,
  AUTO,
  BURST
}


export class Position extends Component {
  constructor(public x: number, public y: number) {
    super();
  }
}

export class Direction extends Component {
  constructor(public x: number, public y: number) {
    super();
  }
}

export class Speed extends Component {
  constructor(public value: number) {
    super();
  }
}

export class Collider extends Component {
  constructor(public type: ColliderType) {
    super();
  }
}

export class Health extends Component {
  constructor(public max: number, public curr: number) {
    super();
  }
}

export class Damage extends Component {
  constructor(public value: number) {
    super();
  }
}

export class Transform extends Component {
  constructor(
    public width: number,
    public height: number,
    public horizontalAlign: Align = Align.START,
    public verticalAlign: Align = Align.START
  ) {
    super();
  }
}

export class InputListener extends Component {
  constructor() {
    super();
  }
}

export class Tag extends Component {
  constructor(public value: EntityTag) {
    super();
  }
}

export class Status extends Component {
  constructor(public value: EntityStatus) {
    super();
  }
}

export class Sprite extends Component {
  constructor(public spriteType: SpriteType, public source: string) {
    super();
  }
}

export class Gun extends Component {
  constructor(public fireMode: FireMode, public fireRate: number, public bulletSize: number, public count: number, public damage: number) {
    super();
  }
}
