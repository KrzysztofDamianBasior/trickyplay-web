import React from "react";
import { styled } from "@mui/material/styles";

import InversionApple from "../assets/apple2.png";
import PointApple from "../assets/apple1.png";

import GameWrapper from "../../../shared/components/GameWrapper";
import ActionButton from "../../../shared/components/ActionButton";

type Props = {
  wrapperRef: React.MutableRefObject<HTMLDivElement | null>;
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
  canvasSize: { x: number; y: number };
  disabled: boolean;
  info: string;
  changeDirection: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  onPlayAgain: () => void;
};

const GameBoard = ({
  wrapperRef,
  canvasRef,
  canvasSize,
  changeDirection,
  disabled,
  info,
  onPlayAgain,
}: Props) => {
  return (
    <GameWrapper
      tabIndex={0} // A tabindex of 0 will put the tag "in the natural tab order of the page". A higher number will give it a specific order of priority, where 1 will be the first, 2 second and so on. You can also give a tabindex of -1, which will make the div only focus-able by script, not the user.
      ref={wrapperRef}
      onKeyDown={(e) => changeDirection(e)}
    >
      {disabled && (
        <SnakeInfo>
          <div>
            {info}
            {info ? (
              <ActionButton onClick={onPlayAgain}>Play again</ActionButton>
            ) : null}
          </div>
        </SnakeInfo>
      )}
      <img
        id="point-apple"
        src={PointApple}
        alt="point apple"
        style={{ display: "none" }}
      />
      <img
        id="inversion-apple"
        src={InversionApple}
        alt="inversion apple"
        style={{ display: "none" }}
      />
      <SnakeCanvas
        ref={canvasRef}
        width={`${canvasSize.x}px`}
        height={`${canvasSize.y}px`}
      />
    </GameWrapper>
  );
};

export default GameBoard;

// const GameCanvas = styled("canvas")`
//   background: black;
// `;

const SnakeCanvas = styled("canvas", {
  name: "SnakeCanvas",
  slot: "root",
})`
  ${({ theme }) => `
    background-color: black;
  `}
`;

const SnakeInfo = styled("div")`
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
