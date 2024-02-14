import minesweeperImage from "../assets/gameBanners/minesweeper.png";
import snakeImage from "../assets/gameBanners/snake.jpg";
import ticTacToeImage from "../assets/gameBanners/ticTacToe.jpg";

import { GameDetailsType } from "./resources";

export const gamesList: GameDetailsType[] = [
  {
    id: 1,
    title: "tic-tac-toe",
    description: "",
    image: ticTacToeImage,
    genres: ["strategy"],
  },
  {
    id: 2,
    title: "snake",
    description: "",
    image: snakeImage,
    genres: ["mazes", "strategy"],
  },
  {
    id: 3,
    title: "minesweeper",
    description: "",
    image: minesweeperImage,
    genres: ["strategy", "puzzles", "memory-games"],
  },
];
