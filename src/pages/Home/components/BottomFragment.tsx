import { useNavigate } from "react-router-dom";

import GlowingMovingText from "./GlowingMovingText";

import Box from "@mui/material/Box";
import { useTheme } from "@mui/material";

const BottomFragment = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
      }}
    >
      <GlowingMovingText
        isDarkMode={theme.palette.mode === "dark"}
        onClick={() => navigate("/games")}
      >
        <span>START </span> A <span> GAME</span>
      </GlowingMovingText>
    </Box>
  );
};

export default BottomFragment;
