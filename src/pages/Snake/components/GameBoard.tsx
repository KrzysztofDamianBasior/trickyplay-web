import React from "react";
import GameWrapper from "../../../shared/components/GameWrapper";
import styled from "styled-components";

import InversionApple from "../assets/apple2.png";
import PointApple from "../assets/apple1.png";

type Props = {
  wrapperRef: React.MutableRefObject<HTMLDivElement | null>;
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
  canvasSize: { x: number; y: number };
  changeDirection: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  disabled: boolean;
  info: string;
};

const GameBoard = ({
  wrapperRef,
  canvasRef,
  canvasSize,
  changeDirection,
  disabled,
  info,
}: Props) => {
  return (
    <GameWrapper
      tabIndex={0}
      ref={wrapperRef}
      onKeyDown={(e) => changeDirection(e)}
    >
      {disabled && (
        <SnakeInfo>
          <div>{info}</div>
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
      <canvas
        style={{
          background: "black",
        }}
        ref={canvasRef}
        width={`${canvasSize.x}px`}
        height={`${canvasSize.y}px`}
      />
    </GameWrapper>
  );
};
export default GameBoard;

const SnakeInfo = styled.div`
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
