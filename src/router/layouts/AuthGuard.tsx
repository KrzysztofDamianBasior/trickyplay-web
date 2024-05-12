import { useContext } from "react";

import { useLocation, Navigate, Outlet } from "react-router-dom";

import { AccountContext } from "../../shared/services/account/AccountContext";

type Props = {
  allowedRoles: string[];
};

const AuthGuard = ({ allowedRoles }: Props) => {
  const auth = useContext(AccountContext);
  const location = useLocation();

  // replace a current page in the browser history
  return auth.authState.user?.role &&
    allowedRoles.includes(auth.authState.user.role) ? (
    <Outlet />
  ) : (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  );
};

export default AuthGuard;
