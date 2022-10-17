import React from "react";
import styled from "styled-components";
import StatefulButton from "../../../shared/components/StatefulButton";

type Props = {
  optionsState: {
    opened: boolean;
    soloOrDuoMode: "solo" | "duo";
    side: "x" | "o";
  };
  setOptionsState: React.Dispatch<
    React.SetStateAction<{
      opened: boolean;
      soloOrDuoMode: "solo" | "duo";
      side: "x" | "o";
    }>
  >;
};

const OptionsPanel = ({ optionsState, setOptionsState }: Props) => {
  return (
    <OptionsPanelContainer>
      <OptionContainer>
        <label>Choose a game mode:</label>
        <ToggleSwitchContainer>
          {["single player", "two players"].map((label) => (
            <StatefulButton
              active={
                optionsState.soloOrDuoMode === "solo" &&
                label === "single player"
                  ? true
                  : false
              }
              onClick={() =>
                setOptionsState((prev) => {
                  return {
                    ...prev,
                    soloOrDuoMode: label === "single player" ? "solo" : "duo",
                  };
                })
              }
              key={label}
            >
              {label}
            </StatefulButton>
          ))}
        </ToggleSwitchContainer>
      </OptionContainer>

      {optionsState.soloOrDuoMode === "solo" && (
        <OptionContainer>
          <label>Choose a side:</label>
          <ToggleSwitchContainer>
            {["x", "o"].map((label) => (
              <StatefulButton
                active={label === optionsState.side ? true : false}
                onClick={() => {
                  if (label === "x" || label === "o") {
                    setOptionsState((prev) => {
                      return { ...prev, side: label };
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
      )}
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
  width: 100%;
  margin-top: 2%;
`;
const ToggleSwitchContainer = styled.div`
  align-self: flex-end;
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
`;
