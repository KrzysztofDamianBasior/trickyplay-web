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

export type GameStatusType =
  | "in initialization state"
  | "game over!"
  | "in progress"
  | "you won!";

export type DifficultyLevel = "beginner" | "intermediate" | "expert";

export interface MinesweeperState {
  board: Cell[][];
  difficultyLevel: DifficultyLevel;
  disabled: boolean;
  info: GameStatusType;
}

export const minesweeperInitialState: MinesweeperState = {
  board: createBoard(8, 10, 2, 2),
  difficultyLevel: "beginner",
  disabled: true,
  info: "in initialization state",
};

export type MinesweeperActionType =
  | MinesweeperStartGameActionType
  | MinesweeperRevealCellActionType
  | MinesweeeperToogleFlagActionType;

export type MinesweeperStartGameActionType = {
  type: MinesweeperActionKind.START_GAME;
  payload: {
    difficultyLevel: "beginner" | "intermediate" | "expert";
  };
};

export type MinesweeperRevealCellActionType = {
  type: MinesweeperActionKind.REVEAL_CELL;
  payload: {
    cellPosition: [number, number];
  };
};

export type MinesweeeperToogleFlagActionType = {
  type: MinesweeperActionKind.TOGGLE_FLAG;
  payload: {
    cellPosition: [number, number];
  };
};

export function minesweeperReducer(
  state: MinesweeperState,
  action: MinesweeperActionType
): MinesweeperState {
  let newState: MinesweeperState = JSON.parse(JSON.stringify(state));

  switch (action.type) {
    case MinesweeperActionKind.START_GAME:
      newState.disabled = false;
      newState.info = "in initialization state";
      newState.difficultyLevel = action.payload.difficultyLevel!;
      const boardSize = findBoardSize(newState.difficultyLevel);
      newState.board = createBoard(
        boardSize.boardSize,
        boardSize.numberOfMines,
        0,
        0
      );

      return { ...newState };

    case MinesweeperActionKind.TOGGLE_FLAG:
      newState.board[action.payload.cellPosition![0]][
        action.payload.cellPosition![1]
      ].hasFlag =
        newState.board[action.payload.cellPosition![0]][
          action.payload.cellPosition![1]
        ].hasFlag === true
          ? false
          : true;

      return { ...newState };

    case MinesweeperActionKind.REVEAL_CELL:
      const row = action.payload.cellPosition![0];
      const column = action.payload.cellPosition![1];
      let winStatus = false;

      if (newState.info === "in initialization state") {
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
        newState.info = "game over!";
        newState.disabled = true;
      } else if (winStatus) {
        newState.info = "you won!";
        newState.disabled = true;
      }

      return { ...newState };

    default:
      return { ...newState };
  }
}
