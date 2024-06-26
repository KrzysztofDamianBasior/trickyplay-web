import { CommentRepresentation } from "../../../shared/models/externalApiRepresentation/Resources";
import { adminStub, bannedStub, userStub } from "./users";

const userSnakeCommentsCollectionStub: CommentRepresentation[] = [
  {
    author: userStub,
    body: "user first snake comment body",
    gameName: "Snake",
    id: 1,
    createdAt: "2023-10-15T20:30:38",
    updatedAt: "2023-10-15T20:30:38",
  },
  {
    author: userStub,
    body: "user second snake comment body",
    gameName: "Snake",
    id: 2,
    createdAt: "2023-10-15T20:30:38",
    updatedAt: "2023-10-15T20:30:38",
  },
];

const adminSnakeCommentsCollectionStub: CommentRepresentation[] = [
  {
    author: adminStub,
    body: "admin first snake comment body",
    gameName: "Snake",
    id: 3,
    createdAt: "2023-10-15T20:30:38",
    updatedAt: "2023-10-15T20:30:38",
  },
  {
    author: adminStub,
    body: "admin second snake comment body",
    gameName: "Snake",
    id: 4,
    createdAt: "2023-10-15T20:30:38",
    updatedAt: "2023-10-15T20:30:38",
  },
];

const bannedSnakeCommentsCollectionStub: CommentRepresentation[] = [
  {
    author: bannedStub,
    body: "banned first snake comment body",
    gameName: "Snake",
    id: 5,
    createdAt: "2023-10-15T20:30:38",
    updatedAt: "2023-10-15T20:30:38",
  },
  {
    author: bannedStub,
    body: "banned second snake comment body",
    gameName: "Snake",
    id: 6,
    createdAt: "2023-10-15T20:30:38",
    updatedAt: "2023-10-15T20:30:38",
  },
];

const userMinesweeperCommentsCollectionStub: CommentRepresentation[] = [
  {
    author: userStub,
    body: "user first minesweeper comment body",
    gameName: "Minesweeper",
    id: 7,
    createdAt: "2023-10-15T20:30:38",
    updatedAt: "2023-10-15T20:30:38",
  },
  {
    author: userStub,
    body: "user second minesweeper comment body",
    gameName: "Minesweeper",
    id: 8,
    createdAt: "2023-10-15T20:30:38",
    updatedAt: "2023-10-15T20:30:38",
  },
];

const adminMinesweeperCommentsCollectionStub: CommentRepresentation[] = [
  {
    author: adminStub,
    body: "admin first minesweeper comment body",
    gameName: "Minesweeper",
    id: 9,
    createdAt: "2023-10-15T20:30:38",
    updatedAt: "2023-10-15T20:30:38",
  },
  {
    author: adminStub,
    body: "admin second minesweeper comment body",
    gameName: "Minesweeper",
    id: 10,
    createdAt: "2023-10-15T20:30:38",
    updatedAt: "2023-10-15T20:30:38",
  },
];

const bannedMinesweeperCommentsCollectionStub: CommentRepresentation[] = [
  {
    author: bannedStub,
    body: "banned first minesweeper comment body",
    gameName: "Minesweeper",
    id: 11,
    createdAt: "2023-10-15T20:30:38",
    updatedAt: "2023-10-15T20:30:38",
  },
  {
    author: bannedStub,
    body: "banned second minesweeper comment body",
    gameName: "Minesweeper",
    id: 12,
    createdAt: "2023-10-15T20:30:38",
    updatedAt: "2023-10-15T20:30:38",
  },
];

const userTicTacToeCommentsCollectionStub: CommentRepresentation[] = [
  {
    author: userStub,
    body: "user first tictactoe comment body",
    gameName: "TicTacToe",
    id: 13,
    createdAt: "2023-10-15T20:30:38",
    updatedAt: "2023-10-15T20:30:38",
  },
  {
    author: userStub,
    body: "user second tictactoe comment body",
    gameName: "TicTacToe",
    id: 14,
    createdAt: "2023-10-15T20:30:38",
    updatedAt: "2023-10-15T20:30:38",
  },
];

const adminTicTacToeCommentsCollectionStub: CommentRepresentation[] = [
  {
    author: adminStub,
    body: "admin first tictactoe comment body",
    gameName: "TicTacToe",
    id: 15,
    createdAt: "2023-10-15T20:30:38",
    updatedAt: "2023-10-15T20:30:38",
  },
  {
    author: adminStub,
    body: "admin second tictactoe comment body",
    gameName: "TicTacToe",
    id: 16,
    createdAt: "2023-10-15T20:30:38",
    updatedAt: "2023-10-15T20:30:38",
  },
];

const bannedTicTacToeCommentsCollectionStub: CommentRepresentation[] = [
  {
    author: bannedStub,
    body: "banned first tictactoe comment body",
    gameName: "TicTacToe",
    id: 17,
    createdAt: "2023-10-15T20:30:38",
    updatedAt: "2023-10-15T20:30:38",
  },
  {
    author: bannedStub,
    body: "banned second tictactoe comment body",
    gameName: "TicTacToe",
    id: 18,
    createdAt: "2023-10-15T20:30:38",
    updatedAt: "2023-10-15T20:30:38",
  },
];

export let commentsCollectionStub: CommentRepresentation[] = [
  ...userSnakeCommentsCollectionStub,
  ...adminSnakeCommentsCollectionStub,
  ...bannedSnakeCommentsCollectionStub,
  ...userMinesweeperCommentsCollectionStub,
  ...adminMinesweeperCommentsCollectionStub,
  ...bannedMinesweeperCommentsCollectionStub,
  ...userTicTacToeCommentsCollectionStub,
  ...adminTicTacToeCommentsCollectionStub,
  ...bannedTicTacToeCommentsCollectionStub,
];

let commentsCollectionStubCopy: CommentRepresentation[] = JSON.parse(
  JSON.stringify(commentsCollectionStub)
);

export const resetCommentsCollectionStub = () => {
  commentsCollectionStub.length = 0; // This will clear the existing array by setting its length to 0
  commentsCollectionStub.push(...commentsCollectionStubCopy);
  commentsCollectionStubCopy = JSON.parse(
    JSON.stringify(commentsCollectionStub)
  );
};
