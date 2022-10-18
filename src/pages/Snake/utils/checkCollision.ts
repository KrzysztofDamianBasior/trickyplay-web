export const checkCollision = (
  snake: number[][],
  canvasSize: [number, number],
  scale: number
) => {
  if (
    snake[0][0] * scale >= canvasSize[0] || // # >= width
    snake[0][0] < 0 ||
    snake[0][1] * scale >= canvasSize[1] || // # >= height
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
