import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "./auth";

const RedirectIfLoggedIn = () => {
  return isAuthenticated() ? <Navigate to="/" replace /> : <Outlet />;
};

export default RedirectIfLoggedIn;