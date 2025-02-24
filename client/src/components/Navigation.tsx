import { Link, useNavigate } from "react-router-dom";
import { getUserFromToken, isAuthenticated, removeToken } from "../utils/auth";

const Navigation = () => {
  const navigate = useNavigate();
  const user = getUserFromToken();

  const handleLogout = () => {
    removeToken();
    navigate("/login");
  };

  return (
    <header>
      <nav className="d-flex justify-content-between align-items-center p-3 bg-light">
        <div>
          <Link to="/" className="mx-2">Home</Link>
          <Link to="/create-event" className="mx-2">Create Event</Link>
        </div>
        <div>
          {isAuthenticated() ? (
            <>
              <span className="mx-2">Welcome, {user?.name || "User"}!</span>
              <button className="btn btn-danger btn-sm" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="mx-2">Login</Link>
              <Link to="/signup" className="mx-2">Signup</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navigation;
