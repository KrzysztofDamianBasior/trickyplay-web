import React from "react";
import GameWrapper from "../../../shared/components/GameWrapper";
import styled from "styled-components";
import {
  MinesweeperState,
  MinesweeperActionKind,
  MinesweeperAction,
} from "../reducer";

import { BsFlag } from "react-icons/bs";
import { GiLandMine } from "react-icons/gi";

type Props = {
  minesweeperGameState: MinesweeperState;
  dispatchMinesweeperGameState: React.Dispatch<MinesweeperAction>;
};

const GameBoard = ({
  minesweeperGameState,
  dispatchMinesweeperGameState,
}: Props) => {
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
    <GameWrapper>
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
    </GameWrapper>
  );
};
export default GameBoard;

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
  /* box-sizing: border-box;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px); */

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
