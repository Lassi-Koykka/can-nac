import {Align, Position, Transform} from "./components";

export const rotateVector = (vecX: number, vecY: number, angle: number) => {
  let dx = vecX * Math.cos(angle) - vecY * Math.sin(angle);
  let dy = vecX * Math.sin(angle) + vecY * Math.cos(angle);

  return { x: dx, y: dy };
};

export const normalizeVector = (vec: { x: number, y: number}) => {
    if(vec.x === 0 && vec.y === 0) return vec;
    let mag = Math.sqrt(vec.x ** 2 + vec.y ** 2 )
    return {
      x: vec.x / mag,
      y: vec.y / mag,
    }
}

export const randomInt = (min: number = 0, max: number, wholeNum: boolean = true): number => {
    return wholeNum ? Math.floor(Math.random() * (max - min + 1)) + min : Math.random() * (max - min + 1) + min
}

export const getDistance = (x1: number, y1: number, x2: number, y2: number) =>  {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

export const scale = (number: number, inMin: number, inMax: number, outMin: number, outMax: number) => {
    return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

export const toRadians = (deg: number) => {
  return (deg * Math.PI) / 180;
}

export const getOrigin = ({x, y}: Position, {width, height, horizontalAlign, verticalAlign}: Transform) => {
  return {
    x: removeOffset(x, width, horizontalAlign),
    y: removeOffset(y, height, verticalAlign)
  }
  
};

const removeOffset = (coord: number, size: number, align: Align) => {
  switch (align) {
    case Align.START:
      return coord;
    case Align.CENTER:
      return Math.floor(coord - size / 2);
    case Align.END:
      return coord - size;
    default:
      return coord;
  }
}
