import React from "react";
import styled from "styled-components";
import StatefulButton from "../../../shared/components/StatefulButton";

type Props = {
  optionsState: {
    opened: boolean;
    difficultyLevel: "easy" | "medium" | "hard";
  };
  setOptionsState: React.Dispatch<
    React.SetStateAction<{
      opened: boolean;
      difficultyLevel: "easy" | "medium" | "hard";
    }>
  >;
};

const OptionsPanel = ({ optionsState, setOptionsState }: Props) => {
  return (
    <>
      difficultyLevel:
      <ToggleSwitchContainer>
        {["easy", "medium", "hard"].map((label) => (
          <StatefulButton
            active={optionsState.difficultyLevel === label ? true : false}
            onClick={() => {
              if (label === "easy" || label === "medium" || label === "hard") {
                setOptionsState((prev) => {
                  return {
                    ...prev,
                    difficultyLevel: label,
                  };
                });
              }
            }}
            key={label}
          >
            {label}
          </StatefulButton>
        ))}
      </ToggleSwitchContainer>
    </>
  );
};
export default OptionsPanel;

const ToggleSwitchContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
`;
