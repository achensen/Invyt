import { createContext, useState, useEffect, ReactNode } from "react";
import { getUserFromToken } from "../utils/auth"; // ✅ Removed getToken

// Define context type
interface UserContextType {
  user: { _id: string; name: string; email: string } | null;
  updateUser: (newUser: { _id: string; name: string; email: string } | null) => void;
}

// Create context
export const UserContext = createContext<UserContextType | undefined>(undefined);

// Context provider component
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState(getUserFromToken());

  // Update user state directly instead of decoding JWT every time
  const updateUser = (newUser: { _id: string; name: string; email: string } | null) => {
    console.log("🔄 Updating User Context:", newUser);
    setUser(newUser);
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
