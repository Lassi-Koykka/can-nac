import { Component } from "./ecs";
import {createAnimation} from "./utils";

export enum SpriteType {
  PLACEHOLDER,
  SPRITE
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
  CIRCLE,
}

export enum FireMode {
  SEMIAUTO,
  AUTO,
  BURST,
}

export interface Gun {
  fireMode: FireMode;
  fireRate: number;
  bulletSize: number;
  count: number;
  damage: number;
}

export type AnimationType = "loop" | "single"
export type AnimationFrames = {x: number, y: number}[]
export interface SpriteAnimation { type: AnimationType, frames: AnimationFrames, fps: number }

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
  constructor(
    public spriteType: SpriteType,
    public style: string,
    public coords: { x: number; y: number }
  ) {
    super();
  }
}

export class Animations extends Component {
  constructor(
    public animations: { [name: string]: SpriteAnimation } = { "default": createAnimation()},
    public state = "default",
    public currFrame = 0,
    public lastFrameTime = 0
  ){
    super();
  }
}

export class Guns extends Component {
  constructor(public gunList: Gun[], public active: number = 0 ) {
    super();
  }
}
