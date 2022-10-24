import React, { Suspense, lazy } from "react";

import { Routes, Route, useLocation } from "react-router-dom";
import ErrorPage from "./pages/Error";
import Loading from "./pages/Loading";
import Home from "./pages/Home";
import Games from "./pages/Games";

import { useAppSelector } from "./shared/hooks";
import { RootState } from "./redux/store";

import { ThemeProvider } from "styled-components";
import { darkTheme, lightTheme } from "./styles/themes";
import GlobalStyles from "./styles/GlobalStyles";

import { AnimatePresence } from "framer-motion";

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

  return (
    <div className="app">
      <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
        <GlobalStyles />
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
      </ThemeProvider>
    </div>
  );
}

export default App;
