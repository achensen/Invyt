import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { Link } from "react-router-dom";

const Navigation = () => {
  const userContext = useContext(UserContext);

  if (!userContext) return null;

  const { user, logout } = userContext;

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand" to="/">Invyt</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto">
            {user ? (
              <>
                <li className="nav-item">
                  <span className="nav-link">Welcome, {user.name}!</span>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/create-event">Create Event</Link>
                </li>
                <li className="nav-item">
                  <button className="btn btn-outline-danger" onClick={logout}>Logout</button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <a href="http://localhost:3001/auth/google" className="nav-link">Login</a>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
