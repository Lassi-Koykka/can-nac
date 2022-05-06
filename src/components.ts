import { Component } from "./ecs";
import {Align, ColliderType, EntityStatus, EntityTag, MovementPatternType, SpriteType} from "./enums";
import {AudioClip, Gun, SpriteAnimation} from "./types";
import {createAnimation} from "./utils";

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

export class MovementPattern extends Component {
  constructor(public type: MovementPatternType) {
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
    public currSprite: { x: number; y: number },
    public sprites: {[name: string]: { x: number, y: number}} = {}

  ) {
    super();
    sprites.default = currSprite
  }
}

export class Animations extends Component {
  public currFrame: number = 0
  public lastFrameTime: number = 0
  constructor(
    public animations: {"default": SpriteAnimation} & { [name: string]: SpriteAnimation } = { "default": createAnimation()},
    public state = "default",
  ){
    super();
  }

  setState(newState: string) {
    this.state = this.animations[newState] ? newState : "default"
    this.currFrame = 0
    this.lastFrameTime = 0
  }
}


export class AutofireGun extends Component {
  constructor(public gun: Gun, public defaultOffset: {x: number ,y: number}) {
    super();
  }
}

export class GunInventory extends Component {
  constructor(public gunList: Gun[], public active: number = 0 ) {
    super();
  }

  getActive() {
    return this.gunList[this.active]
  }
}
