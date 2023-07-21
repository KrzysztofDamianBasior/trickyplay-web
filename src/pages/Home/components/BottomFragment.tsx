import Box from "@mui/material/Box";

import GlowingMovingText from "./GlowingMovingText";

import { useDarkMode } from "usehooks-ts";

const BottomFragment = () => {
  const { isDarkMode } = useDarkMode();
  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
      }}
    >
      <GlowingMovingText isDarkMode={isDarkMode}>
        <span>START </span> A <span> GAME</span>
      </GlowingMovingText>
    </Box>
  );
};

export default BottomFragment;
