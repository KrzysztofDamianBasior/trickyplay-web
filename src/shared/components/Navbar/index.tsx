import { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Tab,
  Tabs,
  Box,
  Button,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import pages from "./tabPagesList.json";
import DrawerComp from "./Drawer";
import ThemeSwitch from "../ThemeSwitch";
import { AccountContext } from "../../services/account/AccountContext";

const pagesInfo: { to: string; name: string; id: number }[] = pages;

const Navbar = () => {
  const theme = useTheme();
  const isMatch = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const location = useLocation();
  const { authState, singleSessionSignOut } = useContext(AccountContext);

  const currentPage = pagesInfo
    .map((e) => e.to)
    .indexOf(location.pathname.toLowerCase());

  return (
    <AppBar
      position="static"
      sx={{
        boxShadow: "0px 0px 55px 0px rgba(134, 102, 12, 1)",
        background: (theme) => theme.palette.background.paper,
      }}
    >
      <Toolbar>
        <Box sx={{ m: 1 }}>
          <ThemeSwitch />
        </Box>
        {isMatch ? (
          <>
            <Typography sx={{ fontSize: "1.5rem", m: 1 }}>
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
              value={currentPage !== -1 ? pagesInfo[currentPage].id : false}
              onChange={(e, value) => {
                navigate(pagesInfo[value].to);
              }}
              aria-label="tabs menu"
            >
              {pagesInfo.map((_, pageIndex) => (
                <Tab
                  key={pagesInfo[pageIndex].name}
                  label={pagesInfo[pageIndex].name}
                  sx={{
                    transition: "0.3s",
                    color: (theme) =>
                      theme.palette.mode === "light" ? "#000000" : "#ffffff",
                    "&:hover": {
                      backgroundColor: theme.palette.secondary.main,
                    },
                  }}
                  {...a11yProps(pageIndex)}
                />
              ))}
            </Tabs>
            {authState.status === "LOGGED_OUT" ? (
              <>
                <Button
                  sx={{ marginLeft: "auto" }}
                  variant="contained"
                  onClick={() => navigate("/auth")}
                >
                  Login
                </Button>
                <Button
                  sx={{ marginLeft: "10px" }}
                  variant="contained"
                  onClick={() => navigate("/auth")}
                >
                  SignUp
                </Button>
              </>
            ) : (
              <>
                <Button
                  sx={{ marginLeft: "auto" }}
                  variant="contained"
                  onClick={() => navigate("/account")}
                >
                  Account
                </Button>
                <Button
                  sx={{ marginLeft: "10px" }}
                  variant="contained"
                  onClick={() => singleSessionSignOut()}
                >
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

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
