import React, { useState, useReducer } from "react";
import styled from "styled-components";
import AnimatedPage from "../../shared/components/AnimatedPage";
import Banner from "../../shared/components/Banner";
import PointsContainer from "./components/PointsContainer";
import Navbar from "../../shared/components/Navbar";
import Modal from "../../shared/components/Modal";

import NeonButton from "../../shared/components/ActionButton";
import StatefulButton from "../../shared/components/StatefulButton";
import TicTacToeGameBoard from "./components/GameBoard";

import { computerMove } from "./utils/computerMove";
import { victoryStatus } from "./utils/victoryStatus";
import { getRandomInt } from "../../shared/utils/getRandomInt";

enum TicTacToeActionKind {
  RESET_BOARD = "reset-board",
  RESET_POINTS = "reset-points",
  NEW_MOVE = "new-move",
}

interface TicTacToeAction {
  type: TicTacToeActionKind;
  payload?: {
    rowsNumber?: number;
    columnsNumber?: number;
    soloOrDuoMode?: "solo" | "duo";
    side?: "x" | "o";
    cellRowPosition?: number;
    cellColumnPosition?: number;
  };
}

interface TicTacToeState {
  soloOrDuoMode: "solo" | "duo";
  side: "x" | "o";
  whoseMove: "x" | "o";
  board: string[][];
  disabled: boolean;
  victoryStatus: string;
  points: { x: number; o: number };
}

function ticTacToeReducer(
  state: TicTacToeState,
  action: TicTacToeAction
): TicTacToeState {
  switch (action.type) {
    case TicTacToeActionKind.NEW_MOVE:
      let whoWin: string = "";
      let copy = JSON.parse(JSON.stringify(state.board));
      let whoseMoveNext: "x" | "o" = state.whoseMove === "x" ? "o" : "x";

      if (state.soloOrDuoMode === "solo") {
        copy[action.payload!.cellRowPosition!][
          action.payload!.cellColumnPosition!
        ] = state.side;

        whoWin = victoryStatus(copy);
        if (!whoWin) {
          let nextMove = computerMove(copy, state.side);
          let opponentAvatar = state.side === "x" ? "o" : "x";
          console.log(nextMove);
          if (nextMove !== null) {
            copy[nextMove[0]][nextMove[1]] = opponentAvatar;
          }
          whoWin = victoryStatus(copy);
        }
        whoseMoveNext = state.side;
      } else {
        copy[action.payload!.cellRowPosition!][
          action.payload!.cellColumnPosition!
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
      let newBoard = Array.from({ length: action.payload!.rowsNumber! }, (v) =>
        Array.from({ length: action.payload!.columnsNumber! }, (v) => "")
      );

      let whoseMove: "x" | "o" = "x";
      if (
        action.payload!.soloOrDuoMode === "solo" &&
        action.payload!.side !== "x"
      ) {
        newBoard[getRandomInt(0, newBoard.length)][
          getRandomInt(0, newBoard[0].length)
        ] = "x";
        whoseMove = "o";
      }

      return {
        ...state,
        board: newBoard,
        soloOrDuoMode: action.payload!.soloOrDuoMode!,
        side: action.payload!.side!,
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

const ticTacToeInitialState: TicTacToeState = {
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

const TicTacToe = () => {
  const [ticTacToeGameState, dispatchTicTacToeGameState] = useReducer(
    ticTacToeReducer,
    ticTacToeInitialState
  );
  const [modalState, setModalState] = useState<{
    opened: boolean;
    soloOrDuoMode: "solo" | "duo";
    side: "x" | "o";
  }>({
    opened: false,
    soloOrDuoMode: "solo",
    side: "x",
  });

  return (
    <AnimatedPage>
      <Navbar />
      {modalState.opened && (
        <Modal
          title="Start A New Game"
          closeModal={() => {
            setModalState((prev) => {
              return { ...prev, opened: false };
            });
          }}
          onConfirm={() => {
            dispatchTicTacToeGameState({
              type: TicTacToeActionKind.RESET_BOARD,
              payload: {
                columnsNumber: 3,
                rowsNumber: 3,
                side: modalState.side,
                soloOrDuoMode: modalState.soloOrDuoMode,
              },
            });
          }}
        >
          <ToggleSwitchContainer>
            {["single player", "two players"].map((label) => (
              <StatefulButton
                active={
                  modalState.soloOrDuoMode === "solo" &&
                  label === "single player"
                    ? true
                    : false
                }
                onClick={() =>
                  setModalState((prev) => {
                    return {
                      ...prev,
                      soloOrDuoMode: label === "single player" ? "solo" : "duo",
                    };
                  })
                }
                key={label}
              >
                {label}
              </StatefulButton>
            ))}
          </ToggleSwitchContainer>

          {modalState.soloOrDuoMode === "solo" && (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
              }}
            >
              <div>Choose a side:</div>

              <ToggleSwitchContainer>
                {["x", "o"].map((label) => (
                  <StatefulButton
                    active={label === modalState.side ? true : false}
                    onClick={() => {
                      if (label === "x" || label === "o") {
                        setModalState((prev) => {
                          return { ...prev, side: label };
                        });
                      }
                    }}
                    key={label}
                  >
                    {label}
                  </StatefulButton>
                ))}
              </ToggleSwitchContainer>
            </div>
          )}
        </Modal>
      )}
      <TicTacToeContainer>
        <TicTacToeControls>
          <Banner text="Tic Tac Toe" />
          <article>
            <section>
              <NeonButton
                onClick={() =>
                  setModalState((prev) => {
                    return { ...prev, opened: true };
                  })
                }
              >
                Start a new game
              </NeonButton>
            </section>
            <section>
              <PointsContainer
                title="POINTS"
                headers={["O", "X"]}
                points={[
                  ticTacToeGameState.points.o,
                  ticTacToeGameState.points.x,
                ]}
                reset={() => {
                  dispatchTicTacToeGameState({
                    type: TicTacToeActionKind.RESET_POINTS,
                  });
                }}
              />
            </section>
          </article>
        </TicTacToeControls>
        <TicTacToeGameBoard
          disabled={ticTacToeGameState.disabled}
          info={ticTacToeGameState.victoryStatus}
          board={ticTacToeGameState.board}
          onMove={(cellRowPosition: number, cellColumnPosition: number) => {
            dispatchTicTacToeGameState({
              type: TicTacToeActionKind.NEW_MOVE,
              payload: {
                cellRowPosition,
                cellColumnPosition,
              },
            });
          }}
        />
      </TicTacToeContainer>
    </AnimatedPage>
  );
};

export default TicTacToe;

const ToggleSwitchContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
`;

const TicTacToeContainer = styled.div`
  width: 80vw;
  height: 70vh;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  flex-direction: row;
  margin-top: 18vh;
`;

const TicTacToeControls = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  height: 80vh;
  article {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    height: 50vh;
    section {
      width: 100%;
    }
  }
`;
