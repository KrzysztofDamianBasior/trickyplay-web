import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { motion, AnimatePresence } from "framer-motion";

import GamePlacard from "./components/GamePlacard";
import GamesFilter from "./components/GamesFilter";
import Navbar from "../../shared/components/Navbar";
import {
  GameDetailsType,
  GenreType,
} from "../../shared/models/internalAppRepresentation/resources";
import { gamesList } from "../../shared/models/internalAppRepresentation/gamesList";

const Games = () => {
  const [games, setGames] = useState<GameDetailsType[]>(gamesList);
  const [filtered, setFiltered] = useState<GameDetailsType[]>(gamesList);
  const [activeGenre, setActiveGenre] = useState<GenreType>("all");
  const navigate = useNavigate();

  return (
    <Container>
      <Navbar />
      <GamesFilter
        activeGenre={activeGenre}
        setActiveGenre={setActiveGenre}
        games={games}
        setFiltered={setFiltered}
      />

      <motion.div layout>
        <AnimatePresence>
          <GameBanners>
            {filtered.map((game) => (
              <GamePlacard
                key={game.id}
                game={game}
                onClick={() => {
                  navigate(game.path);
                }}
              />
            ))}
          </GameBanners>
        </AnimatePresence>
      </motion.div>
    </Container>
  );
};

export default Games;

const GameBanners = styled("section")`
  ${({ theme }) => `

  width: 90vw;

  margin: 20px;

  display: grid;
  grid-template-columns: repeat(auto-fit, 250px);
  @media (max-width: ${theme.breakpoints.values.sm}px) {
    grid-template-columns: repeat(auto-fit, 200px);
  }
  grid-column-gap: 1rem;
  grid-row-gap: 2rem;
  align-content: center;
  justify-content: center;
  `}
`;

const Container = styled("main")`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
`;
