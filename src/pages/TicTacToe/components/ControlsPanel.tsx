import React from "react";
import styled from "styled-components";
import ActionButton from "../../../shared/components/ActionButton";
import Banner from "../../../shared/components/Banner";
import PointsContainer from "./PointsContainer";

type Props = {
  points: { o: number; x: number };
  openModal: () => void;
  resetPoints: () => void;
};

const ControlsPanel = ({ points, openModal, resetPoints }: Props) => {
  return (
    <TicTacToeControls>
      <Banner text="Tic Tac Toe" />
      <article>
        <section>
          <ActionButton onClick={() => openModal()}>
            Start a new game
          </ActionButton>
        </section>
        <section>
          <PointsContainer
            title="POINTS"
            headers={["O", "X"]}
            points={[points.o, points.x]}
            reset={() => resetPoints()}
          />
        </section>
      </article>
    </TicTacToeControls>
  );
};

export default ControlsPanel;

const TicTacToeControls = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  height: 80vh;
  article {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    height: 50vh;
    section {
      width: 100%;
    }
  }
`;
