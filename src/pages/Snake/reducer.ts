import {
  checkCollision,
  checkInversionApples,
  checkPointsApples,
  drawApplePosition,
  findSpeed,
} from "./utils";

export enum SnakeActionKind {
  START_GAME = "start-game",
  CHANGE_DIRECTION = "change-direction",
  MOVE = "move",
  PAUSE = "pause",
}

export interface SnakeAction {
  type: SnakeActionKind;
  payload?: {
    snakeInitialPosition?: number[][];
    numberOfInversionApples?: number;
    numberOfPointApples?: number;
    direction?: { x: number; y: number };
    keyboardEvent?: React.KeyboardEvent<HTMLDivElement>;
    canvasSize?: [number, number];
    difficultyLevel?: "easy" | "medium" | "hard";
  };
}

export interface SnakeState {
  pointApples: [number, number][];
  inversionApples: [number, number][];
  snake: number[][];
  difficultyLevel: "easy" | "medium" | "hard";
  speed: number | null;
  direction: { x: number; y: number };
  disabled: boolean;
  score: number;
  scale: number;
  info: string;
}

export function snakeReducer(
  state: SnakeState,
  action: SnakeAction
): SnakeState {
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
            action.payload?.canvasSize!,
            state.scale
          )
        );
      }
      for (let i = 0; i < action.payload!.numberOfInversionApples!; i++) {
        inversionApples.push(
          drawApplePosition(
            action.payload?.snakeInitialPosition!,
            [...pointApples, ...inversionApples],
            action.payload?.canvasSize!,
            state.scale
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
        speed:
          state.speed === null
            ? findSpeed(action.payload!.difficultyLevel!)
            : null,
        difficultyLevel: action.payload!.difficultyLevel!,
        direction: action.payload?.direction!,
        info: "",
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

      let score = state.score;
      let newPointApples = checkPointsApples(
        snakeCopy,
        state.pointApples,
        state.inversionApples,
        action.payload?.canvasSize!,
        state.scale
      );
      let newInversionApples = checkInversionApples(
        snakeCopy,
        state.inversionApples,
        state.pointApples,
        action.payload?.canvasSize!,
        state.scale
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
      newPointApples =
        newPointApples != null ? newPointApples : state.pointApples;

      newInversionApples =
        newInversionApples != null ? newInversionApples : state.inversionApples;

      let newInfo = "";
      if (checkCollision(snakeCopy, action.payload?.canvasSize!, state.scale)) {
        speed = null;
        disabled = true;
        snakeCopy = [];
        newInversionApples = [];
        newPointApples = [];
        newInfo = "Game Over";
      }
      return {
        ...state,
        snake: snakeCopy,
        speed,
        disabled,
        direction,
        score,
        pointApples: newPointApples,
        inversionApples: newInversionApples,
        info: newInfo,
      };

    default:
      return { ...state };
  }
}
