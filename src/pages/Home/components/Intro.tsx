import Box from "@mui/material/Box";
import { useMediaQuery, useTheme } from "@mui/material";

import GlowingTubelightText from "./GlowingTubelightText";

import Logo from "../../../shared/assets/logo.png";

const Intro = () => {
  const theme = useTheme();
  const isMatchMD = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        minHeight: "80vh",
        marginTop: "5vh",
      }}
    >
      {!isMatchMD && (
        <img
          src={Logo}
          style={{
            maxWidth: "30vw",
            height: "auto",
          }}
          alt="app logo"
        />
      )}
      <Box
        component="blockquote"
        sx={{ marginTop: "5vh", color: "text.primary" }}
      >
        <GlowingTubelightText>
          The obvious objective of video games is to entertain people by
          surprising them with new experiences.
        </GlowingTubelightText>
        <Box
          component="footer"
          sx={{
            fontSize: { xs: "1rem", sm: "2rem", md: "3rem" },
            color: "inherit",
            marginTop: { xs: "1rem", sm: "2rem", md: "3rem" },
            float: "right",
          }}
        >
          —Shigeru Miyamoto
        </Box>
      </Box>
    </Box>
  );
};

export default Intro;
