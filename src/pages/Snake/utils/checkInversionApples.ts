import { checkIfAppleEaten } from "./checkIfAppleEaten";
import { drawApplePosition } from "./drawApplePosition";

export const checkInversionApples = (
  snake: number[][],
  inversionApples: [number, number][],
  pointApples: [number, number][],
  canvasSize: [number, number],
  scale: number
): [number, number][] | null => {
  let newInversionApples = [...inversionApples];
  for (
    let appleIndex = 0;
    appleIndex < newInversionApples.length;
    appleIndex++
  ) {
    if (checkIfAppleEaten(snake, newInversionApples[appleIndex])) {
      newInversionApples.splice(appleIndex, 1);
      const newApplePosition = drawApplePosition(
        snake,
        [...pointApples, ...newInversionApples],
        canvasSize,
        scale
      );
      newInversionApples.push(newApplePosition);
      return newInversionApples;
    }
  }
  return null;
};
