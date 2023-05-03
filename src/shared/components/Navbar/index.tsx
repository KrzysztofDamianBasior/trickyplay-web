import React, { useState } from "react";
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
import { Link } from "react-router-dom";

const pages: { to: string; name: string; id: number }[] = [
  { id: 0, to: "Home", name: "Home" },
  { id: 1, to: "Games", name: "Games" },
  // { id: 3, to: "About Us" },
];

const Navbar = () => {
  const [value, setValue] = useState<number>(0);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const theme = useTheme();
  const isMatch = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <AppBar
      sx={{
        boxShadow: "0px 0px 55px 0px rgba(134, 102, 12, 1)",
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
              onChange={(e, value) => setValue(value)}
            >
              {pages.map((page, pageIndex) => (
                <Tab label={pages[pageIndex].name} />
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
