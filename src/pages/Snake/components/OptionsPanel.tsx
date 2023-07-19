import React from "react";
import styled from "styled-components";
import StatefulButton from "../../../shared/components/StatefulButton";
import { useDarkMode } from "usehooks-ts";

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
  const { isDarkMode } = useDarkMode();

  return (
    <OptionsPanelContainer>
      <OptionContainer>
        <label>difficulty level:</label>
        <ToggleSwitchContainer>
          {["easy", "medium", "hard"].map((label) => (
            <StatefulButton
              isActive={optionsState.difficultyLevel === label ? true : false}
              isDarkMode={isDarkMode}
              onClick={() => {
                if (
                  label === "easy" ||
                  label === "medium" ||
                  label === "hard"
                ) {
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
