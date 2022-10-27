import React from "react";
import styled from "styled-components";
import StatefulButton from "../../../shared/components/StatefulButton";

type Props = {
  difficultyLevel: "beginner" | "intermediate" | "expert";
  setDifficultyLevel: (
    difficultyLevel: "beginner" | "intermediate" | "expert"
  ) => void;
};

const OptionsPanel = ({ difficultyLevel, setDifficultyLevel }: Props) => {
  return (
    <OptionsPanelContainer>
      <OptionContainer>
        <label>difficulty level:</label>
        <ToggleSwitchContainer>
          {["beginner", "intermediate", "expert"].map((label) => (
            <StatefulButton
              active={difficultyLevel === label ? true : false}
              onClick={() => {
                if (
                  label === "beginner" ||
                  label === "intermediate" ||
                  label === "expert"
                ) {
                  setDifficultyLevel(label);
                }
              }}
              key={label}
            >
              {label}
            </StatefulButton>
          ))}
        </ToggleSwitchContainer>
      </OptionContainer>
    </OptionsPanelContainer>
  );
};
export default OptionsPanel;

const OptionsPanelContainer = styled.div`
  width: 30vw;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const OptionContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: 2%;
  label {
    margin-right: 20px;
  }
`;

const ToggleSwitchContainer = styled.div`
  align-self: flex-end;
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
`;
