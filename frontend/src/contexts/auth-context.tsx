import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import type { User } from "../models/user.model";

interface AuthContextProps {
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

function getInitialUser(): User | null {
  const token = localStorage.getItem("token");
  if (!token) return null;

  const decoded = jwtDecode<User & { exp: number }>(token);
  const isExpired = decoded.exp * 1000 < Date.now();

  if (isExpired) {
    localStorage.removeItem("token");
    return null;
  }

  return decoded;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(getInitialUser);

  function login(token: string) {
    localStorage.setItem("token", token);
    const decoded = jwtDecode<User>(token);
    setUser(decoded);
    navigate("/dashboard");
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, login, logout, isLoading: false }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}
