import { motion } from "framer-motion";
import { styled } from "@mui/material/styles";

import { GameDetailsType } from "../../../shared/models/internalAppRepresentation/resources";

type Props = { game: GameDetailsType; onClick: () => void };

const GamePlacard = ({ game, onClick }: Props) => {
  return (
    <motion.div
      layout
      animate={{ opacity: 1, scale: 1 }}
      initial={{ opacity: 0, scale: 0 }}
      exit={{ opacity: 0, scale: 0 }}
      transition={{ duration: 2 }}
    >
      <GamePlacardContainer onClick={onClick}>
        <h2>{game.title}</h2>
        <img src={game.image} alt="background" />
      </GamePlacardContainer>
    </motion.div>
  );
};

export default GamePlacard;

const GamePlacardContainer = styled("button")(
  ({ theme }) => `
  background: transparent;
  
  width: 100%;
  height: 280px;
  @media (max-width: ${theme.breakpoints.values.sm}px) {
    height: 230px;
  }

  color: ${theme.palette.secondary.main};
  text-transform: uppercase;
  font-size: 0.7rem;
  
  border: none;
  border-radius: 1rem;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  
  img {
    width: 100%;
    height: 90%;
    object-fit: cover;
    border-radius: 1rem;
  }

  &:hover {
    filter: brightness(1.2);
    cursor: pointer;
    border: dashed ${theme.palette.secondary.main};
  }

  overflow: hidden;
`
);
