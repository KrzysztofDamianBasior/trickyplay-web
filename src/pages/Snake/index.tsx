import React, { useRef, useReducer, useEffect, useState } from "react";
import styled from "styled-components";

import { useInterval } from "../../shared/hooks";
import { useResponsiveCanvasSize } from "./hooks/useResponsiveCanvasSize";
import { getRandomInt } from "../../shared/utils/getRandomInt";

import InversionApple from "./assets/apple2.png";
import PointApple from "./assets/apple1.png";

import AnimatedPage from "../../shared/components/AnimatedPage";
import Navbar from "../../shared/components/Navbar";
import Modal from "../../shared/components/Modal";
import Banner from "../../shared/components/Banner";
import StatefulButton from "../../shared/components/StatefulButton";
import GameWrapper from "../../shared/components/GameWrapper";
import ActionButton from "../../shared/components/ActionButton";

const SCALE = 30;

const Snake = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gameWrapperRef = useRef<HTMLDivElement | null>(null);
  const canvasSize = useResponsiveCanvasSize(70);
  const [snakeGameState, dispatchSnakeGameState] = useReducer(snakeReducer, {
    direction: { x: 0, y: -1 },
    snake: [
      [3, 8],
      [3, 9],
    ],
    difficultyLevel: "easy",
    disabled: true,
    inversionApples: [],
    pointApples: [],
    score: 0,
    speed: null,
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

      <SnakeContainer>
        <SnakeControls>
          <Banner text="Snake" />
          <article>
            <section>
              <ActionButton
                onClick={() => {
                  gameWrapperRef.current?.focus();
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
                    },
                  });
                }}
              >
                Start a new game
              </ActionButton>
            </section>
            <section>points:</section>
            <section>max-score:</section>
          </article>
        </SnakeControls>

        <SnakeBoard>
          <GameWrapper
            tabIndex={0}
            ref={gameWrapperRef}
            onKeyDown={(e) => {
              dispatchSnakeGameState({
                type: SnakeActionKind.CHANGE_DIRECTION,
                payload: { keyboardEvent: e },
              });
            }}
          >
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
            {/* {snakeGameState.disabled && <div>Game Over</div>} */}
          </GameWrapper>
        </SnakeBoard>
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
const SnakeControls = styled.div`
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
    }
  }
`;
const SnakeBoard = styled.div``;

enum SnakeActionKind {
  START_GAME = "start-game",
  CHANGE_DIRECTION = "change-direction",
  MOVE = "move",
  PAUSE = "pause",
}

interface SnakeAction {
  type: SnakeActionKind;
  payload?: {
    snakeInitialPosition?: number[][];
    numberOfInversionApples?: number;
    numberOfPointApples?: number;
    direction?: { x: number; y: number };
    keyboardEvent?: React.KeyboardEvent<HTMLDivElement>;
    canvasSize?: [number, number];
  };
}

interface SnakeState {
  pointApples: [number, number][];
  inversionApples: [number, number][];
  snake: number[][];
  difficultyLevel: "easy" | "medium" | "hard";
  speed: number | null;
  direction: { x: number; y: number };
  disabled: boolean;
  score: number;
}

const findSpeed = (difficultyLevel: "easy" | "medium" | "hard"): number => {
  switch (difficultyLevel) {
    case "easy":
      return 400;
    case "medium":
      return 300;
    case "hard":
      return 200;
  }
};

function snakeReducer(state: SnakeState, action: SnakeAction): SnakeState {
  let direction = state.direction;

  switch (action.type) {
    case SnakeActionKind.START_GAME:
      let pointApples: [number, number][] = [];
      let inversionApples: [number, number][] = [];
      for (let i = 0; i < action.payload!.numberOfPointApples!; i++) {
        pointApples.push(
          drawApplePosition(
            action.payload?.snakeInitialPosition!,
            pointApples,
            action.payload?.canvasSize!
          )
        );
      }
      for (let i = 0; i < action.payload!.numberOfInversionApples!; i++) {
        inversionApples.push(
          drawApplePosition(
            action.payload?.snakeInitialPosition!,
            [...pointApples, ...inversionApples],
            action.payload?.canvasSize!
          )
        );
      }
      return {
        ...state,
        disabled: false,
        score: 0,
        snake: action.payload?.snakeInitialPosition!,
        pointApples,
        inversionApples,
        speed: state.speed === null ? findSpeed(state.difficultyLevel) : null,
        direction: action.payload?.direction!,
      };

    case SnakeActionKind.CHANGE_DIRECTION:
      switch (action.payload!.keyboardEvent!.key) {
        case "ArrowUp":
          if (state.direction.y !== 0) break;
          if (state.snake[0][1] - state.snake[1][1] > 0) break;
          direction = { x: 0, y: -1 };
          break;
        case "ArrowDown":
          if (state.direction.y !== 0) break;
          if (state.snake[0][1] - state.snake[1][1] < 0) break;
          direction = { x: 0, y: 1 };
          break;
        case "ArrowLeft":
          if (state.direction.x !== 0) break;
          if (state.snake[0][0] - state.snake[1][0] > 0) break;
          direction = { x: -1, y: 0 };
          break;
        case "ArrowRight":
          if (state.direction.x !== 0) break;
          if (state.snake[0][0] - state.snake[1][0] < 0) break;
          direction = { x: 1, y: 0 };
          break;
      }
      return { ...state, direction };

    case SnakeActionKind.PAUSE:
      let newSpeed: null | number =
        state.speed === null ? findSpeed(state.difficultyLevel) : null;
      return { ...state, speed: newSpeed };

    case SnakeActionKind.MOVE:
      let snakeCopy = JSON.parse(JSON.stringify(state.snake));
      let newSnakeHead = [
        snakeCopy[0][0] + state.direction.x,
        snakeCopy[0][1] + state.direction.y,
      ];
      snakeCopy.unshift(newSnakeHead);
      let speed = state.speed;
      let disabled = false;

      if (checkCollision(snakeCopy, action.payload?.canvasSize!)) {
        speed = null;
        disabled = true;
        snakeCopy = [];
      }
      let score = state.score;
      let newPointApples = checkPointsApples(
        snakeCopy,
        state.pointApples,
        state.inversionApples,
        action.payload?.canvasSize!
      );
      let newInversionApples = checkInversionApples(
        snakeCopy,
        state.inversionApples,
        state.pointApples,
        action.payload?.canvasSize!
      );
      if (newPointApples) {
        score += 1;
      } else {
        snakeCopy.pop();
      }

      if (newInversionApples) {
        snakeCopy.reverse();
        direction = {
          x: snakeCopy[0][0] - snakeCopy[1][0],
          y: snakeCopy[0][1] - snakeCopy[1][1],
        };
      }
      return {
        ...state,
        snake: snakeCopy,
        speed,
        disabled,
        direction,
        score,
        pointApples:
          newPointApples != null ? newPointApples : state.pointApples,
        inversionApples:
          newInversionApples != null
            ? newInversionApples
            : state.inversionApples,
      };

    default:
      return { ...state };
  }
}

