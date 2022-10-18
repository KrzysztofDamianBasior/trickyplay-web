import { drawApplePosition } from "./drawApplePosition";
import { checkIfAppleEaten } from "./checkIfAppleEaten";

export const checkPointsApples = (
  snake: number[][],
  pointApples: [number, number][],
  inversionApples: [number, number][],
  canvasSize: [number, number],
  scale: number
): [number, number][] | null => {
  let newPointApples = [...pointApples];

  for (let appleIndex = 0; appleIndex < newPointApples.length; appleIndex++) {
    if (
      newPointApples[appleIndex][0] > canvasSize[0] ||
      newPointApples[appleIndex][1] > canvasSize[1]
    ) {
      newPointApples.splice(appleIndex, 1);
      const newApplePosition = drawApplePosition(
        snake,
        [...newPointApples, ...inversionApples],
        canvasSize,
        scale
      );
      newPointApples.push(newApplePosition);
    }
  }
  for (let appleIndex = 0; appleIndex < newPointApples.length; appleIndex++) {
    if (checkIfAppleEaten(snake, newPointApples[appleIndex])) {
      newPointApples.splice(appleIndex, 1);
      const newApplePosition = drawApplePosition(
        snake,
        [...newPointApples, ...inversionApples],
        canvasSize,
        scale
      );
      newPointApples.push(newApplePosition);
      return newPointApples;
    }
  }
  return null;
};
