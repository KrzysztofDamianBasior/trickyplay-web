import memoryImage from "../assets/gameBanners/memory.png";
import minesweeperImage from "../assets/gameBanners/minesweeper.png";
import shooterImage from "../assets/gameBanners/bulls-eye.png";
import snakeImage from "../assets/gameBanners/snake.jpg";
import tetrisImage from "../assets/gameBanners/tetris.jpg";
import ticTacToeImage from "../assets/gameBanners/ticTacToe.jpg";
import crosswordImage from "../assets/gameBanners/crossword.png";

export type Genre =
  | "all"
  | "shooters"
  | "puzzles"
  | "mazes"
  | "memory-games"
  | "strategy";

export const genres: Genre[] = [
  "all",
  "shooters",
  "puzzles",
  "mazes",
  "memory-games",
  "strategy",
];

export type GameObject = {
  id: number;
  title: string;
  image: string;
  description: string;
  genres: Genre[];
};

export const gamesList: GameObject[] = [
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
    title: "tetris",
    description: "",
    image: tetrisImage,
    genres: ["strategy"],
  },
  {
    id: 4,
    title: "minesweeper",
    description: "",
    image: minesweeperImage,
    genres: ["strategy", "puzzles", "memory-games"],
  },
  {
    id: 5,
    title: "crossword",
    description: "",
    image: crosswordImage,
    genres: ["memory-games"],
  },
  {
    id: 6,
    title: "shooter",
    description: "",
    image: shooterImage,
    genres: ["shooters"],
  },
  {
    id: 7,
    title: "memorize",
    description: "",
    image: memoryImage,
    genres: ["memory-games"],
  },
];
