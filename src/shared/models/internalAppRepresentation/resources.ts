export type CommentDetailsType = {
  id: string;
  body: string;
  author: UserDetailsType;
  createdAt: string;
  updatedAt: string;
  gameName: GameNameType;
};

export type ReplyDetailsType = {
  id: string;
  parentCommentId: string;
  body: string;
  author: UserDetailsType;
  createdAt: string;
  updatedAt: string;
};

export type UserDetailsType = {
  id: string;
  name: string;
  role: "USER" | "ADMIN" | "BANNED";
  createdAt: string;
  updatedAt: string;
};

export type GameDetailsType = {
  id: number;
  title: string;
  image: string;
  description: string;
  genres: GenreType[];
  path: string;
};

export type GenreType =
  | "all"
  | "arcade"
  | "puzzles"
  | "mazes"
  | "memory-games"
  | "strategy";

export const genres: GenreType[] = [
  "all",
  // "arcade",
  "puzzles",
  "mazes",
  "memory-games",
  "strategy",
];

export type GameNameType = "Minesweeper" | "TicTacToe" | "Snake";
