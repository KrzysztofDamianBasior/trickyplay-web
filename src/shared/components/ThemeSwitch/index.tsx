import EmojiObjectsIcon from "@mui/icons-material/EmojiObjects";
import { useDarkMode } from "usehooks-ts";
import Box from "@mui/material/Box";

const ToggleThemeSwitch = () => {
  const { isDarkMode, toggle } = useDarkMode();

  return (
    <Box
      onClick={toggle}
      sx={{
        scale: { md: "1", sm: "0.9", xs: "0.8" },
        cursor: "pointer",
        position: "relative",
        display: "block",
        height: "42px",
        width: "84px",
        background: "#212121",
        borderRadius: "10px",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "0",
          left: !isDarkMode ? "41px" : "0",
          width: "42px",
          height: "42px",
          background: "#333",
          border: "6px solid #212121",
          borderRadius: "14px",
          transition: "0.5s",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <EmojiObjectsIcon
          fontSize="large"
          sx={{
            color: !isDarkMode
              ? "rgba(255, 255, 255, 1)"
              : "rgba(255, 255, 255, 0.25)",
            transition: "0.5s",
            filter: !isDarkMode
              ? "drop-shadow(0 0 5px #fff) drop-shadow(0 0 10px #fff) drop-shadow(0 0 15px #fff)"
              : "",
          }}
        />
      </Box>
    </Box>
  );
};

export default ToggleThemeSwitch;
