import React, { useEffect } from "react";
import { styled } from "@mui/material";

import {
  type GameDetailsType,
  type GenreType,
  genres,
} from "../../../shared/models/internalAppRepresentation/resources";

type Props = {
  games: GameDetailsType[];
  activeGenre: GenreType;
  setActiveGenre: React.Dispatch<React.SetStateAction<GenreType>>;
  setFiltered: React.Dispatch<React.SetStateAction<GameDetailsType[]>>;
};

export const NEON_EFFECT_GRADIENT = `linear-gradient(
  45deg,
  #c0392b,
  #f39c12,
  #f1c40f,
  #2ecc71,
  #3498db,
  #2980b9,
  #9b59b6,
  #8e44ad,
  #c0392b,
  #f39c12,
  #f1c40f,
  #2ecc71,
  #3498db,
  #2980b9,
  #9b59b6,
  #8e44ad
);`;

const GamesFilter = ({
  games,
  activeGenre,
  setActiveGenre,
  setFiltered,
}: Props) => {
  useEffect(() => {
    if (activeGenre === "all") {
      setFiltered(games);
      return;
    }
    const filtered = games.filter((game) => game.genres.includes(activeGenre));
    setFiltered(filtered);
  }, [activeGenre, setFiltered, games]);

  return (
    <GamesFilterContainer>
      {genres.map((genre) => (
        <GamesFilterButton
          key={"games-filter-" + genre}
          active={activeGenre === genre ? "active" : "inactive"}
          onClick={() => setActiveGenre(genre)}
        >
          <span>{genre}</span>
        </GamesFilterButton>
      ))}
    </GamesFilterContainer>
  );
};

export default GamesFilter;

const GamesFilterContainer = styled("header")`
  width: 80vw;

  margin: 20px;

  display: flex;
  align-items: row;
  justify-content: space-evenly;
  align-items: center;
  flex-wrap: wrap;
`;

interface GamesFilterButtonProps {
  active: string;
}

const GamesFilterButton = styled("button")<GamesFilterButtonProps>`
  ${({ theme, active }) => `
    position: relative;
    display: block;

    margin: 10px;

    border: none;

    text-transform: uppercase;
    font-size: "1.6vw";
    text-align: center;
    letter-spacing: 0.1em;
    text-decoration: none;

    width: 180px;
    height: 60px;
    
    @media (max-width: ${theme.breakpoints.values.md}px) {
      font-size: "1.4vw";
      width: 150px;
      height: 60px;
    }
    @media (max-width: ${theme.breakpoints.values.sm}px) {
      font-size: "1.2vw";
      width: 100px;
      height: 50px;
    }

    transition: 0.5s;

    cursor: pointer;

    -webkit-box-reflect: below 1px linear-gradient(transparent, #0004);

    background: #000;
    
    span {
      position: absolute;
      top: 1px;
      left: 1px;
      right: 1px;
      bottom: 1px;

      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;

      background: #0c0c0c;

      color: ${
        active === "active"
          ? "rgba(255, 255, 255, 1)"
          : "rgba(255, 255, 255, 0.2)"
      };

      transition: 0.5s;

      &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;

        width: 100%;
        height: 50%;
        
        background: rgba(255, 255, 255, 0.1);
      }
    }

    &:hover span {
      color: rgba(255, 255, 255, 1);
    }

    &::before {
      content: "";
      
      position: absolute;
      top: 0;
      left: 0;
      
      width: 100%;
      height: 100%;
      
      background: ${NEON_EFFECT_GRADIENT};
      background-size: 400%;
      
      opacity: ${active === "active" ? 1 : 0};
      
      transition: 2.5s;

      animation: games-filter-button__glowing-effect 20s linear infinite;
    }

    &::after {
      content: "";
      
      position: absolute;
      top: 0;
      left: 0;

      width: 100%;
      height: 100%;

      background: ${NEON_EFFECT_GRADIENT};
      background-size: 400%;

      opacity: 0;
      
      filter: blur(20px);
      
      transition: 0.5s;
      
      animation: games-filter-button__glowing-effect 20s ease infinite;
    }
    
    &:hover::before,
    &:hover::after {
      opacity: 1;
    }
    
    @keyframes games-filter-button__glowing-effect {
      0% {
        background-position: 0 0;
      }
      50% {
        background-position: 400% 0;
      }
      100% {
        background-position: 0 0;
      }
    }
  `}
`;
