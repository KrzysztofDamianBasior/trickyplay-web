import { drawMinesPositions } from "./drawMinesPositions";
import { checkObjectsEquality } from "../../../shared/utils";
import { Cell } from "../reducer";
import { checkNeighbors } from "./checkNeighbors";

const createBoard = (
  boardSize: number,
  numberOfMines: number,
  row: number,
  column: number
) => {
  const board: Cell[][] = [];
  const minesPositions = drawMinesPositions(
    boardSize,
    numberOfMines,
    row,
    column
  );

  for (let rowIndex = 0; rowIndex < boardSize; rowIndex++) {
    const row = [];
    for (let columnIndex = 0; columnIndex < boardSize; columnIndex++) {
      const cell: Cell = {
        id: rowIndex.toString() + columnIndex.toString(),
        hasFlag: false,
        hasMine: minesPositions.some((minePosition) =>
          checkObjectsEquality([rowIndex, columnIndex], minePosition)
        )
          ? true
          : false,
        isChecked: false,
        numberOfMinedNeighbors: checkNeighbors(
          rowIndex,
          columnIndex,
          minesPositions,
          boardSize
        ),
      };
      row.push(cell);
    }
    board.push(row);
  }

  return board;
};

export { createBoard };
