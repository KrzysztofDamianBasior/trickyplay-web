import { arrayIntersection } from "./arrayIntersection";
import { combos } from "./combos";
import { getRandomInt } from "./getRandomInt";

export const computerMove = (
  board: string[][],
  side: string //side on which human player plays
): [number, number] | null => {
  if (board.every((row) => row.every((ele) => ele === "x" || ele === "o"))) {
    // no move when board is full
    return null;
  }

  if (board.every((row) => row.every((ele) => ele === ""))) {
    // random move when board is empty
    return [getRandomInt(0, board.length), getRandomInt(0, board[0].length)];
  }

  let humanPlayerPattern: number[] = [];
  let computerPlayerPattern: number[] = [];
  let fieldsMissingHumanSideToWin: number[][] = [];
  let fieldsMissingComputerSideToWin: number[][] = [];

  board.forEach((row, rowIndex) =>
    row.forEach((element, columnIndex) => {
      if (element === side) {
        humanPlayerPattern.push((columnIndex % 3) + (rowIndex % 3) * 3);
      } else {
        computerPlayerPattern.push((columnIndex % 3) + (rowIndex % 3) * 3);
      }
    })
  );

  //fields missing to win
  for (let combo in combos) {
    combos[combo].forEach((pattern) => {
      let { union: unionWithHumanPlayer, disunion: disunionWithHumanPlayer } =
        arrayIntersection(pattern, humanPlayerPattern);
      let {
        union: unionWithComputerPlayer,
        disunion: disunionWithComputerPlayer,
      } = arrayIntersection(pattern, computerPlayerPattern);

      fieldsMissingHumanSideToWin.push(disunionWithHumanPlayer);
      fieldsMissingComputerSideToWin.push(disunionWithComputerPlayer);
    });
  }

  // if computer has one move to win, check if field is empty
  let oneComputerMoveToWin = fieldsMissingComputerSideToWin.filter(
    (el) => el.length === 1
  );
  if (oneComputerMoveToWin.length) {
    for (let el of oneComputerMoveToWin) {
      let { union, disunion } = arrayIntersection(el, humanPlayerPattern);
      if (disunion.length) {
        return [Math.floor(disunion[0] / 3), disunion[0] % 3]; //a%3 => column ,    floor(a/3) => row
      }
    }
  }

  // if human has one move to win, check if field is empty
  let oneHumanMoveToWin = fieldsMissingHumanSideToWin.filter(
    (el) => el.length === 1
  );
  if (oneHumanMoveToWin.length) {
    for (let el of oneHumanMoveToWin) {
      let { union, disunion } = arrayIntersection(el, computerPlayerPattern);
      if (disunion.length) {
        return [Math.floor(disunion[0] / 3), disunion[0] % 3]; //a%3 => column ,    floor(a/3) => row
      }
    }
  }

  // if human has two moves to win, check if field is empty
  let twoHumanMovesToWin = oneHumanMoveToWin.filter((el) => el.length === 2);
  for (let el of twoHumanMovesToWin) {
    let { union, disunion } = arrayIntersection(el, computerPlayerPattern);
    if (disunion.length) {
      return [Math.floor(disunion[0] / 3), disunion[0] % 3]; //a%3 => column ,    floor(a/3) => row
    }
  }
  return null;
};
