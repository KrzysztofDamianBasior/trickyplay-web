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
  let newState: SnakeState = JSON.parse(JSON.stringify(state));

  switch (action.type) {
    case SnakeActionKind.START_GAME:
      newState.pointApples = [];
      newState.inversionApples = [];

      for (let i = 0; i < action.payload!.numberOfPointApples!; i++) {
        newState.pointApples.push(
          drawApplePosition(
            action.payload?.snakeInitialPosition!,
            newState.pointApples,
            action.payload?.canvasSize!,
            state.scale
          )
        );
      }
      for (let i = 0; i < action.payload!.numberOfInversionApples!; i++) {
        newState.inversionApples.push(
          drawApplePosition(
            action.payload?.snakeInitialPosition!,
            [...newState.pointApples, ...newState.inversionApples],
            action.payload?.canvasSize!,
            state.scale
          )
        );
      }

      newState.disabled = false;
      newState.score = 0;
      newState.snake = action.payload?.snakeInitialPosition!;
      newState.speed = findSpeed(action.payload!.difficultyLevel!);
      newState.difficultyLevel = action.payload!.difficultyLevel!;
      newState.direction = action.payload?.direction!;
      newState.info = "";
      return { ...newState };

    case SnakeActionKind.CHANGE_DIRECTION:
      switch (action.payload!.keyboardEvent!.key) {
        case "ArrowUp":
          if (state.direction.y !== 0) break;
          if (state.snake[0][1] - state.snake[1][1] > 0) break;
          newState.direction = { x: 0, y: -1 };
          break;
        case "ArrowDown":
          if (state.direction.y !== 0) break;
          if (state.snake[0][1] - state.snake[1][1] < 0) break;
          newState.direction = { x: 0, y: 1 };
          break;
        case "ArrowLeft":
          if (state.direction.x !== 0) break;
          if (state.snake[0][0] - state.snake[1][0] > 0) break;
          newState.direction = { x: -1, y: 0 };
          break;
        case "ArrowRight":
          if (state.direction.x !== 0) break;
          if (state.snake[0][0] - state.snake[1][0] < 0) break;
          newState.direction = { x: 1, y: 0 };
          break;
      }
      return { ...newState };

    case SnakeActionKind.PAUSE:
      newState.speed =
        state.speed === null ? findSpeed(state.difficultyLevel) : null;
      return { ...newState };

    case SnakeActionKind.MOVE:
      let newSnakeHead = [
        newState.snake[0][0] + state.direction.x,
        newState.snake[0][1] + state.direction.y,
      ];
      newState.snake.unshift(newSnakeHead);

      let newPointApples = checkPointsApples(
        newState.snake,
        newState.pointApples,
        newState.inversionApples,
        action.payload?.canvasSize!,
        newState.scale
      );
      let newInversionApples = checkInversionApples(
        newState.snake,
        newState.inversionApples,
        newState.pointApples,
        action.payload?.canvasSize!,
        newState.scale
      );
      if (newPointApples) {
        newState.score += 1;
      } else {
        newState.snake.pop();
      }
      if (newInversionApples) {
        newState.snake.reverse();
        newState.direction = {
          x: newState.snake[0][0] - newState.snake[1][0],
          y: newState.snake[0][1] - newState.snake[1][1],
        };
      }

      newState.pointApples =
        newPointApples != null ? newPointApples : state.pointApples;
      newState.inversionApples =
        newInversionApples != null ? newInversionApples : state.inversionApples;
      newState.info = "";

      if (
        checkCollision(newState.snake, action.payload?.canvasSize!, state.scale)
      ) {
        newState.speed = null;
        newState.disabled = true;
        newState.snake = [];
        newState.inversionApples = [];
        newState.pointApples = [];
        newState.info = "Game Over";
      }
      return { ...newState };

    default:
      return { ...state };
  }
}
