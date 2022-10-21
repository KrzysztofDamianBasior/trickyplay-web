import React from "react";
import styled from "styled-components";

const Minesweeper = () => {
  return (
    <MinesweeperContainer>
      <div>flags left: 0, start a game</div>
      <div>board</div>
    </MinesweeperContainer>
  );
};

export default Minesweeper;

const MinesweeperContainer = styled.div``;
