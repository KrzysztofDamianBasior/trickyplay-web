import {
  checkForWin,
  createBoard,
  findBoardSize,
  revealNeighbors,
} from "./utils";

export interface Cell {
  id: string;
  hasFlag: boolean;
  hasMine: boolean;
  isChecked: boolean;
  numberOfMinedNeighbors: number;
}

export enum MinesweeperActionKind {
  START_GAME = "start-game",
  REVEAL_CELL = "reveal-cell",
  TOGGLE_FLAG = "toggle-flag",
}

export interface MinesweeperState {
  board: Cell[][];
  difficultyLevel: "beginner" | "intermediate" | "expert";
  disabled: boolean;
  info: "initialize" | "game over" | "in progress" | "you won";
}

export const minesweeperInitialState: MinesweeperState = {
  board: createBoard(8, 10, 2, 2),
  difficultyLevel: "beginner",
  disabled: true,
  info: "initialize",
};

export interface MinesweeperAction {
  type: MinesweeperActionKind;
  payload?: {
    cellPosition?: [number, number];
    difficultyLevel?: "beginner" | "intermediate" | "expert";
  };
}

export function minesweeperReducer(
  state: MinesweeperState,
  action: MinesweeperAction
): MinesweeperState {
  let newState: MinesweeperState = JSON.parse(JSON.stringify(state));

  switch (action.type) {
    case MinesweeperActionKind.START_GAME:
      newState.disabled = false;
      newState.info = "initialize";
      newState.difficultyLevel = action.payload!.difficultyLevel!;
      const boardSize = findBoardSize(newState.difficultyLevel);
      newState.board = createBoard(
        boardSize.boardSize,
        boardSize.numberOfMines,
        0,
        0
      );

      return { ...newState };

    case MinesweeperActionKind.TOGGLE_FLAG:
      newState.board[action.payload!.cellPosition![0]][
        action.payload!.cellPosition![1]
      ].hasFlag =
        newState.board[action.payload!.cellPosition![0]][
          action.payload!.cellPosition![1]
        ].hasFlag === true
          ? false
          : true;

      return { ...newState };
    case MinesweeperActionKind.REVEAL_CELL:
      const row = action.payload!.cellPosition![0];
      const column = action.payload!.cellPosition![1];
      let winStatus = false;

      if (newState.info === "initialize") {
        newState.info = "in progress";
        const boardSize = findBoardSize(newState.difficultyLevel);
        newState.board = createBoard(
          boardSize.boardSize,
          boardSize.numberOfMines,
          row,
          column
        );
      }

      newState.board[row][column].isChecked = true;
      revealNeighbors(row, column, newState.board);
      winStatus = checkForWin(newState.board);

      if (newState.board[row][column].hasMine) {
        newState.info = "game over";
        newState.disabled = true;
      } else if (winStatus) {
        newState.info = "you won";
        newState.disabled = true;
      }

      return { ...newState };

    default:
      return { ...newState };
  }
}
