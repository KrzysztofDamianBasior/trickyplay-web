import { useNavigate } from "react-router-dom";
import { useDarkMode } from "usehooks-ts";
import Box from "@mui/material/Box";

import GlowingMovingText from "./GlowingMovingText";

const BottomFragment = () => {
  const { isDarkMode } = useDarkMode();
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
        isDarkMode={isDarkMode}
        onClick={() => navigate("/games")}
      >
        <span>START </span> A <span> GAME</span>
      </GlowingMovingText>
    </Box>
  );
};

export default BottomFragment;
