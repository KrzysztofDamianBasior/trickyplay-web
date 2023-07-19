import React from "react";
import styled from "styled-components";
import ActionButton from "../../../shared/components/ActionButton";
import StatefulButton from "../../../shared/components/StatefulButton";
import Banner from "../../../shared/components/Banner";
import { useDarkMode } from "usehooks-ts";

type Props = {
  score: number;
  openModal: () => void;
  pause: boolean;
  setPause: () => void;
  disabled: boolean;
};

const ControlsPanel = ({
  score,
  openModal,
  pause,
  setPause,
  disabled,
}: Props) => {
  const { isDarkMode } = useDarkMode();

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
        <section>
          <StatefulButton
            isDarkMode={isDarkMode}
            isActive={pause && !disabled}
            onClick={() => {
              if (!disabled) setPause();
            }}
          >
            Pause
          </StatefulButton>
        </section>
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
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: white;
    }
  }
`;
