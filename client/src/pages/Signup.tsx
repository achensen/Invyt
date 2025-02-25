import { useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const userContext = useContext(UserContext);
  const navigate = useNavigate();

  if (!userContext) return null;

  const { user } = userContext;

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="container mt-4 text-center">
      <h1>Sign Up</h1>
      <p>You must sign in with Google to use Invyt.</p>

      {/* Google Sign-In Button */}
      <a href="http://localhost:3001/auth/google" className="btn btn-danger">
        Sign in with Google
      </a>
    </div>
  );
};

export default Signup;
