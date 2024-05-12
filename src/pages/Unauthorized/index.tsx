import { useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";

import Error from "../../shared/assets/other/error.png";
import AnimatedPage from "../../shared/components/AnimatedPage";
import Navbar from "../../shared/components/Navbar";
import Footer from "../../shared/components/Footer";

const Unauthorized = () => {
  const navigate = useNavigate();

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
                ? `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2000 2000" fill="%23000000"><path d="M1891 560c0-277-224-509-501-499-372 13-397 281-504 302s-215-179-511-75a459 459 0 0 0-222 218C10 809 262 886 259 992s-201 171-82 395c34 64 99 127 212 141 56 6 103 47 115 102a377 377 0 0 0 383 310c222 2 528-202 380-536-42-97 30-123 73-194s-11-120 128-156c233-61 423-246 423-494Z"></path></svg>')`
                : "",
            backgroundRepeat: "no-repeat",
            backgroundSize: "80%",
            backgroundPosition: "center",

            padding: { xs: "70px", sm: "120px", md: "140px", lg: "160px" },
          }}
        >
          <Typography variant="h2" gutterBottom sx={{ color: "warning.main" }}>
            Unauthorized
          </Typography>
          <Typography variant="h4" gutterBottom sx={{ color: "warning.main" }}>
            You do not have access to the requested page.
          </Typography>
          <Box sx={{ display: "flex" }}>
            <Button
              variant="contained"
              color="warning"
              onClick={() => navigate("/")}
              sx={{ m: 3 }}
            >
              Visit the home page
            </Button>
            <Button
              variant="contained"
              color="warning"
              onClick={() => navigate("/auth")}
              sx={{ m: 3 }}
            >
              Sign in
            </Button>
          </Box>
        </Box>
      </Box>
      <Footer />
    </AnimatedPage>
  );
};

export default Unauthorized;
