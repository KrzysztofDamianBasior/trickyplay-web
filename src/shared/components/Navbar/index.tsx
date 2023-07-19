import {
  AppBar,
  Box,
  Button,
  Tab,
  Tabs,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import DrawerComp from "./Drawer";
import ThemeSwitch from "../ThemeSwitch";
import { useNavigate, useLocation } from "react-router-dom";
import pages from "./tabPagesList.json";

const pagesInfo: { to: string; name: string; id: number }[] = pages;

const Navbar = () => {
  const theme = useTheme();
  const isMatch = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const location = useLocation();
  const value = pagesInfo
    .map((e) => e.to)
    .indexOf(location.pathname.toLowerCase());
  return (
    <AppBar
      sx={{
        boxShadow: "0px 0px 55px 0px rgba(134, 102, 12, 1)",
        background: (theme) => theme.palette.background.paper,
      }}
    >
      <Toolbar>
        <Box sx={{ m: 2 }}>
          <ThemeSwitch />
        </Box>
        {isMatch ? (
          <>
            <Typography sx={{ fontSize: "1.5rem", paddingLeft: "10%" }}>
              TrickyPlay
            </Typography>
            <DrawerComp />
          </>
        ) : (
          <>
            <Tabs
              sx={{ marginLeft: "auto" }}
              indicatorColor="secondary"
              textColor="inherit"
              value={value !== -1 ? pagesInfo[value].id : false}
              onChange={(e, value) => {
                navigate(pagesInfo[value].to);
              }}
            >
              {pagesInfo.map((_, pageIndex) => (
                <Tab
                  label={pagesInfo[pageIndex].name}
                  sx={{
                    color: (theme) =>
                      theme.palette.mode === "light" ? "#000000" : "#ffffff",
                  }}
                />
              ))}
            </Tabs>
            {true ? (
              <>
                <Button sx={{ marginLeft: "auto" }} variant="contained">
                  Login
                </Button>
                <Button sx={{ marginLeft: "10px" }} variant="contained">
                  SignUp
                </Button>
              </>
            ) : (
              <>
                <Button sx={{ marginLeft: "auto" }} variant="contained">
                  Account
                </Button>
                <Button sx={{ marginLeft: "10px" }} variant="contained">
                  Logout
                </Button>
              </>
            )}
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
