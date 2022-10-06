import React, { useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { Genre, GameObject, gamesList } from "../../shared/data/gamesList";

import GamePlacard from "./components/GamePlacard";
import GamesFilter from "./components/GamesFilter";
import Navbar from "../../shared/components/Navbar";

const Games = () => {
  const [games, setGames] = useState<GameObject[]>(gamesList);
  const [filtered, setFiltered] = useState<GameObject[]>(gamesList);
  const [activeGenre, setActiveGenre] = useState<Genre>("all");

  return (
    <Container>
      <Navbar />
      <GameFilter>
        <GamesFilter
          activeGenre={activeGenre}
          setActiveGenre={setActiveGenre}
          games={games}
          setFiltered={setFiltered}
        />
      </GameFilter>

      <motion.div layout className="popular-movies">
        <AnimatePresence>
          <GameBanners>
            {filtered.map((game) => (
              <GamePlacard key={game.id} game={game} />
            ))}
          </GameBanners>
        </AnimatePresence>
      </motion.div>
    </Container>
  );
};

export default Games;

const GameFilter = styled.section`
  margin-top: 15vh;
`;

const GameBanners = styled.section`
  width: 90vw;
  margin: 2% 2%;
  display: grid;
  grid-template-columns: repeat(auto-fit, 250px);
  grid-column-gap: 1rem;
  grid-row-gap: 2rem;
`;

const Container = styled.main`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
