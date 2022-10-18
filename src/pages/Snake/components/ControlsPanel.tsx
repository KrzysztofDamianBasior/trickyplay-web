import React from "react";
import styled from "styled-components";
import ActionButton from "../../../shared/components/ActionButton";
import Banner from "../../../shared/components/Banner";

type Props = {
  score: number;
  openModal: () => void;
};

const ControlsPanel = ({ score, openModal }: Props) => {
  return (
    <SnakeControls>
      <Banner text="Snake" />
      <article>
        <section>
          <ActionButton onClick={() => openModal()}>
            Start a new game
          </ActionButton>
        </section>
        <section>points: {score}</section>
        <section>max-score: </section>
      </article>
    </SnakeControls>
  );
};

export default ControlsPanel;

const SnakeControls = styled.div`
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
