import React, { useEffect } from "react";
import { GameObject, Genre } from "../pages/Games";
import styled from "styled-components";

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
      <GamesFilterButton
        active={activeGenre === "all" ? "active" : "inactive"}
        onClick={() => setActiveGenre("all")}
        color="black"
      >
        <span> All</span>
      </GamesFilterButton>
      <GamesFilterButton
        active={activeGenre === "shooters" ? "active" : "inactive"}
        onClick={() => setActiveGenre("shooters")}
        color="black"
      >
        <span>Shooters</span>
      </GamesFilterButton>
      <GamesFilterButton
        active={activeGenre === "puzzles" ? "active" : "inactive"}
        onClick={() => setActiveGenre("puzzles")}
        color="black"
      >
        <span>Puzzles</span>
      </GamesFilterButton>
      <GamesFilterButton
        active={activeGenre === "mazes" ? "active" : "inactive"}
        onClick={() => setActiveGenre("mazes")}
        color="black"
      >
        <span>Mazes</span>
      </GamesFilterButton>
      <GamesFilterButton
        active={activeGenre === "memory-games" ? "active" : "inactive"}
        onClick={() => setActiveGenre("memory-games")}
        color="black"
      >
        <span>Memory Games</span>
      </GamesFilterButton>
      <GamesFilterButton
        active={activeGenre === "strategy" ? "active" : "inactive"}
        onClick={() => setActiveGenre("strategy")}
        color="black"
      >
        <span>Strategy</span>
      </GamesFilterButton>
    </GamesFilterContainer>
  );
};

export default GamesFilter;

interface GamesFilterButtonProps {
  color: string;
  active: string;
}

const GamesFilterContainer = styled.div`
  width: 80vw;
  height: 20vh;
  display: flex;
  align-items: row;
  justify-content: space-evenly;
  align-items: center;
`;

const GamesFilterButton = styled.button<GamesFilterButtonProps>`
  position: relative;
  display: block;

  width: 10vw;
  height: 8vh;

  background: #000;
  text-transform: uppercase;

  font-size: 20px;

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
      z-index: 10;
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
    background: linear-gradient(
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
    );
    background-size: 400%;
    opacity: ${(props) => (props.active === "active" ? 1 : 0)};
    transition: 2.5s;
    animation: eff 20s linear infinite;
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
    background: linear-gradient(
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
    );
    background-size: 400%;
    opacity: 0;
    filter: blur(20px);
    transition: 0.5s;
    animation: eff 20s ease infinite;
  }
  @keyframes eff {
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
