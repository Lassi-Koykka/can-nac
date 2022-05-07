export const INPUT = {
  UP: ["w", "arrowup"],
  DOWN: ["s", "arrowdown"],
  LEFT: ["a", "arrowleft"],
  RIGHT: ["d", "arrowright"],
  ACTION1: [" "],
  MENU: ["escape"],
  RESTART: ["r"]
};

export const keyDown = (input: keyof typeof INPUT) =>
  INPUT[input].some((key) => KEYMAP[key]);
export const keyPress = (input: keyof typeof INPUT) =>
  INPUT[input].some((key) => KEYMAP[key]) &&
  INPUT[input].every((key) => !KEYMAP_PREV[key]);
export const keyUp = (input: keyof typeof INPUT) =>
  INPUT[input].some((key) => !KEYMAP[key]) &&
  INPUT[input].every((key) => KEYMAP_PREV[key]);

