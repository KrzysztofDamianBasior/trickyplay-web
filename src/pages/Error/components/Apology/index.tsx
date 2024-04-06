import { Box, Typography } from "@mui/material";

import Error from "../../../../shared/assets/other/error.png";
import AnimatedPage from "../../../../shared/components/AnimatedPage";
import Navbar from "../../../../shared/components/Navbar";
import Footer from "../../../../shared/components/Footer";

const Apology = () => {
  return (
    <AnimatedPage>
      <Navbar />
      <Box
        sx={{
          width: "100%",
          height: "100%",

          marginTop: { sm: "10vh", md: "0vh" },
          marginBottom: { sm: "10vh", md: "0vh" },

          display: "flex",
          flexDirection: { xs: "column-reverse", md: "row" },
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img
          src={Error}
          style={{
            maxWidth: "40vmin",
            height: "auto",
          }}
          alt="app logo"
        />
        <Box
          sx={{
            backgroundImage: (theme) =>
              theme.palette.mode === "light"
                ? `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2000 2000" fill="%23000000"><path d="M994 112c-703-2-920.47 400.35-904 905 13.35 409 32.03 946.66 977 861 684-62 792-279 835-777 61.67-714.25-288.33-987.24-908-989Z"></path></svg>')`
                : "",
            backgroundRepeat: "no-repeat",
            backgroundSize: "80%",
            backgroundPosition: "center",

            padding: { xs: "80px", sm: "130px" },
          }}
        >
          <Typography
            variant="h3"
            gutterBottom
            sx={{ color: "warning.main" }}
            align="center"
          >
            Oops!
          </Typography>
          <Typography
            variant="body1"
            gutterBottom
            sx={{ color: "warning.main" }}
            align="center"
          >
            I'm very sorry,
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "warning.main" }}
            align="center"
          >
            unfortunately something is broken on the website :(
          </Typography>
          <Typography
            variant="body1"
            gutterBottom
            sx={{ color: "warning.main" }}
            align="center"
          >
            I will try to fix it as soon as possible
          </Typography>
        </Box>
      </Box>
      <Footer />
    </AnimatedPage>
  );
};

export default Apology;
