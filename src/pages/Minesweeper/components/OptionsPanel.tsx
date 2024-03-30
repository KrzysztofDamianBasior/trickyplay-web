import { useDarkMode } from "usehooks-ts";
import { Box, styled } from "@mui/material";

import StatefulButton from "../../../shared/components/StatefulButton";

type Props = {
  difficultyLevel: "beginner" | "intermediate" | "expert";
  setDifficultyLevel: (
    difficultyLevel: "beginner" | "intermediate" | "expert"
  ) => void;
};

const OptionsPanel = ({ difficultyLevel, setDifficultyLevel }: Props) => {
  const { isDarkMode } = useDarkMode();

  return (
    <OptionsPanelContainer>
      <OptionContainer>
        <Box
          component="label"
          htmlFor="howManyPlayers"
          sx={{
            marginRight: "15px",
            fontSize: { xs: "12px", sm: "20px", md: "20px", lg: "25px" },
          }}
        >
          Difficulty level:
        </Box>
        <ToggleSwitchContainer>
          {["beginner", "intermediate", "expert"].map((label) => (
            <StatefulButton
              isActive={difficultyLevel === label ? true : false}
              isDarkMode={isDarkMode}
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
