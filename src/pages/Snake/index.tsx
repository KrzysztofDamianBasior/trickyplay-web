import { useRef, useReducer, useEffect, useState } from "react";
import { useInterval } from "usehooks-ts";

import { styled, useTheme } from "@mui/material/styles";
import { Box, useMediaQuery } from "@mui/material";

import Modal from "../../shared/components/Modal";
import CommentsSection from "../../shared/components/CommentsSection";

import ControlsPanel from "./components/ControlsPanel";
import OptionsPanel from "./components/OptionsPanel";
import GameBoard from "./components/GameBoard";

import { useResponsiveCanvasSize } from "./hooks/useResponsiveCanvasSize";
import { SnakeActionKind, snakeReducer } from "./reducer";
import { disableArrowKeyScrolling } from "./utils";

const SCALE = 30;

const Snake = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gameWrapperRef = useRef<HTMLDivElement | null>(null);
  const theme = useTheme();
  const isMatchLG = useMediaQuery(theme.breakpoints.down("lg"));
  const isMatchMD = useMediaQuery(theme.breakpoints.down("md"));
  const canvasSize = useResponsiveCanvasSize(
    isMatchLG ? (isMatchMD ? 70 : 40) : 70,
    SCALE
  );
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

  useEffect(() => {
    if (snakeGameState.disabled === false) {
      window.addEventListener("keydown", disableArrowKeyScrolling, false);
      return () => {
        window.removeEventListener("keydown", disableArrowKeyScrolling);
      };
    }
  }, [snakeGameState.disabled]);

  return (
    <>
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
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
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
              if (!snakeGameState.disabled) {
                dispatchSnakeGameState({
                  type: SnakeActionKind.CHANGE_DIRECTION,
                  payload: { keyboardEvent: e },
                });
              }
            }}
            onPlayAgain={() => {
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
            }}
          />
        </SnakeContainer>

        <CommentsSection gameName="Snake" />
      </Box>
    </>
  );
};

export default Snake;

const SnakeContainer = styled("div", {
  name: "SnakeContainer",
  slot: "root",
})`
  ${({ theme }) => `
    margin-top: 10vh;

    width: 100%;
    height: 100%;

    display: flex;
    align-items: center;
    justify-content: space-evenly;
    flex-direction: row;
    @media (max-width: ${theme.breakpoints.values.md}px) {
      flex-direction: column;
    }
  `}
`;
