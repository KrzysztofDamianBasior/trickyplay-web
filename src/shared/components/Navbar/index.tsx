import { useState } from "react";
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

const pages: { to: string; name: string; id: number }[] = [
  { id: 0, to: "/", name: "Home" },
  { id: 1, to: "/games", name: "Games" },
  // { id: 3, to: "About Us" },
];

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const theme = useTheme();
  const isMatch = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const location = useLocation();
  const value = pages.map((e) => e.to).indexOf(location.pathname.toLowerCase());
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
              value={pages[value].id}
              onChange={(e, value) => {
                navigate(pages[value].to);
              }}
            >
              {pages.map((page, pageIndex) => (
                <Tab
                  label={pages[pageIndex].name}
                  sx={{
                    color: (theme) =>
                      theme.palette.mode === "light" ? "#000000" : "#ffffff",
                  }}
                />
              ))}
            </Tabs>
            {isLoggedIn ? (
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
