import React, { useState, useReducer } from "react";
import styled from "styled-components";

import AnimatedPage from "../../shared/components/AnimatedPage";
import Navbar from "../../shared/components/Navbar";
import Modal from "../../shared/components/Modal";

import TicTacToeGameBoard from "./components/GameBoard";
import OptionsPanel from "./components/OptionsPanel";
import ControlsPanel from "./components/ControlsPanel";

import {
  TicTacToeActionKind,
  ticTacToeInitialState,
  ticTacToeReducer,
} from "./reducer";

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
        />
      </TicTacToeContainer>
    </AnimatedPage>
  );
};

export default TicTacToe;

const TicTacToeContainer = styled.div`
  width: 80vw;
  height: 70vh;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  flex-direction: row;
  margin-top: 18vh;
`;
