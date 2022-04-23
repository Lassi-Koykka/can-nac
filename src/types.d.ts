import {System} from "./ecs";
import { FireMode } from "./enums";

// Global types
declare global {
  var KEYMAP: Keymap;
  var KEYMAP_PREV: Keymap;
  var AUDIO_MANAGER: IAudioManager;
  var SYSTEMS: { [name: string]: System}
}

export interface GameState {
  state: "running" | "paused";
  scene: "menu" | "game";
  score: number;
  lives: number;
}

export type Keymap = { [key: string]: boolean | undefined };

// Component types
export type soundClipType = "explosion" | "laserShot" | "death" | "hitHurt";
export type bulletType = "ball" | "wave" | "laser";
export type AnimationType = "loop" | "single" | "hold";
export type AnimationFrames = { x: number; y: number }[];

export interface SpriteAnimation {
  type: AnimationType;
  frames: AnimationFrames;
  fps: number;
}

export interface Gun {
  fireMode: FireMode;
  fireRate: number;
  bulletSize: number;
  damage: number;
  bulletType: bulletType;
  bulletDirections: { x: number; y: number }[];
  lastShotTime?: number;
}

export interface AudioClip {
  clip: soundClipType;
  playing: boolean;
}

interface IAudioClipBuffers {
  [key: string]: AudioBuffer;
}
interface IAudioManager {
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
