import memoryImage from "../assets/gameBanners/memory.png";
import pacmanImage from "../assets/gameBanners/pacman.jpg";
import saperImage from "../assets/gameBanners/saper.png";
import shooterImage from "../assets/gameBanners/shooter.png";
import snakeImage from "../assets/gameBanners/snake.jpg";
import sudokuImage from "../assets/gameBanners/sudoku.jpg";
import tetrisImage from "../assets/gameBanners/tetris.jpg";
import ticTacToeImage from "../assets/gameBanners/ticTacToe.jpg";
import answerCheckImage from "../assets/gameBanners/answerCheck.png";
import crosswordImage from "../assets/gameBanners/crossword.png";
import wordleImage from "../assets/gameBanners/wordle.png";

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
  genre: Genre[];
};

export const gamesList: GameObject[] = [
  {
    id: 1,
    title: "tic-tac-toe",
    description: "",
    image: ticTacToeImage,
    genre: ["strategy"],
  },
  {
    id: 2,
    title: "snake",
    description: "",
    image: snakeImage,
    genre: ["mazes"],
  },
  {
    id: 3,
    title: "pacman",
    description: "",
    image: pacmanImage,
    genre: ["mazes"],
  },
  {
    id: 4,
    title: "tetris",
    description: "",
    image: tetrisImage,
    genre: ["strategy"],
  },
  {
    id: 5,
    title: "saper",
    description: "",
    image: saperImage,
    genre: ["strategy"],
  },
  {
    id: 6,
    title: "crossword",
    description: "",
    image: crosswordImage,
    genre: ["memory-games"],
  },
  {
    id: 7,
    title: "shooter",
    description: "",
    image: shooterImage,
    genre: ["shooters"],
  },
  {
    id: 8,
    title: "answer-check",
    description: "",
    image: answerCheckImage,
    genre: ["memory-games"],
  },
  {
    id: 9,
    title: "sudoku",
    description: "",
    image: sudokuImage,
    genre: ["puzzles"],
  },
  {
    id: 10,
    title: "memorize",
    description: "",
    image: memoryImage,
    genre: ["memory-games"],
  },
  {
    id: 11,
    title: "wordle",
    description: "",
    image: wordleImage,
    genre: ["memory-games"],
  },
];
