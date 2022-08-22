import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import ErrorPage from "./pages/ErrorPage";

function App() {
  const location = useLocation();
  return (
    <div className="App">
      <Routes key={location.pathname} location={location}>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </div>
  );
}

export default App;
