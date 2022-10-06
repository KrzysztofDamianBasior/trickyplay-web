import React, { useEffect } from "react";
import { GameObject, Genre, genres } from "../../../shared/data/gamesList";

import styled from "styled-components";
import * as palette from "../../../styles/variables";

type Props = {
  games: GameObject[];
  setActiveGenre: React.Dispatch<React.SetStateAction<Genre>>;
  setFiltered: React.Dispatch<React.SetStateAction<GameObject[]>>;
  activeGenre: Genre;
};

const GamesFilter = ({
  setActiveGenre,
  activeGenre,
  setFiltered,
  games,
}: Props) => {
  useEffect(() => {
    if (activeGenre === "all") {
      setFiltered(games);
      return;
    }
    const filtered = games.filter((game) => game.genre.includes(activeGenre));
    setFiltered(filtered);
  }, [activeGenre]);

  return (
    <GamesFilterContainer>
      {genres.map((genre) => (
        <GamesFilterButton
          key={"games-filter-" + genre}
          active={activeGenre === genre ? "active" : "inactive"}
          onClick={() => setActiveGenre(genre)}
          color="black"
        >
          <span>{genre}</span>
        </GamesFilterButton>
      ))}
    </GamesFilterContainer>
  );
};

export default GamesFilter;

const GamesFilterContainer = styled.header`
  width: 80vw;
  height: 20vh;
  display: flex;
  align-items: row;
  justify-content: space-evenly;
  align-items: center;
`;

interface GamesFilterButtonProps {
  color: string;
  active: string;
}

const GamesFilterButton = styled.button<GamesFilterButtonProps>`
  position: relative;
  display: block;

  width: 10vw;
  height: 8vh;

  background: #000;
  text-transform: uppercase;
  font-size: ${palette.FONTSIZE_MEDIUM};

  text-align: center;
  letter-spacing: 0.1em;
  text-decoration: none;
  transition: 0.5s;
  -webkit-box-reflect: below 1px linear-gradient(transparent, #0004);

  span {
    position: absolute;
    display: block;
    top: 1px;
    left: 1px;
    right: 1px;
    bottom: 1px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    background: #0c0c0c;

    color: ${(props) =>
      props.active === "active"
        ? "rgba(255, 255, 255, 1)"
        : "rgba(255, 255, 255, 0.2)"};

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
    background: ${palette.NEON_EFFECT_GRADIENT};
    background-size: 400%;
    opacity: ${(props) => (props.active === "active" ? 1 : 0)};
    transition: 2.5s;
    animation: games-filter-button__glowing-effect 20s linear infinite;
  }

  &:hover::before,
  &:hover::after {
    opacity: 1;
  }
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${palette.NEON_EFFECT_GRADIENT};
    background-size: 400%;
    opacity: 0;
    filter: blur(20px);
    transition: 0.5s;
    animation: games-filter-button__glowing-effect 20s ease infinite;
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
`;
