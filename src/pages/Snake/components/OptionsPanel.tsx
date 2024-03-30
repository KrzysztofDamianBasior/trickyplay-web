import React from "react";
import { useDarkMode } from "usehooks-ts";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

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
  const { isDarkMode } = useDarkMode();

  return (
    <OptionsPanelContainer>
      <OptionContainer>
        <Box
          component="label"
          htmlFor="difficultyLevel"
          sx={{
            marginRight: "15px",
            fontSize: { xs: "12px", sm: "20px", md: "20px", lg: "25px" },
          }}
        >
          Difficulty level:
        </Box>
        <ToggleSwitchContainer id="difficultyLevel">
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

const OptionsPanelContainer = styled("div")`
  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const OptionContainer = styled("div")`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: 2%;
`;

const ToggleSwitchContainer = styled("div")`
  align-self: flex-end;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;

  position: relative;
`;
