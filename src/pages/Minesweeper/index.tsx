import { useState, useReducer, useEffect } from "react";
import { Box, styled } from "@mui/material";

import Modal from "../../shared/components/Modal";
import CommentsSection from "../../shared/components/CommentsSection";

import { useStopwatch } from "./hooks/useStopwatch";

import GameBoard from "./components/GameBoard";
import OptionsPanel from "./components/OptionsPanel";
import ControlsPanel from "./components/ControlsPanel";

import {
  MinesweeperActionKind,
  minesweeperReducer,
  minesweeperInitialState,
} from "./reducer";

const Minesweeper = () => {
  const [minesweeperGameState, dispatchMinesweeperGameState] = useReducer(
    minesweeperReducer,
    minesweeperInitialState
  );

  const [modalState, setModalState] = useState<{
    opened: boolean;
    difficultyLevel: "beginner" | "intermediate" | "expert";
  }>({
    opened: false,
    difficultyLevel: "beginner",
  });

  const { time, startStopwatch, resetStopwatch, stopStopwatch } =
    useStopwatch();

  useEffect(() => {
    if (
      minesweeperGameState.info === "game over!" ||
      minesweeperGameState.info === "you won!"
    ) {
      stopStopwatch();
    }
  }, [minesweeperGameState]);

  return (
    <>
      <Modal
        title="Start A New Game"
        isModalOpened={modalState.opened}
        onClose={() => {
          setModalState((prev) => {
            return { ...prev, opened: false };
          });
        }}
        onConfirm={() => {
          dispatchMinesweeperGameState({
            type: MinesweeperActionKind.START_GAME,
            payload: { difficultyLevel: modalState.difficultyLevel },
          });
          resetStopwatch();
          startStopwatch();
        }}
      >
        <OptionsPanel
          difficultyLevel={modalState.difficultyLevel}
          setDifficultyLevel={(
            difficultyLevel: "beginner" | "intermediate" | "expert"
          ) => {
            setModalState((prev) => {
              return {
                ...prev,
                difficultyLevel,
              };
            });
          }}
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
        <MinesweeperContainer>
          <ControlsPanel
            openModal={() => {
              setModalState((prev) => {
                return { ...prev, opened: true };
              });
            }}
            time={time}
            gameStatus={minesweeperGameState.info}
          />
          <GameBoard
            minesweeperGameState={minesweeperGameState}
            dispatchMinesweeperGameState={dispatchMinesweeperGameState}
          />
        </MinesweeperContainer>

        <CommentsSection gameName="Minesweeper" />
      </Box>
    </>
  );
};

export default Minesweeper;

const MinesweeperContainer = styled("div", {
  name: "MinesweeperContainer",
  slot: "root",
})`
  ${({ theme }) => `
    margin-top: 10vh;

    width: 100%;
    height: 100%;

    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    @media (max-width: ${theme.breakpoints.values.md}px) {
      flex-direction: column;
    }
  `}
`;
