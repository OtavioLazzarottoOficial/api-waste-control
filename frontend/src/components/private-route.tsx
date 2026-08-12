import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/auth-context";

export function PrivateRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  // Aguarda o contexto verificar o token
  if (isLoading) return null; // ou um spinner

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}