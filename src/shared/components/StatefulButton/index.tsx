import { styled } from "@mui/material";

type OptionButtonProps = {
  isActive: boolean;
  isDarkMode: boolean;
};

const StatefulButton = styled("button", {
  name: "StatefulButton",
  slot: "root",
  shouldForwardProp: (prop) => prop !== "isActive" && prop !== "isDarkMode",
})<OptionButtonProps>(({ theme, isActive, isDarkMode }) => ({
  position: "relative",
  overflow: "hidden",

  fontFamily: "open-sans",
  background: "transparent",
  border: isActive ? "1px solid rgb(146, 148, 248);" : "none",

  fontSize: "25px",
  width: "150px",
  height: "60px",
  [theme.breakpoints.down("lg")]: {
    width: "120px",
    height: "60px",
    fontSize: "20px",
  },
  [theme.breakpoints.down("md")]: {
    width: "100px",
    height: "50px",
    fontSize: "20px",
  },
  [theme.breakpoints.down("sm")]: {
    width: "65px",
    height: "50px",
    fontSize: "12px",
  },

  color: isDarkMode ? "#fff" : "000",
  textDecoration: "none",

  cursor: "pointer",

  "&:hover": {
    boxShadow: "1px 1px 25px 10px rgba(146, 148, 248, 0.4)",
  },

  "&:before": {
    content: '""',
    position: "absolute",
    width: "100%",
    height: "100%",

    top: "0",
    left: "-100%",

    background:
      "linear-gradient(120deg,transparent,rgba(146, 148, 248, 0.4),transparent)",

    transition: "all 650ms",
  },

  "&:hover:before": {
    left: "100%",
  },
}));

export default StatefulButton;
