import { jwtDecode, JwtPayload } from "jwt-decode";

// Define a type for the decoded JWT
interface DecodedUser extends JwtPayload {
  _id: string;
  name: string;
  email: string;
}

// Store token in local storage
export const setToken = (token: string) => {
  localStorage.setItem("id_token", token);
};

// Retrieve token from local storage
export const getToken = () => {
  return localStorage.getItem("id_token");
};

// Remove token (logout function)
export const removeToken = () => {
  localStorage.removeItem("id_token");
};

// Decode token and get user data
export const getUserFromToken = (): DecodedUser | null => {
  const token = getToken();
  if (!token) return null;
  try {
    return jwtDecode<DecodedUser>(token);
  } catch (error) {
    return null;
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getToken();
};
