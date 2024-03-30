import { styled } from "@mui/material/styles";

import GameWrapper from "../../../shared/components/GameWrapper";
import ActionButton from "../../../shared/components/ActionButton";

type Props = {
  disabled: boolean;
  info: string;
  board: string[][];
  onMove: (cellRowPosition: number, cellColumnPosition: number) => void;
  onPlayAgain: () => void;
};

const TicTacToeGameBoard = ({
  disabled,
  info,
  board,
  onMove,
  onPlayAgain,
}: Props) => {
  return (
    <GameWrapper>
      <TicTacToeBoard>
        {disabled && (
          <TicTacToeInfo>
            <div>
              {info}
              {info ? (
                <ActionButton onClick={onPlayAgain}>Play again</ActionButton>
              ) : null}
            </div>
          </TicTacToeInfo>
        )}
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

const TicTacToeInfo = styled("div")`
  ${({ theme }) => `  
    position: absolute;
    left: 0;
    top: 0;

    width: 100%;
    height: 100%;

    div {
      position: absolute;
      left: 5%;
      top: 5%;

      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;

      width: 90%;
      height: 90%;

      font-size: 3rem;
      @media (max-width: ${theme.breakpoints.values.sm}px) {
        font-size: 2rem;
      }
      @media (max-width: 400px) {
        font-size: 1.5rem;
      }

      /* From https://css.glass */
      background: rgba(255, 255, 255, 0.22);
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
      backdrop-filter: blur(8.5px);

      border-radius: 16px;
    }
  `}
`;

const TicTacToeBoard = styled("div", {
  name: "TicTacToeBoard",
  slot: "root",
})`
  ${({ theme }) => `
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: stretch;

    background-color: black;

    color: white;

    font-size: 2rem;

    width: 600px;
    height: 600px;
    @media (max-width: ${theme.breakpoints.values.md}px) {
      width: 500px;
      height: 500px;
    }
    @media (max-width: ${theme.breakpoints.values.sm}px) {
      width: 400px;
      height: 400px;
    }
    @media (max-width: 400px) {
      width: 250px;
      height: 250px;
    }
  `}
`;

const TicTacToeRow = styled("div")`
  height: calc(100% / 3);

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: stretch;
`;

const TicTacToeCell = styled("div")<{ disabled: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;

  cursor: pointer;

  transition: all 0.3s ease;
  &:hover {
    background: ${(p) => (p.disabled ? "trasparent" : "#F0FFFF")};
  }
`;
