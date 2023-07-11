import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoutes() {
  const refreshToken = localStorage.getItem('refresh_token')
  let auth = { token: refreshToken};
  return auth.token ? <Outlet /> : <Navigate to="/login"/>;
}

export { ProtectedRoutes }