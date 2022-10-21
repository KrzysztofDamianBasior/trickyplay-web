import { getRandomInt } from "../../../shared/utils";
import { checkObjectEquality } from "../../../shared/utils";

const drawMinesPositions = (
  boardSize: number,
  numberOfMines: number,
  row: number,
  column: number
): number[][] => {
  const minesPositions: number[][] = [];
  while (minesPositions.length < numberOfMines) {
    let newPosition = [getRandomInt(0, boardSize), getRandomInt(0, boardSize)];
    while (
      minesPositions.some((minePosition) =>
        checkObjectEquality(minePosition, newPosition)
      ) ||
      checkObjectEquality(newPosition, [row, column])
    ) {
      newPosition = [getRandomInt(0, boardSize), getRandomInt(0, boardSize)];
    }
    minesPositions.push(newPosition);
  }
  return minesPositions;
};

export { drawMinesPositions };
