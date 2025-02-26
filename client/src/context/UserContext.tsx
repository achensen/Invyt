import { createContext, useState, useEffect, ReactNode } from "react";
import { getToken, removeToken, setToken } from "../utils/auth";
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
    // Check if a token is in the URL (after Google login)
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      setToken(token);
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser({ _id: payload.userId, name: payload.name, email: payload.email });
      navigate("/");
    } else {
      // Load user from local storage
      const savedToken = getToken();
      if (savedToken) {
        const payload = JSON.parse(atob(savedToken.split(".")[1]));
        setUser({ _id: payload.userId, name: payload.name, email: payload.email });
      }
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
