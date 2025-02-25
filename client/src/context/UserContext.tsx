import { createContext, useState, useEffect, ReactNode } from "react";
import { getToken, setToken, removeToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";

interface UserContextType {
  user: { _id: string; name: string; email: string } | null;
  updateUser: (newUser: any) => void;
  logout: () => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserContextType["user"]>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for token in URL after Google OAuth login
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get("token");

    if (tokenFromUrl) {
      setToken(tokenFromUrl); // Store in localStorage
      window.history.replaceState({}, document.title, "/"); // Remove token from URL
    }

    // Get token from localStorage
    const token = getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser({ _id: payload.userId, name: payload.name, email: payload.email });
    }
  }, []);

  const updateUser = (newUser: any) => {
    setUser(newUser);
  };

  const logout = () => {
    removeToken();
    setUser(null);
    navigate("/login");
  };

  return (
    <UserContext.Provider value={{ user, updateUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};
