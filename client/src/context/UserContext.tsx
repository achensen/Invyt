import { createContext, useState, useEffect, ReactNode } from "react";
import { getUserFromToken } from "../utils/auth";

// Define context type
interface UserContextType {
  user: { _id: string; name: string; email: string } | null;
  updateUser: () => void;
}

// Create context
export const UserContext = createContext<UserContextType | undefined>(undefined);

// Context provider component
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState(getUserFromToken());

  // Update user when token changes
  const updateUser = () => {
    setUser(getUserFromToken());
  };

  useEffect(() => {
    updateUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};
