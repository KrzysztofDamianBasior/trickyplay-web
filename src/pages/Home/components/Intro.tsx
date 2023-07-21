import Box from "@mui/material/Box";

import GlowingTubelightText from "./GlowingTubelightText";

import Logo from "../../../shared/assets/logo.png";

const Intro = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        minHeight: "80vh",
        marginTop: "10vh",
      }}
    >
      <img
        src={Logo}
        style={{
          maxWidth: "30vw",
          height: "auto",
        }}
        alt="app logo"
      />
      <Box
        component="blockquote"
        sx={{ marginTop: "15vh", color: "text.primary" }}
      >
        <GlowingTubelightText>
          The obvious objective of video games is to entertain people by
          surprising them with new experiences.
        </GlowingTubelightText>
        <Box
          component="footer"
          sx={{
            fontSize: "3rem",
            color: "inherit",
            marginTop: "2rem",
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
