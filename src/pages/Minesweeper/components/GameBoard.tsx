import { styled } from "@mui/material";

import FlagCircleIcon from "@mui/icons-material/FlagCircle";
import CrisisAlertIcon from "@mui/icons-material/CrisisAlert";

import {
  MinesweeperState,
  MinesweeperActionKind,
  MinesweeperActionType,
} from "../reducer";

import GameWrapper from "../../../shared/components/GameWrapper";

type Props = {
  minesweeperGameState: MinesweeperState;
  dispatchMinesweeperGameState: React.Dispatch<MinesweeperActionType>;
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
      return (
        <CrisisAlertIcon
          sx={{
            fontSize: {
              xs: "10px",
              sm: "20px",
              md: "15px",
              lg: "25px",
              xl: "30px",
            },
          }}
        />
      );
    }
    if (!checked && hasFlag) {
      return <FlagCircleIcon />;
    }
    if (!checked) {
      return null;
    } else if (hasMine) {
      return <CrisisAlertIcon />;
    } else if (numberOfMinedNeighbors === 0) {
      return null;
    } else {
      return numberOfMinedNeighbors;
    }
  }

  return (
    <GameWrapper style={{ margin: "20px" }}>
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

const MinesweeperGameBoard = styled("div")`
  ${({ theme }) => `
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: stretch;
    
    background-color: black;

    font-size: 2rem;

    width: 80vmin;
    height: 80vmin;
    @media (max-width: ${theme.breakpoints.values.md}px) {
      font-size: 1.5rem;
    }
    @media (max-width: ${theme.breakpoints.values.sm}px) {
      font-size: 1rem;
    }
  `}
`;

const MinesweeperRow = styled("div")<{ rowsNumber: number }>`
  height: ${(p) => `calc(100% / ${p.rowsNumber})`};

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: stretch;
  flex: 1 1 0px;
`;

const MinesweeperCell = styled("div")<{
  disabled: boolean;
  isEven: boolean;
  hasMine: boolean;
  isChecked: boolean;
  columnsNumber: number;
}>`
  ${({ theme, columnsNumber, disabled, hasMine, isChecked, isEven }) => `
  color: black;
  
  width: ${`calc(100% / ${columnsNumber})`};

  display: flex;
  align-items: center;
  justify-content: center;

  text-align: center;
  
  cursor: pointer;
  
  border: ${isChecked ? "2px dotted #7b7b7b;" : "10px groove #7b7b7b;"};
  @media (max-width: ${theme.breakpoints.values.sm}px) {
    border: ${isChecked ? "1.5px dotted #7b7b7b;" : "8px groove #7b7b7b;"};
  }
  @media (max-width: 400px) {
    border: ${isChecked ? "1px dotted #7b7b7b;" : "5px groove #7b7b7b;"};
  }

  background: ${
    hasMine && isChecked
      ? "red"
      : isEven
      ? "rgba(255, 255, 255, 0.7);"
      : "rgba(255, 255, 255, 0.4);"
  };
    
    ${disabled || isChecked ? "" : "&:hover { background: white }"};
  `}
`;
