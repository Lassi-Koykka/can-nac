declare global {
  var keymap: Keymap;
  var keymapLastFrame: Keymap;
}

export type Keymap = { [key: string]: boolean | undefined }
