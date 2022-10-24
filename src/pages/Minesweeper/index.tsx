import React, { useState, useReducer } from "react";
import styled, { css } from "styled-components";

import AnimatedPage from "../../shared/components/AnimatedPage";
import Navbar from "../../shared/components/Navbar";
import Modal from "../../shared/components/Modal";
import StatefulButton from "../../shared/components/StatefulButton";
import ActionButton from "../../shared/components/ActionButton";

import { BsFlag } from "react-icons/bs";
import { GiLandMine } from "react-icons/gi";

import GameWrapper from "../../shared/components/GameWrapper";
import Stopwatch from "./components/Stopwatch";

import Banner from "../../shared/components/Banner";

import { useStopwatch } from "./hooks/useStopwatch";

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

  const { time, start, pause, reset } = useStopwatch();

  function CellContent(
    checked: boolean,
    hasFlag: boolean,
    hasMine: boolean,
    numberOfMinedNeighbors: number,
    info: string
  ) {
    if (info === "game over" && hasMine) {
      return <GiLandMine />;
    }
    if (!checked && hasFlag) {
      return <BsFlag />;
    }
    if (!checked) {
      return null;
    } else if (hasMine) {
      return <GiLandMine />;
    } else if (numberOfMinedNeighbors === 0) {
      return null;
    } else {
      return numberOfMinedNeighbors;
    }
  }

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
            dispatchMinesweeperGameState({
              type: MinesweeperActionKind.START_GAME,
              payload: { difficultyLevel: modalState.difficultyLevel },
            });
          }}
        >
          <OptionsPanelContainer>
            <OptionContainer>
              <label>difficulty level:</label>
              <ToggleSwitchContainer>
                {["beginner", "intermediate", "expert"].map((label) => (
                  <StatefulButton
                    active={modalState.difficultyLevel === label ? true : false}
                    onClick={() => {
                      if (
                        label === "beginner" ||
                        label === "intermediate" ||
                        label === "expert"
                      ) {
                        setModalState((prev) => {
                          return {
                            ...prev,
                            difficultyLevel: label,
                          };
                        });
                      }
                    }}
                    key={label}
                  >
                    {label}
                  </StatefulButton>
                ))}
              </ToggleSwitchContainer>
            </OptionContainer>
          </OptionsPanelContainer>
        </Modal>
      )}

      <MinesweeperContainer>
        <MinesweeperControls>
          <Banner text="Minesweeper" />
          <ActionButton
            onClick={() => {
              setModalState((prev) => {
                return { ...prev, opened: true };
              });
            }}
          >
            Start a game
          </ActionButton>
          <ControlsTable>
            <div>game status</div>
            <div>{minesweeperGameState.info}</div>

            <div>timer</div>
            <div>
              <Stopwatch time={time} />
            </div>
          </ControlsTable>
        </MinesweeperControls>
        {/* <GameWrapper> */}
        <MinesweeperGameBoard>
          {minesweeperGameState.board.map((row, rowIndex) => (
            <MinesweeperRow rowsNumber={minesweeperGameState.board.length}>
              {row.map((cell, columnIndex) => (
                <MinesweeperCell
                  columnsNumber={minesweeperGameState.board.length}
                  isChecked={cell.isChecked}
                  hasMine={cell.hasMine}
                  isEven={(columnIndex + rowIndex) % 2 === 0}
                  disabled={minesweeperGameState.disabled}
                  onClick={() => {
                    if (!minesweeperGameState.disabled) {
                      dispatchMinesweeperGameState({
                        type: MinesweeperActionKind.REVEAL_CELL,
                        payload: { cellPosition: [rowIndex, columnIndex] },
                      });
                    }
                  }}
                  onContextMenu={(e) => {
                    if (!minesweeperGameState.disabled) {
                      dispatchMinesweeperGameState({
                        type: MinesweeperActionKind.TOGGLE_FLAG,
                        payload: { cellPosition: [rowIndex, columnIndex] },
                      });
                      e.preventDefault();
                    }
                  }}
                >
                  {CellContent(
                    cell.isChecked,
                    cell.hasFlag,
                    cell.hasMine,
                    cell.numberOfMinedNeighbors,
                    minesweeperGameState.info
                  )}
                </MinesweeperCell>
              ))}
            </MinesweeperRow>
          ))}
        </MinesweeperGameBoard>
        {/* </GameWrapper> */}
      </MinesweeperContainer>
    </AnimatedPage>
  );
};

export default Minesweeper;

const ControlsTable = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: 10vh;
  width: 15vw;
  div {
    display: flex;
    align-items: center;
  }
`;

const MinesweeperControls = styled.div`
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
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: white;
    }
  }
`;

const OptionsPanelContainer = styled.div`
  width: 30vw;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const OptionContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: 2%;
  label {
    margin-right: 20px;
  }
`;

const ToggleSwitchContainer = styled.div`
  align-self: flex-end;
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
`;

const MinesweeperContainer = styled.div`
  width: 80vw;
  height: 70vh;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  flex-direction: row;
  margin-top: 18vh;
`;

const MinesweeperGameBoard = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  background-color: black;
  font-size: 2rem;
  width: 70vmin;
  height: 70vmin;
`;
const MinesweeperRow = styled.div<{ rowsNumber: number }>`
  height: ${(p) => `calc(100% / ${p.rowsNumber})`};
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: stretch;
  flex: 1 1 0px;
`;
const MinesweeperCell = styled.div<{
  disabled: boolean;
  isEven: boolean;
  hasMine: boolean;
  isChecked: boolean;
  columnsNumber: number;
}>`
  box-sizing: border-box;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);

  color: black;
  width: ${(p) => `calc(100% / ${p.columnsNumber})`};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  border: ${(p) =>
    p.isChecked ? "2px dotted #7b7b7b;" : "10px groove #7b7b7b;"};

  background: ${(p) =>
    p.hasMine && p.isChecked
      ? "red"
      : p.isEven
      ? "rgba(255, 255, 255, 0.7);"
      : "rgba(255, 255, 255, 0.4);"};

  ${(p) => (p.disabled || p.isChecked ? "" : "&:hover { background: white }")};
`;
