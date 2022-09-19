import { arrayIntersection } from "./arrayIntersection";
import { combos } from "./combos";

export const victoryStatus = (
  board: string[][]
): "x won" | "o won" | "draw" | "" => {
  let patternX: number[] = []; //x moves
  let patternO: number[] = []; //o moves
  let wheatherTheBoardIsFull: boolean = true; //suppose true

  board.forEach((row, rowIndex) =>
    row.forEach((element, columnIndex) => {
      if (wheatherTheBoardIsFull && element === "") {
        wheatherTheBoardIsFull = false;
      }
      if (element === "x") {
        patternX.push((columnIndex % 3) + (rowIndex % 3) * 3);
      }
      if (element === "o") {
        patternO.push((columnIndex % 3) + (rowIndex % 3) * 3);
      }
    })
  );

  for (let combo in combos) {
    for (let pattern of combos[combo]) {
      let { union: unionX, disunion: disunionX } = arrayIntersection(
        pattern,
        patternX
      );
      let { union: unionO, disunion: disunionO } = arrayIntersection(
        pattern,
        patternO
      );
      if (unionO.length === 3) {
        return "o won";
      }
      if (unionX.length === 3) {
        return "x won";
      }
    }
  }

  if (wheatherTheBoardIsFull) {
    return "draw"; //no winner
  }

  return "";
};
