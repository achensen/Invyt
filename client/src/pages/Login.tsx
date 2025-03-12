import { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { loginUser } from "../utils/api";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const userContext = useContext(UserContext);

  if (!userContext) return null;
  const { user } = userContext;

  if (user) {
    return <p>You are already logged in.</p>;
  }

  const handleLogin = async () => {
    try {
      setLoading(true);
      await loginUser();
    } catch (error) {
      console.error("Login failed:", error);
      alert("Failed to log in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5 text-center" style={{ backgroundColor: "rgba(107, 129, 255, 0.6) ",  padding: "10px", borderRadius: "5px", color: "#ffffff",display: "inline-block" }}>
      <h1>Login to Invyt</h1>
      <p className="lead">Sign in with your Google account to continue.</p>

      <button
        className="btn btn-danger btn-lg mt-3"
        onClick={handleLogin}
        disabled={loading}
      >
        {loading ? "Logging in..." : "Sign in with Google"}
      </button>
    </div>
  );
};

export default Login;