const checkPointsApples = (
  snake: number[][],
  pointApples: [number, number][],
  inversionApples: [number, number][],
  canvasSize: [number, number]
): [number, number][] | null => {
  let newPointApples = [...pointApples];

  for (let appleIndex = 0; appleIndex < newPointApples.length; appleIndex++) {
    if (
      newPointApples[appleIndex][0] > canvasSize[0] ||
      newPointApples[appleIndex][1] > canvasSize[1]
    ) {
      newPointApples.splice(appleIndex, 1);
      const newApplePosition = drawApplePosition(
        snake,
        [...newPointApples, ...inversionApples],
        canvasSize
      );
      newPointApples.push(newApplePosition);
    }
  }
  for (let appleIndex = 0; appleIndex < newPointApples.length; appleIndex++) {
    if (checkIfAppleEaten(snake, newPointApples[appleIndex])) {
      newPointApples.splice(appleIndex, 1);
      const newApplePosition = drawApplePosition(
        snake,
        [...newPointApples, ...inversionApples],
        canvasSize
      );
      newPointApples.push(newApplePosition);
      return newPointApples;
    }
  }
  return null;
};

const checkInversionApples = (
  snake: number[][],
  inversionApples: [number, number][],
  pointApples: [number, number][],
  canvasSize: [number, number]
): [number, number][] | null => {
  let newInversionApples = [...inversionApples];
  for (
    let appleIndex = 0;
    appleIndex < newInversionApples.length;
    appleIndex++
  ) {
    if (checkIfAppleEaten(snake, newInversionApples[appleIndex])) {
      newInversionApples.splice(appleIndex, 1);
      const newApplePosition = drawApplePosition(
        snake,
        [...pointApples, ...newInversionApples],
        canvasSize
      );
      newInversionApples.push(newApplePosition);
      return newInversionApples;
    }
  }
  return null;
};

const checkIfAppleEaten = (
  snake: number[][],
  applePosition: [number, number]
) =>
  true
    ? snake.some(
        (segment) =>
          segment[0] === applePosition[0] && segment[1] === applePosition[1]
      )
    : false;

const drawApplePosition = (
  snake: number[][],
  apples: [number, number][],
  canvasSize: [number, number]
) => {
  let newApplePosition: [number, number] = [
    getRandomInt(0, canvasSize[0] / SCALE),
    getRandomInt(0, canvasSize[1] / SCALE),
  ];

  while (
    checkIfAppleEaten(snake, newApplePosition) ||
    apples.some(
      (apple) => JSON.stringify(apple) === JSON.stringify(newApplePosition)
    )
  ) {
    newApplePosition = [
      getRandomInt(0, canvasSize[0] / SCALE),
      getRandomInt(1, canvasSize[0] / SCALE),
    ];
  }
  return newApplePosition;
};

const checkCollision = (snake: number[][], canvasSize: [number, number]) => {
  if (
    snake[0][0] * SCALE >= canvasSize[0] || // # >= width
    snake[0][0] < 0 ||
    snake[0][1] * SCALE >= canvasSize[1] || // # >= height
    snake[0][1] < 0
  ) {
    return true;
  }
  for (let segment = 1; segment < snake.length; segment++) {
    // for (const segment of snake) {
    if (
      snake[0][0] === snake[segment][0] &&
      snake[0][1] === snake[segment][1]
    ) {
      return true;
    }
  }
  return false;
};
