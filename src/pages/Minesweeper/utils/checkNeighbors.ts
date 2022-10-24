import { checkObjectEquality } from "../../../shared/utils";

const checkNeighbors = (
  rowPosition: number,
  columnPosition: number,
  minesPositions: number[][],
  boardSize: number
): number => {
  let numberOfMines = 0;

  const rowOffsets = [-1, 0, 1];
  const columnOffsets = [-1, 0, 1];

  for (const rowOffset of rowOffsets) {
    for (const columnOffset of columnOffsets) {
      const cornerCell =
        rowPosition + rowOffset < 0 ||
        rowPosition + rowOffset > boardSize ||
        columnPosition + columnOffset < 0 ||
        columnPosition + columnOffset >= boardSize;

      if (!cornerCell) {
        if (
          minesPositions.some((minePosition) =>
            checkObjectEquality(
              [rowPosition + rowOffset, columnPosition + columnOffset],
              minePosition
            )
          )
        ) {
          numberOfMines += 1;
        }
      }
    }
  }

  return numberOfMines;
};

export { checkNeighbors };
