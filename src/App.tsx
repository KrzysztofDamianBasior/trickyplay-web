import React, { Suspense, lazy } from "react";

import { Routes, Route, useLocation } from "react-router-dom";
import ErrorPage from "./pages/Error";
import Loading from "./pages/Loading";
import Home from "./pages/Home";
import Games from "./pages/Games";

import { useAppSelector } from "./shared/hooks";
import { RootState } from "./redux/store";

import { ThemeProvider as MUIThemeProvider, createTheme } from "@mui/material";
import { ThemeProvider as SCThemeProvider } from "styled-components";
import { darkTheme, lightTheme } from "./styles/themes";
import CssBaseline from "@mui/material/CssBaseline";

import { AnimatePresence } from "framer-motion";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

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
  const theme = useAppSelector((state: RootState) => state.appTheme.theme);

  const themeOptions = createTheme({
    palette: {
      mode: theme === "light" ? "light" : "dark",
      primary: {
        main: "#21ebff",
      },
      secondary: {
        main: "#d400d4",
      },
      background: {
        default: theme === "light" ? "#fff" : "#000",
        paper: theme === "light" ? "#fff" : "#000",
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: `
        *{
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
      
        body {
          width: 100%;
          height: 100vh;
        }
      
        .app{
          width: 100%;
          height: 100%;
        }


        /************** styles required by swiper **************/
        .swiper {
          width: 100%;
          height: 100%;
        }

        .swiper-slide {
          text-align: center;
          font-size: 18px;
          background: #fff;

          /* Center slide text vertically */
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .swiper-slide img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        /**************                           **************/

        body::-webkit-scrollbar-track
        {
          -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.9);
          background-color: #F5F5F5;
          border-radius: 10px;
        }
      
        body::-webkit-scrollbar
        {
          width: 15px;
          background-color: ${theme === "dark" ? "#000" : "#fff"};
        }
      
        body::-webkit-scrollbar-thumb
        {
          border-radius: 10px;
          background-image: ${
            theme === "dark"
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
        <SCThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
          <CssBaseline />
          <AnimatePresence mode="wait">
            <Routes key={location.pathname} location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/games" element={<Games />} />
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
              <Route path="*" element={<ErrorPage />} />
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
