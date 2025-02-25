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
    console.log("🔄 Updating User Context...");
    setUser(getUserFromToken());
  };

  useEffect(() => {
    updateUser();

    // Listen for token changes in localStorage
    const handleStorageChange = () => {
      console.log("📢 Token Changed! Refreshing User...");
      updateUser();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};
