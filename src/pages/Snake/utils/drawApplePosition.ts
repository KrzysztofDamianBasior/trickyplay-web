import { getRandomInt } from "../../../shared/utils/getRandomInt";
import { checkIfAppleEaten } from "./checkIfAppleEaten";

export const drawApplePosition = (
  snake: number[][],
  apples: [number, number][],
  canvasSize: [number, number],
  scale: number
) => {
  let newApplePosition: [number, number] = [
    getRandomInt(0, canvasSize[0] / scale),
    getRandomInt(0, canvasSize[1] / scale),
  ];

  while (
    checkIfAppleEaten(snake, newApplePosition) ||
    apples.some(
      (apple) => JSON.stringify(apple) === JSON.stringify(newApplePosition)
    )
  ) {
    newApplePosition = [
      getRandomInt(0, canvasSize[0] / scale),
      getRandomInt(1, canvasSize[0] / scale),
    ];
  }
  return newApplePosition;
};
