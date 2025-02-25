import { createContext, useState, useEffect, ReactNode } from "react";
import { getUserFromToken } from "../utils/auth";

// Define context type
interface UserContextType {
  user: { _id: string; name: string; email: string } | null;
  updateUser: (newUser: { _id: string; name: string; email: string } | null) => void;
}

// Create context
export const UserContext = createContext<UserContextType | undefined>(undefined);

// Context provider component
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const storedUser = localStorage.getItem("user_data");
  const [user, setUser] = useState(storedUser ? JSON.parse(storedUser) : getUserFromToken());

  // Update user state and store in LocalStorage
  const updateUser = (newUser: { _id: string; name: string; email: string } | null) => {
    console.log("🔄 Updating User Context:", newUser);
    setUser(newUser);
    if (newUser) {
      localStorage.setItem("user_data", JSON.stringify(newUser));
    } else {
      localStorage.removeItem("user_data");
    }
  };

  useEffect(() => {
    updateUser(getUserFromToken()); // ✅ Only decode JWT on first load

    // Listen for token changes in localStorage
    const handleStorageChange = () => {
      console.log("📢 Token Changed! Refreshing User...");
      updateUser(getUserFromToken());
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