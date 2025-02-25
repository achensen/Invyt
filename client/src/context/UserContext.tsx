import { createContext, useState, useEffect, ReactNode } from "react";
import { getToken, removeToken } from "../utils/auth";

interface UserContextType {
  user: { _id: string; name: string; email: string } | null;
  updateUser: (newUser: any) => void;
  logout: () => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserContextType["user"]>(null);

  useEffect(() => {
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
    window.location.href = "/login";
  };

  return (
    <UserContext.Provider value={{ user, updateUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};