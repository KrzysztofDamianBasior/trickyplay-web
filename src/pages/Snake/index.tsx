import React, { useRef, useReducer, useEffect, useState } from "react";
import styled from "styled-components";

import { useInterval } from "usehooks-ts";
import { useResponsiveCanvasSize } from "./hooks/useResponsiveCanvasSize";

import AnimatedPage from "../../shared/components/AnimatedPage";
import Navbar from "../../shared/components/Navbar";
import Modal from "../../shared/components/Modal";

import ControlsPanel from "./components/ControlsPanel";
import OptionsPanel from "./components/OptionsPanel";
import GameBoard from "./components/GameBoard";

import { SnakeActionKind, snakeReducer } from "./reducer";

const SCALE = 30;

const Snake = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gameWrapperRef = useRef<HTMLDivElement | null>(null);
  const canvasSize = useResponsiveCanvasSize(70);
  const [snakeGameState, dispatchSnakeGameState] = useReducer(snakeReducer, {
    direction: { x: 0, y: -1 },
    snake: [],
    difficultyLevel: "easy",
    disabled: true,
    inversionApples: [],
    pointApples: [],
    score: 0,
    speed: null,
    scale: SCALE,
    info: "",
  });
  const [modalState, setModalState] = useState<{
    opened: boolean;
    difficultyLevel: "easy" | "medium" | "hard";
  }>({
    opened: false,
    difficultyLevel: "easy",
  });

  useInterval(
    () =>
      dispatchSnakeGameState({
        type: SnakeActionKind.MOVE,
        payload: { canvasSize: [canvasSize.x, canvasSize.y] },
      }),
    snakeGameState.speed
  );

  useEffect(() => {
    let pointApple = document.getElementById(
      "point-apple"
    ) as HTMLCanvasElement;
    let inversionApple = document.getElementById(
      "inversion-apple"
    ) as HTMLCanvasElement;

    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.setTransform(SCALE, 0, 0, SCALE, 0, 0);
        ctx.clearRect(0, 0, canvasSize.x, canvasSize.y);

        ctx.fillStyle = "#40ff2b";
        snakeGameState.snake.forEach(([x, y]) => ctx.fillRect(x, y, 1, 1));

        ctx.fillStyle = "#40ff2b";
        ctx.fill();

        snakeGameState.pointApples.forEach(([x, y]) =>
          ctx.drawImage(pointApple, x, y, 1, 1)
        );
        snakeGameState.inversionApples.forEach(([x, y]) =>
          ctx.drawImage(inversionApple, x, y, 1, 1)
        );
      }
    }
  }, [
    snakeGameState.snake,
    snakeGameState.pointApples,
    snakeGameState.inversionApples,
    snakeGameState.disabled,
    canvasSize,
  ]);

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
          dispatchSnakeGameState({
            type: SnakeActionKind.START_GAME,
            payload: {
              numberOfInversionApples: 2,
              numberOfPointApples: 4,
              snakeInitialPosition: [
                [3, 8],
                [3, 9],
              ],
              direction: { x: 0, y: -1 },
              canvasSize: [canvasSize.x, canvasSize.y],
              difficultyLevel: modalState.difficultyLevel,
            },
          });
          gameWrapperRef.current?.focus();
        }}
      >
        <OptionsPanel
          setOptionsState={setModalState}
          optionsState={modalState}
        />
      </Modal>

      <SnakeContainer>
        <ControlsPanel
          openModal={() =>
            setModalState((prev) => {
              return { ...prev, opened: true };
            })
          }
          pause={snakeGameState.speed === null ? true : false}
          disabled={snakeGameState.disabled}
          setPause={() => {
            dispatchSnakeGameState({
              type: SnakeActionKind.PAUSE,
            });
            gameWrapperRef.current?.focus();
          }}
          score={snakeGameState.score}
        />
        <GameBoard
          canvasRef={canvasRef}
          wrapperRef={gameWrapperRef}
          canvasSize={canvasSize}
          disabled={snakeGameState.disabled}
          info={snakeGameState.info}
          changeDirection={(e) => {
            dispatchSnakeGameState({
              type: SnakeActionKind.CHANGE_DIRECTION,
              payload: { keyboardEvent: e },
            });
          }}
        />
      </SnakeContainer>
    </AnimatedPage>
  );
};
export default Snake;

const SnakeContainer = styled.div`
  width: 80vw;
  height: 70vh;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  flex-direction: row;
  margin-top: 18vh;
`;
