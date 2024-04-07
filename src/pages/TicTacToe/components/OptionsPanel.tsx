import { Box } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";

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
  const theme = useTheme();

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
          Choose a game mode:
        </Box>
        <ToggleSwitchContainer id="howManyPlayers">
          {["single player", "two players"].map((label) => (
            <StatefulButton
              isDarkMode={theme.palette.mode === "dark"}
              isActive={
                optionsState.soloOrDuoMode === "solo" &&
                label === "single player"
                  ? true
                  : optionsState.soloOrDuoMode === "duo" &&
                    label === "two players"
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
          <Box
            component="label"
            htmlFor="whichSide"
            sx={{
              marginRight: "15px",
              fontSize: { xs: "12px", sm: "20px", md: "20px", lg: "25px" },
            }}
          >
            Choose a side:
          </Box>
          <ToggleSwitchContainer id="whichSide">
            {["x", "o"].map((label) => (
              <StatefulButton
                isDarkMode={theme.palette.mode === "dark"}
                isActive={label === optionsState.side ? true : false}
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
