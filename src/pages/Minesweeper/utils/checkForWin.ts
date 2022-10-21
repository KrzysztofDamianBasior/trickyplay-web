import { Cell } from "../reducer";

const checkForWin = (board: Cell[][]) => {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (!board[i][j].isChecked && !board[i][j].hasMine) {
        return false;
      }
    }
  }
  return true;
};

export { checkForWin };
