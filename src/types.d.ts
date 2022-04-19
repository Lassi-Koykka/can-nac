declare global {
  var keymap: Keymap;
  var keymapLastFrame: Keymap;
}

export interface GameState {
  state: "running" | "paused"
  scene: "menu" | "game"
  score: number,
  lives: number
}


export type Keymap = { [key: string]: boolean | undefined }
