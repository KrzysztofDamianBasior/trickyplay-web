import { styled, useTheme } from "@mui/material/styles";

import ActionButton from "../../../shared/components/ActionButton";
import StatefulButton from "../../../shared/components/StatefulButton";
import Banner from "../../../shared/components/Banner";
import { Box } from "@mui/material";

type Props = {
  score: number;
  disabled: boolean;
  pause: boolean;
  setPause: () => void;
  openModal: () => void;
};

const ControlsPanel = ({
  score,
  disabled,
  pause,
  setPause,
  openModal,
}: Props) => {
  const theme = useTheme();

  return (
    <SnakeControls>
      <Banner text="Snake" />
      <Box
        sx={{
          backgroundImage: (theme) =>
            theme.palette.mode === "light"
              ? `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2000 2000" fill="%23000000"><path d="M1912 1209c27-319-72-699-318-882-187-139-462-224-785-204S85 468 84 880c0 455 481 345 636 484s139 514 477 516c386 3 693-420 715-671Z"></path></svg>')`
              : "",
          backgroundRepeat: "no-repeat",
          backgroundSize: "70%",
          backgroundPosition: "center",
          padding: "60px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <ActionButton onClick={() => openModal()}>
          Start a new game
        </ActionButton>
        <Box
          sx={{
            backgroundColor: "secondary.dark",
            borderRadius: "16px",
            p: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "column",
            width: "80%",
            minHeight: "150px",
          }}
        >
          <Box
            sx={{
              color: "secondary.contrastText",
              width: "100%",
              fontSize: { xs: "12px", sm: "20px", md: "20px", lg: "25px" },
              textTransform: "uppercase",
              textAlign: "center",
              m: 1,
            }}
          >
            points: {score}
          </Box>
          <Box sx={{ backgroundColor: "secondary.light" }}>
            <StatefulButton
              isDarkMode={theme.palette.mode === "dark"}
              isActive={pause && !disabled}
              onClick={() => {
                if (!disabled) setPause();
              }}
            >
              Pause
            </StatefulButton>
          </Box>
        </Box>
      </Box>
    </SnakeControls>
  );
};

export default ControlsPanel;

const SnakeControls = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
`;
