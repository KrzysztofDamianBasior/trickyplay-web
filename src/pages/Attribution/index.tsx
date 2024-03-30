import {
  Box,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";

import Navbar from "../../shared/components/Navbar";
import AnimatedPage from "../../shared/components/AnimatedPage";
import Footer from "../../shared/components/Footer";

const Attribution = () => {
  console.log("ok");
  return (
    <AnimatedPage>
      <Navbar />
      <Box
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Paper sx={{ m: 10, p: 4 }} elevation={12}>
          <Typography variant="h3" gutterBottom>
            Attribution
          </Typography>
          <Typography variant="body1">
            On this website I have included works from the following
            websites/created by the following artists:
          </Typography>
          <List>
            <ListItem disablePadding>
              <ListItemText>
                <Box
                  component="a"
                  sx={{
                    color: "secondary.main",
                    textDecoration: "none",
                    "&:hover": { color: "warning.main" },
                    cursor: "pointer",
                  }}
                  href="https://www.svgbackgrounds.com/elements/simple-svg-blob-shapes/"
                >
                  Simple SVG Blob Shapes by SVGBackgrounds.com
                </Box>
              </ListItemText>
            </ListItem>
            <ListItem disablePadding>
              <ListItemText>
                Images by{" "}
                <Box
                  component="a"
                  sx={{
                    color: "secondary.main",
                    textDecoration: "none",
                    "&:hover": { color: "warning.main" },
                    cursor: "pointer",
                  }}
                  href="https://pixabay.com/users/clker-free-vector-images-3736/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=41610"
                >
                  Clker-Free-Vector-Images
                </Box>{" "}
                from{" "}
                <Box
                  component="a"
                  sx={{
                    color: "secondary.main",
                    textDecoration: "none",
                    "&:hover": { color: "warning.main" },
                    cursor: "pointer",
                  }}
                  href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=41610"
                >
                  Pixabay
                </Box>
              </ListItemText>
            </ListItem>
            <ListItem disablePadding>
              <ListItemText>
                Images by{" "}
                <Box
                  component="a"
                  sx={{
                    color: "secondary.main",
                    textDecoration: "none",
                    "&:hover": { color: "warning.main" },
                    cursor: "pointer",
                  }}
                  href="https://pixabay.com/users/piro4d-2707530/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=1949981"
                >
                  PIRO
                </Box>{" "}
                from{" "}
                <Box
                  component="a"
                  sx={{
                    color: "secondary.main",
                    textDecoration: "none",
                    "&:hover": { color: "warning.main" },
                    cursor: "pointer",
                  }}
                  href="https://pixabay.com//?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=1949981"
                >
                  Pixabay
                </Box>
              </ListItemText>
            </ListItem>
            <ListItem disablePadding>
              <ListItemText>
                Images by{" "}
                <Box
                  component="a"
                  sx={{
                    color: "secondary.main",
                    textDecoration: "none",
                    "&:hover": { color: "warning.main" },
                    cursor: "pointer",
                  }}
                  href="https://pixabay.com/users/mike_68-10359383/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=3979601"
                >
                  Michael Kleinsasser
                </Box>{" "}
                from{" "}
                <Box
                  component="a"
                  sx={{
                    color: "secondary.main",
                    textDecoration: "none",
                    "&:hover": { color: "warning.main" },
                    cursor: "pointer",
                  }}
                  href="https://pixabay.com//?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=3979601"
                >
                  Pixabay
                </Box>
              </ListItemText>
            </ListItem>
            <ListItem disablePadding>
              <ListItemText>
                Images by{" "}
                <Box
                  component="a"
                  sx={{
                    color: "secondary.main",
                    textDecoration: "none",
                    "&:hover": { color: "warning.main" },
                    cursor: "pointer",
                  }}
                  href="https://pixabay.com/users/musictobi-1408534/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=2973518"
                >
                  Tobias Kozlowski
                </Box>{" "}
                from{" "}
                <Box
                  component="a"
                  sx={{
                    color: "secondary.main",
                    textDecoration: "none",
                    "&:hover": { color: "warning.main" },
                    cursor: "pointer",
                  }}
                  href="https://pixabay.com//?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=2973518"
                >
                  Pixabay
                </Box>
              </ListItemText>
            </ListItem>
            <ListItem disablePadding>
              <ListItemText>
                Images by{" "}
                <Box
                  component="a"
                  sx={{
                    color: "secondary.main",
                    textDecoration: "none",
                    "&:hover": { color: "warning.main" },
                    cursor: "pointer",
                  }}
                  href="https://pixabay.com/users/pixloger-783453/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=2644596"
                >
                  PixLoger
                </Box>{" "}
                from{" "}
                <Box
                  component="a"
                  sx={{
                    color: "secondary.main",
                    textDecoration: "none",
                    "&:hover": { color: "warning.main" },
                    cursor: "pointer",
                  }}
                  href="https://pixabay.com//?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=2644596"
                >
                  Pixabay
                </Box>
              </ListItemText>
            </ListItem>
            <ListItem disablePadding>
              <ListItemText>
                Images by{" "}
                <Box
                  component="a"
                  sx={{
                    color: "secondary.main",
                    textDecoration: "none",
                    "&:hover": { color: "warning.main" },
                    cursor: "pointer",
                  }}
                  href="https://pixabay.com/users/gdj-1086657/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=1817584"
                >
                  Gordon Johnson
                </Box>{" "}
                from{" "}
                <Box
                  component="a"
                  sx={{
                    color: "secondary.main",
                    textDecoration: "none",
                    "&:hover": { color: "warning.main" },
                    cursor: "pointer",
                  }}
                  href="https://pixabay.com//?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=1817584"
                >
                  Pixabay
                </Box>
              </ListItemText>
            </ListItem>{" "}
            <ListItem disablePadding>
              <ListItemText>
                Images by{" "}
                <Box
                  component="a"
                  sx={{
                    color: "secondary.main",
                    textDecoration: "none",
                    "&:hover": { color: "warning.main" },
                    cursor: "pointer",
                  }}
                  href="https://pixabay.com/users/graphicmama-team-2641041/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=1773850"
                >
                  GraphicMama-team
                </Box>{" "}
                from{" "}
                <Box
                  component="a"
                  sx={{
                    color: "secondary.main",
                    textDecoration: "none",
                    "&:hover": { color: "warning.main" },
                    cursor: "pointer",
                  }}
                  href="https://pixabay.com//?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=1773850"
                >
                  Pixabay
                </Box>
              </ListItemText>
            </ListItem>
          </List>
        </Paper>
      </Box>
      <Footer />
    </AnimatedPage>
  );
};

export default Attribution;

// <a href="https://www.svgbackgrounds.com/elements/simple-svg-blob-shapes/">Simple SVG Blob Shapes by SVGBackgrounds.com</a>
