import React, { Suspense, lazy } from "react";

import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import ErrorBoundary from "./pages/Error";
import NoMatch from "./pages/NoMatch";
import Loading from "./pages/Loading";
import Home from "./pages/Home";
import Games from "./pages/Games";

import { useDarkMode } from "usehooks-ts";

import { ThemeProvider as MUIThemeProvider, createTheme } from "@mui/material";
import { ThemeProvider as SCThemeProvider } from "styled-components";
import { darkTheme, lightTheme } from "./styles/themes";
import CssBaseline from "@mui/material/CssBaseline";

import { AnimatePresence } from "framer-motion";

import "@fontsource/open-sans/300.css";
import "@fontsource/open-sans/400.css";
import "@fontsource/open-sans/500.css";
import "@fontsource/open-sans/700.css";

//lazy loading
const TicTacToe = lazy(() => {
  return Promise.all([
    import("./pages/TicTacToe"),
    new Promise((resolve) => setTimeout(resolve, 6000)),
  ]).then(([moduleExports]) => moduleExports);
});

const Snake = lazy(() => {
  return Promise.all([
    import("./pages/Snake"),
    new Promise((resolve) => setTimeout(resolve, 6000)),
  ]).then(([moduleExports]) => moduleExports);
});

const Minesweeper = lazy(() => {
  return Promise.all([
    import("./pages/Minesweeper"),
    new Promise((resolve) => setTimeout(resolve, 6000)),
  ]).then(([moduleExports]) => moduleExports);
});

function App() {
  const location = useLocation();
  const { isDarkMode, toggle, enable, disable } = useDarkMode();
  // const theme = useAppSelector((state: RootState) => state.appTheme.theme);

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
      button: {
        fontWeight: 500,
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: `
        *{
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          // font-family: "open-sans";
        }
        
        body {
          width: 100%;
          height: 100vh;
        }
        
        .app{
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
      <MUIThemeProvider theme={themeOptions}>
        <SCThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
          <CssBaseline />
          <AnimatePresence mode="wait">
            <Routes key={location.pathname} location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Navigate to="/" />} />
              <Route path="/Home" element={<Navigate to="/" />} />
              <Route path="/games" element={<Games />} />
              <Route path="/Games" element={<Navigate to="/games" />} />
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
              {/* <Route path="*" element={<ErrorPage />} /> */}
              <Route path="*" element={<NoMatch />} />
            </Routes>
          </AnimatePresence>
        </SCThemeProvider>
      </MUIThemeProvider>
    </div>
  );
}

export default App;

///////////////////////////////////////////////////////////////////////

// const Button = styled("button")<{ backgroundColor: string; primary: string }>`
//   width: 200px;
//   height: 50px;
//   background-color: ${(props) => props.backgroundColor};
//   color: ${(props) => (props.primary ? "hotpink" : "turquoise")};
//   &:hover {
//     & label {
//       color: green;
//     }
//   }
//   & > strong {
//     color: hotpink;
//   }
// `;

// <AnimatePresence
// initial={false}  -disable any initial animations on children that are present when the component is first rendered
// exitBeforeEnter={true}  -only render one component at a time. The exiting component will finish its exit animation before entering component is rendered
// onExitComplete={()=>null}  -fires when all exiting nodes have copmleted animating out
//>
// {modalOpen && <Modal modalOpen={modalOpen} handleClose={close}/>}
// </AnimatePresence>

//{
// <motion.div
//     animate={{x: move ? 200 : -200, rotate: rotate ? 360 : 0}}
//     transition={{type: "tween", duration: 0.1}}
//     onClick={()=>setMove(!move)}
// >
// </motion.div>
// }

// <motion.button
// whileHover={{ scale: 1.1 }}
// whileTap={{ scale: 0.9 }}
// className="confirmaton-button"
// onClick={() => null}
// >
// {text}
// </motion.button>
