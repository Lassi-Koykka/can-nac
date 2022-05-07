import {ECS, System} from "./ecs";
import { FireMode } from "./enums";

// Global types
declare global {
  var GAMESTATE: GameState;
  var KEYMAP: Keymap;
  var KEYMAP_PREV: Keymap;
  var AUDIO_MANAGER: IAudioManager;
  var SYSTEMS: { [name: string]: System};
  var restart: () => void
}

export interface GameState {
  scene: "menu" | "game";
  level: number;
  paused: boolean;
  score: number;
  lives: number;
}

export type Keymap = { [key: string]: boolean | undefined };

// Component types
export type soundClipType = "explosion" | "laserShot" | "death" | "hitHurt";
export type AnimationType = "loop" | "single" | "hold";
export type AnimationFrames = { x: number; y: number }[];

export interface SpriteAnimation {
  type: string;
  frames: AnimationFrames;
  fps: number;
  callback?: (ecs: ECS, entity: number) => void
}

export interface Gun {
  fireMode: FireMode;
  fireRate: number;
  damage: number;
  bulletType: string;
  bullets: { dirX: number; dirY: number, offsetX?: number, offsetY?: number }[];
  lastShotTime?: number;
}

export interface AudioClip {
  clip: soundClipType;
  playing: boolean;
}

export interface IAudioClipBuffers {
  [key: string]: AudioBuffer;
}
export interface IAudioManager {
  audioCtx: AudioContext;
  buffers: IAudioClipBuffers;
  playClip: (
    clip: string,
    options?: {
      volume?: number;
      when?: number;
      offset?: number;
      duration?: number;
      loop?: boolean;
    }
  ) => void;
}

export interface IFont {
  img: HTMLImageElement;
  characterIndexes: { [key: string]: number };
  charWidth: number,
  charHeight: number;
  caseSensitive: boolean;
}
