import { Cell } from "../reducer";
/**
 * reveals neighbors that don't have a mine
 *
 * -reveal all neighbors in the square as long as there is no mine
 * -if neighbor has a number of mined neighbors greater than 0 do nothing
 * -if neighbor has a number of mined neighbors equal to zero- recursively call function for it
 *
 * @param rowPosition
 * @param columnPosition
 * @param board
 */
const revealNeighbors = (
  rowPosition: number,
  columnPosition: number,
  board: Cell[][]
): void => {
  const rowOffsets = [-1, 1];
  const columnOffsets = [-1, 1];

  for (const rowOffset of rowOffsets) {
    for (const columnOffset of columnOffsets) {
      const cornerCell =
        rowPosition + rowOffset < 0 ||
        rowPosition + rowOffset >= board.length ||
        columnPosition + columnOffset < 0 ||
        columnPosition + columnOffset >= board[0].length;

      if (
        cornerCell ||
        board[rowPosition + rowOffset][columnPosition + columnOffset].hasMine ||
        board[rowPosition + rowOffset][columnPosition + columnOffset].isChecked
      ) {
        continue;
      } else {
        board[rowPosition + rowOffset][
          columnPosition + columnOffset
        ].isChecked = true;

        if (
          board[rowPosition + rowOffset][columnPosition + columnOffset]
            .numberOfMinedNeighbors === 0
        ) {
          revealNeighbors(
            rowPosition + rowOffset,
            columnPosition + columnOffset,
            board
          );
        }
      }
    }
  }
};

export { revealNeighbors };
