import { useEffect, useContext } from "react";
import { UserContext } from "../context/UserContext";

const Signup = () => {
  const userContext = useContext(UserContext);

  useEffect(() => {
    // Check if a token was provided in the URL after Google OAuth redirect
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      window.location.href = "/"; // Redirect to Home
    }
  }, []);

  if (!userContext) return null;

  return (
    <div className="container mt-4">
      <h1>Sign Up / Login</h1>
      <p>Sign in with Google to create an account.</p>
      <a href="http://localhost:3001/auth/google" className="btn btn-danger">
        Sign in with Google
      </a>
    </div>
  );
};

export default Signup;
