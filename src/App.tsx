import { Suspense, lazy } from "react";

import { Routes, Route, useLocation, Navigate } from "react-router-dom";

import ErrorBoundary from "./pages/Error";
import Attribution from "./pages/Attribution";
import NoMatch from "./pages/NoMatch";
import Loading from "./pages/Loading";
import Home from "./pages/Home";
import Games from "./pages/Games";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Unauthorized from "./pages/Unauthorized";

import DeleteAccountDialog from "./shared/components/DeleteAccountDialog";
import DeleteEntitiesDialog from "./shared/components/DeleteEntitiesDialog/DeleteEntitiesDialog";
import ChangePasswordDialog from "./shared/components/ChangePasswordDialog";
import ChangeUsernameDialog from "./shared/components/ChangeUsernameDialog";

import { useDarkMode } from "usehooks-ts";

import { ThemeProvider as MUIThemeProvider, createTheme } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";

import { AnimatePresence } from "framer-motion";

import "@fontsource/open-sans/300.css";
import "@fontsource/open-sans/400.css";
import "@fontsource/open-sans/500.css";
import "@fontsource/open-sans/700.css";

import useAccount from "./shared/services/account/useAccount";
import { AccountContext } from "./shared/services/account/AccountContext";
import useNotifications from "./shared/services/snackbars/useNotifications";
import { NotificationContext } from "./shared/services/snackbars/NotificationsContext";
import ConsecutiveNotifications from "./shared/services/snackbars/ConsecutiveNotifications";
import useDialogs from "./shared/services/dialogs/useDialogs";
import { DialogsContext } from "./shared/services/dialogs/DialogsContext";
import { ThemeContext } from "./shared/services/theme/ThemeContext";

//lazy loading
const TicTacToe = lazy(async () => {
  return Promise.all([
    import("./pages/TicTacToe"),
    new Promise((resolve) => setTimeout(resolve, 6000)),
  ]).then(([moduleExports]) => moduleExports);
});

const Snake = lazy(async () => {
  return Promise.all([
    import("./pages/Snake"),
    new Promise((resolve) => setTimeout(resolve, 6000)),
  ]).then(([moduleExports]) => moduleExports);
});

const Minesweeper = lazy(async () => {
  return Promise.all([
    import("./pages/Minesweeper"),
    new Promise((resolve) => setTimeout(resolve, 6000)),
  ]).then(([moduleExports]) => moduleExports);
});

function App() {
  const location = useLocation();
  const { isDarkMode, disable, enable, set, toggle } = useDarkMode();
  const {
    closeSnackbar,
    handleSnackbarExited,
    isSnackbarOpened,
    messageInfo,
    openSnackbar,
  } = useNotifications();
  const {
    authState,
    axiosPrivate,
    axiosPublic,
    signIn,
    signUp,
    updateUsername,
    updatePassword,
    singleSessionSignOut,
    allSessionsSignOut,
    deleteAccount,
    accountActivitySummary,
  } = useAccount({ openSnackbar });
  const {
    deleteEntitiesConfirmationDialogManager,
    changePasswordDialogManager,
    changeUsernameDialogManager,
    deleteAccountConfirmationDialogManager,
  } = useDialogs();

  const themeOptions = createTheme({
    palette: {
      mode: isDarkMode ? "dark" : "light",
      primary: {
        main: "#21ebff",
      },
      secondary: {
        main: "#d400d4",
      },
      background: {
        default: isDarkMode ? "#000" : "#fff",
        paper: isDarkMode ? "#000" : "#fff",
      },
    },
    typography: {
      fontFamily: ["open-sans"].join(","),
      // button: {
      //   fontWeight: 500,
      // },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: `
        /************** reset **************/        
        *{
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          // font-family: "open-sans";
        }
      
        body,
        html,
        div#root,
        div.app {
          width: 100%;
          height: 100%;
        }

        /************** scrollbar **************/
        body::-webkit-scrollbar-track
        {
          -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.9);
          background-color: #F5F5F5;
          border-radius: 10px;
        }
      
        body::-webkit-scrollbar
        {
          width: 15px;
          background-color: ${isDarkMode ? "#000" : "#fff"};
        }
      
        body::-webkit-scrollbar-thumb
        {
          border-radius: 10px;
          background-image: ${
            isDarkMode
              ? `linear-gradient(to top, #4D9C41, #19911D,#54DE5D)`
              : `linear-gradient(to top,rgb(122,153,217), rgb(73,125,189),rgb(28,58,148));            
          `
          }
        `,
      },
    },
  });

  return (
    <div className="app">
      <ThemeContext.Provider
        value={{ disable, enable, isDarkMode, set, toggle }}
      >
        <NotificationContext.Provider value={{ closeSnackbar, openSnackbar }}>
          <DialogsContext.Provider
            value={{
              deleteEntitiesConfirmationDialogManager,
              changePasswordDialogManager,
              changeUsernameDialogManager,
              deleteAccountConfirmationDialogManager,
            }}
          >
            <AccountContext.Provider
              value={{
                authState,
                axiosPrivate,
                axiosPublic,
                signIn,
                signUp,
                allSessionsSignOut,
                singleSessionSignOut,
                accountActivitySummary,
                deleteAccount,
                updatePassword,
                updateUsername,
              }}
            >
              <MUIThemeProvider theme={themeOptions}>
                <CssBaseline />
                <AnimatePresence>
                  <ErrorBoundary>
                    <Routes key={location.pathname} location={location}>
                      <Route path="/" element={<Home />} />
                      <Route path="/home" element={<Navigate to="/" />} />
                      <Route path="/games" element={<Games />} />
                      <Route path="/auth" element={<Auth />} />
                      <Route path="/attribution" element={<Attribution />} />
                      <Route path="/account" element={<Profile />} />
                      <Route path="/unauthorized" element={<Unauthorized />} />
                      <Route
                        path="/games/tic-tac-toe"
                        element={
                          <Suspense fallback={<Loading />}>
                            <TicTacToe />
                          </Suspense>
                        }
                      />
                      <Route
                        path="/games/snake"
                        element={
                          <Suspense fallback={<Loading />}>
                            <Snake />
                          </Suspense>
                        }
                      />
                      <Route
                        path="/games/minesweeper"
                        element={
                          <Suspense fallback={<Loading />}>
                            <Minesweeper />
                          </Suspense>
                        }
                      />
                      <Route path="*" element={<NoMatch />} />
                    </Routes>
                    <ConsecutiveNotifications
                      handleClose={closeSnackbar}
                      handleExited={handleSnackbarExited}
                      isOpened={isSnackbarOpened}
                      messageInfo={messageInfo}
                    />
                    <DeleteEntitiesDialog />
                    <DeleteAccountDialog />
                    <ChangePasswordDialog />
                    <ChangeUsernameDialog />
                  </ErrorBoundary>
                </AnimatePresence>
              </MUIThemeProvider>
            </AccountContext.Provider>
          </DialogsContext.Provider>
        </NotificationContext.Provider>
      </ThemeContext.Provider>
    </div>
  );
}

export default App;
