import React, { useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";

import GamePlacard from "../components/GamePlacard";
import GamesFilter from "../components/GamesFilter";
import Navbar from "../components/Navbar";

import memoryBackground from "../assets/gameBanners/memory.png";
import pacmanBackground from "../assets/gameBanners/pacman.jpg";
import saperBackground from "../assets/gameBanners/saper.png";
import shooterBackground from "../assets/gameBanners/shooter.png";
import snakeBackground from "../assets/gameBanners/snake.jpg";
import sudokuBackground from "../assets/gameBanners/sudoku.jpg";
import tetrisBackground from "../assets/gameBanners/tetris.jpg";
import ticTacToeBackground from "../assets/gameBanners/ticTacToe.jpg";
import answerCheckBackground from "../assets/gameBanners/answerCheck.png";
import crosswordBackground from "../assets/gameBanners/crossword.png";
import wordleBackground from "../assets/gameBanners/wordle.png";

export type Genre =
  | "all"
  | "shooters"
  | "puzzles"
  | "mazes"
  | "memory-games"
  | "strategy";

export type GameObject = {
  id: number;
  title: string;
  background: string;
  description: string;
  genre: Genre[];
};

type Props = {};

const intialGamesSet: GameObject[] = [
  {
    id: 1,
    title: "tic-tac-toe",
    description: "",
    background: ticTacToeBackground,
    genre: ["strategy"],
  },
  {
    id: 2,
    title: "snake",
    description: "",
    background: snakeBackground,
    genre: ["mazes"],
  },
  {
    id: 3,
    title: "pacman",
    description: "",
    background: pacmanBackground,
    genre: ["mazes"],
  },
  {
    id: 4,
    title: "tetris",
    description: "",
    background: tetrisBackground,
    genre: ["strategy"],
  },
  {
    id: 5,
    title: "saper",
    description: "",
    background: saperBackground,
    genre: ["strategy"],
  },
  {
    id: 6,
    title: "crossword",
    description: "",
    background: crosswordBackground,
    genre: ["memory-games"],
  },
  {
    id: 7,
    title: "shooter",
    description: "",
    background: shooterBackground,
    genre: ["shooters"],
  },
  {
    id: 8,
    title: "answer-check",
    description: "",
    background: answerCheckBackground,
    genre: ["memory-games"],
  },
  {
    id: 9,
    title: "sudoku",
    description: "",
    background: sudokuBackground,
    genre: ["puzzles"],
  },
  {
    id: 10,
    title: "memorize",
    description: "",
    background: memoryBackground,
    genre: ["memory-games"],
  },
  {
    id: 11,
    title: "wordle",
    description: "",
    background: wordleBackground,
    genre: ["memory-games"],
  },
];

const Games = (props: Props) => {
  const [games, setGames] = useState<GameObject[]>(intialGamesSet);
  const [filtered, setFiltered] = useState<GameObject[]>(intialGamesSet);
  const [activeGenre, setActiveGenre] = useState<Genre>("all");

  return (
    <GamesContainer>
      <Navbar />
      <section>
        <GamesFilter
          activeGenre={activeGenre}
          setActiveGenre={setActiveGenre}
          games={games}
          setFiltered={setFiltered}
        />
      </section>

      <motion.div layout className="popular-movies">
        <AnimatePresence>
          <main>
            {filtered.map((game) => (
              <GamePlacard key={game.id} game={game} />
            ))}
          </main>
        </AnimatePresence>
      </motion.div>
    </GamesContainer>
  );
};

export default Games;

const GamesContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  section {
    margin-top: 15vh;
  }
  main {
    width: 90vw;
    margin: 2% 2%;
    display: grid;
    grid-template-columns: repeat(auto-fit, 250px);
    grid-column-gap: 1rem;
    grid-row-gap: 2rem;
  }
`;
