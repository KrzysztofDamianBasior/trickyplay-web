export const checkIfAppleEaten = (
  snake: number[][],
  applePosition: [number, number]
) =>
  snake.some(
    (segment) =>
      segment[0] === applePosition[0] && segment[1] === applePosition[1]
  );
