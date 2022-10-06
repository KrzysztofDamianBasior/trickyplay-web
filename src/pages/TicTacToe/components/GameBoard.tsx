import React from "react";
import GameWrapper from "../../../shared/components/GameWrapper";
import styled from "styled-components";

type Props = {
  disabled: boolean;
  info: string;
  board: string[][];
  onMove: (cellRowPosition: number, cellColumnPosition: number) => void;
};

const TicTacToeGameBoard = ({ disabled, info, board, onMove }: Props) => {
  return (
    <GameWrapper width="70vmin" height="70vmin">
      {disabled && (
        <TicTacToeInfo>
          <div>{info}</div>
        </TicTacToeInfo>
      )}
      <TicTacToeBoard>
        {Array.from({ length: board.length }).map((irrelevant, rowIndex) => (
          <TicTacToeRow key={"tic-tac-toe-board" + rowIndex.toString()}>
            {Array.from({ length: board[rowIndex].length }).map(
              (irrelevant, columnIndex) => (
                <TicTacToeCell
                  key={
                    "tic-tac-toe-cell" +
                    rowIndex.toString() +
                    columnIndex.toString()
                  }
                  onClick={() =>
                    board[rowIndex][columnIndex] === "" &&
                    onMove(rowIndex, columnIndex)
                  }
                  disabled={
                    board[rowIndex][columnIndex] === "x" ||
                    board[rowIndex][columnIndex] === "o"
                  }
                >
                  {board[rowIndex][columnIndex]}
                </TicTacToeCell>
              )
            )}
          </TicTacToeRow>
        ))}
      </TicTacToeBoard>
    </GameWrapper>
  );
};
export default TicTacToeGameBoard;

const TicTacToeInfo = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  div {
    position: absolute;
    left: 5%;
    top: 5%;
    width: 90%;
    height: 90%;
    font-size: 3rem;

    /* From https://css.glass */
    background: rgba(255, 255, 255, 0.22);
    border-radius: 16px;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(8.5px);
    -webkit-backdrop-filter: blur(8.5px);

    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const TicTacToeBoard = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  background-color: black;
  font-size: 2rem;
  width: 100%;
  height: 100%;
`;

const TicTacToeRow = styled.div`
  height: calc(100% / 3);
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: stretch;
`;

type TicTacToeCellProps = {
  disabled: boolean;
};

const TicTacToeCell = styled.div<TicTacToeCellProps>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  &:hover {
    background: ${(p) => (p.disabled ? "trasparent" : "azure")};
  }
`;
