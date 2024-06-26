import { computerMove } from "./utils/computerMove";
import { victoryStatus } from "./utils/victoryStatus";
import { getRandomInt } from "../../shared/utils/getRandomInt";

export interface TicTacToeState {
  soloOrDuoMode: "solo" | "duo";
  side: "x" | "o";
  whoseMove: "x" | "o";
  board: string[][];
  disabled: boolean;
  victoryStatus: string;
  points: { x: number; o: number };
}

export const ticTacToeInitialState: TicTacToeState = {
  soloOrDuoMode: "solo",
  side: "x",
  whoseMove: "x",
  board: [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ],
  disabled: true,
  victoryStatus: "",
  points: { x: 0, o: 0 },
};

export enum TicTacToeActionKind {
  RESET_BOARD = "reset-board",
  RESET_POINTS = "reset-points",
  NEW_MOVE = "new-move",
}

export type TicTacToeActionType =
  | TicTacToeNewMoveActionType
  | TicTacToeResetBoardActionType
  | TicTacToeResetPointsActionType;

export type TicTacToeNewMoveActionType = {
  type: TicTacToeActionKind.NEW_MOVE;
  payload: {
    cellRowPosition: number;
    cellColumnPosition: number;
  };
};

export type TicTacToeResetPointsActionType = {
  type: TicTacToeActionKind.RESET_POINTS;
};

export type TicTacToeResetBoardActionType = {
  type: TicTacToeActionKind.RESET_BOARD;
  payload: {
    rowsNumber: number;
    columnsNumber: number;
    soloOrDuoMode: "solo" | "duo";
    side: "x" | "o";
  };
};

export function ticTacToeReducer(
  state: TicTacToeState,
  action: TicTacToeActionType
): TicTacToeState {
  switch (action.type) {
    case TicTacToeActionKind.NEW_MOVE:
      let whoWin: string = "";
      let copy = JSON.parse(JSON.stringify(state.board));
      let whoseMoveNext: "x" | "o" = state.whoseMove === "x" ? "o" : "x";

      if (state.soloOrDuoMode === "solo") {
        copy[action.payload.cellRowPosition][
          action.payload.cellColumnPosition
        ] = state.side;

        whoWin = victoryStatus(copy);
        if (!whoWin) {
          let nextMove = computerMove(copy, state.side);
          let opponentAvatar = state.side === "x" ? "o" : "x";
          if (nextMove !== null) {
            copy[nextMove[0]][nextMove[1]] = opponentAvatar;
          }
          whoWin = victoryStatus(copy);
        }
        whoseMoveNext = state.side;
      } else {
        copy[action.payload.cellRowPosition][
          action.payload.cellColumnPosition
        ] = state.whoseMove;
        whoWin = victoryStatus(copy);
      }

      if (whoWin === "o won") {
        return {
          ...state,
          victoryStatus: "o won",
          disabled: true,
          points: { x: state.points.x, o: state.points.o + 1 },
        };
      } else if (whoWin === "x won") {
        return {
          ...state,
          victoryStatus: "x won",
          disabled: true,
          points: { x: state.points.x + 1, o: state.points.o },
        };
      } else if (whoWin === "draw") {
        return {
          ...state,
          victoryStatus: "draw",
          disabled: true,
        };
      }
      return { ...state, board: copy, whoseMove: whoseMoveNext };

    case TicTacToeActionKind.RESET_BOARD:
      let newBoard = Array.from({ length: action.payload.rowsNumber }, (v) =>
        Array.from({ length: action.payload.columnsNumber }, (v) => "")
      );

      let whoseMove: "x" | "o" = "x";
      if (
        action.payload.soloOrDuoMode === "solo" &&
        action.payload.side !== "x"
      ) {
        newBoard[getRandomInt(0, newBoard.length)][
          getRandomInt(0, newBoard[0].length)
        ] = "x";
        whoseMove = "o";
      }

      return {
        ...state,
        board: newBoard,
        soloOrDuoMode: action.payload.soloOrDuoMode,
        side: action.payload.side,
        whoseMove,
        disabled: false,
        victoryStatus: "",
      };

    case TicTacToeActionKind.RESET_POINTS:
      return { ...state, points: { x: 0, o: 0 } };

    default:
      return { ...state };
  }
}
