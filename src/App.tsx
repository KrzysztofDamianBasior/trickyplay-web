import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import ErrorPage from "./pages/ErrorPage";

import { useAppSelector } from "./hooks";
import { RootState } from "./redux/store";

import { ThemeProvider } from "styled-components";
import { darkTheme, lightTheme } from "./styles/themes";
import GlobalStyles from "./styles/GlobalStyles";

function App() {
  const location = useLocation();
  const theme = useAppSelector((state: RootState) => state.appTheme.theme);

  return (
    <div className="App">
      <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
        <GlobalStyles />
        <Routes key={location.pathname} location={location}>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </ThemeProvider>
    </div>
  );
}

export default App;
