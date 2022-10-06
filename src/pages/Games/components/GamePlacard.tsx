import React from "react";

import styled from "styled-components";
import { motion } from "framer-motion";
import { GameObject } from "../../../shared/data/gamesList";

type Props = { game: GameObject };

const GamePlacard = ({ game }: Props) => {
  return (
    <motion.div
      layout
      animate={{ opacity: 1, scale: 1 }}
      initial={{ opacity: 0, scale: 0 }}
      exit={{ opacity: 0, scale: 0 }}
      transition={{ duration: 2 }}
    >
      <GamePlacardContainer>
        <h2>{game.title}</h2>
        <img src={game.image} alt="background" />
      </GamePlacardContainer>
    </motion.div>
  );
};

export default GamePlacard;

const GamePlacardContainer = styled.div`
  width: 100%;
  height: 40vh;
  color: ${(props) => props.theme.secondaryColor};

  text-transform: uppercase;
  font-size: 0.7rem;

  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  img {
    border-radius: 1rem;
    width: 100%;
    height: 90%;
    object-fit: cover;
  }
  overflow: hidden;
`;
