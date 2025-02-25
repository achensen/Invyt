import { jwtDecode, JwtPayload } from "jwt-decode";

// Define a type for the decoded JWT
interface DecodedUser extends JwtPayload {
  _id: string;
  name: string; // Ensure name exists
  email: string;
}

// Store token in local storage
export const setToken = (token: string) => {
  console.log("🔐 Storing Token:", token);
  localStorage.setItem("id_token", token);
};

// Retrieve token from local storage
export const getToken = () => {
  return localStorage.getItem("id_token");
};

// Remove token (logout function)
export const removeToken = () => {
  console.log("🚪 Removing Token");
  localStorage.removeItem("id_token");
};

// Decode token and get user data
export const getUserFromToken = (): DecodedUser | null => {
  const token = getToken();
  if (!token) return null;
  try {
    const decoded = jwtDecode<DecodedUser>(token);
    console.log("👤 Decoded User from Token:", decoded); // ✅ Debugging
    return decoded;
  } catch (error) {
    console.error("❌ Error Decoding Token:", error);
    return null;
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getToken();
};