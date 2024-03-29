import { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

import pages from "./tabPagesList.json";
import { AccountContext } from "../../services/account/AccountContext";

const pagesInfo: { to: string; name: string; id: number }[] = pages;

const DrawerComp = () => {
  const navigate = useNavigate();
  const { authState, singleSessionSignOut } = useContext(AccountContext);
  const [openDrawer, setOpenDrawer] = useState(false);
  const location = useLocation();
  const currentPage = pagesInfo
    .map((e) => e.to)
    .indexOf(location.pathname.toLowerCase());

  return (
    <>
      <Drawer
        anchor="left"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            flexDirection: "column",

            height: "100%",
            width: "100%",
          }}
        >
          <List>
            {pagesInfo.map((page) => (
              <ListItemButton key={page.id} onClick={() => navigate(page.to)}>
                <ListItemIcon>
                  <ListItemText
                    sx={{
                      textDecoration:
                        currentPage !== -1 &&
                        pagesInfo[currentPage].id === page.id
                          ? "underline"
                          : "none",
                    }}
                  >
                    {page.name}
                  </ListItemText>
                </ListItemIcon>
              </ListItemButton>
            ))}
          </List>

          {authState.status === "LOGGED_OUT" ? (
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <Button
                sx={{ m: 1 }}
                variant="contained"
                onClick={() => navigate("./auth")}
              >
                Login
              </Button>
              <Button
                sx={{ m: 1 }}
                variant="contained"
                onClick={() => navigate("./auth")}
              >
                SignUp
              </Button>
            </Box>
          ) : (
            <>
              <Button
                sx={{ marginLeft: "auto" }}
                variant="contained"
                onClick={() => navigate("./account")}
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
        </Box>
      </Drawer>
      <IconButton
        sx={{
          color: (theme) => {
            return theme.palette.mode === "light" ? "#000000" : "#ffffff";
          },
          marginLeft: "auto",
        }}
        onClick={() => setOpenDrawer(!openDrawer)}
      >
        <MenuIcon />
      </IconButton>
    </>
  );
};

export default DrawerComp;
