import { lazy, Suspense } from "react";

import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import Home from "../../pages/Home";
import Games from "../../pages/Games";
import Auth from "../../pages/Auth";
import Attribution from "../../pages/Attribution";
import Profile from "../../pages/Profile";
import Unauthorized from "../../pages/Unauthorized";
import Loading from "../../pages/Loading";
import NoMatch from "../../pages/NoMatch";

import StandardLayout from "../layouts/StandardLayout";
import AuthGuard from "../layouts/AuthGuard";

//lazy loading
const TicTacToe = lazy(async () => {
  return Promise.all([
    import("../../pages/TicTacToe"),
    new Promise((resolve) => setTimeout(resolve, 6000)),
  ]).then(([moduleExports]) => moduleExports);
});

const Snake = lazy(async () => {
  return Promise.all([
    import("../../pages/Snake"),
    new Promise((resolve) => setTimeout(resolve, 6000)),
  ]).then(([moduleExports]) => moduleExports);
});

const Minesweeper = lazy(async () => {
  return Promise.all([
    import("../../pages/Minesweeper"),
    new Promise((resolve) => setTimeout(resolve, 6000)),
  ]).then(([moduleExports]) => moduleExports);
});

const CoreRoutes = () => {
  const location = useLocation();
  return (
    <Routes key={location.pathname} location={location}>
      <Route element={<StandardLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Navigate to="/" />} />
        <Route path="/games" element={<Games />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/attribution" element={<Attribution />} />
        <Route
          element={<AuthGuard allowedRoles={["USER", "ADMIN", "BANNED"]} />}
        >
          <Route path="/account" element={<Profile />} />
        </Route>
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
      </Route>
    </Routes>
  );
};

export default CoreRoutes;
