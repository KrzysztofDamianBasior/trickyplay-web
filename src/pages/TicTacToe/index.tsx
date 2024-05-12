import { useState, useReducer } from "react";

import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";

import TicTacToeGameBoard from "./components/GameBoard";
import OptionsPanel from "./components/OptionsPanel";
import ControlsPanel from "./components/ControlsPanel";

import {
  TicTacToeActionKind,
  ticTacToeInitialState,
  ticTacToeReducer,
} from "./reducer";

import Modal from "../../shared/components/Modal";
import CommentsSection from "../../shared/components/CommentsSection";

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
    <>
      <Modal
        isModalOpened={modalState.opened}
        title="Start A New Game"
        onClose={() => {
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
        <OptionsPanel
          optionsState={modalState}
          setOptionsState={setModalState}
        />
      </Modal>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TicTacToeContainer>
          <ControlsPanel
            openModal={() =>
              setModalState((prev) => {
                return { ...prev, opened: true };
              })
            }
            points={{
              o: ticTacToeGameState.points.o,
              x: ticTacToeGameState.points.x,
            }}
            resetPoints={() => {
              dispatchTicTacToeGameState({
                type: TicTacToeActionKind.RESET_POINTS,
              });
            }}
          />
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
            onPlayAgain={() => {
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
          />
        </TicTacToeContainer>

        <CommentsSection gameName="TicTacToe" />
      </Box>
    </>
  );
};

export default TicTacToe;

const TicTacToeContainer = styled("div", {
  name: "TicTacToeContainer",
  slot: "root",
})`
  ${({ theme }) => `
    margin-top: 10vh;

    width: 100%;
    height: 100%;

    display: flex;
    align-items: center;
    justify-content: space-evenly;
    flex-direction: row;
    @media (max-width: ${theme.breakpoints.values.md}px) {
      flex-direction: column;
    }
  `}
`;
