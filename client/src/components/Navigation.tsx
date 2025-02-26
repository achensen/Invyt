import { useContext, useState, useEffect, useRef } from "react";
import { UserContext } from "../context/UserContext";
import { Link } from "react-router-dom";

const Navigation = () => {
  const userContext = useContext(UserContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);

  if (!userContext) return null;

  const { user, logout } = userContext;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="navbar navbar-expand-lg custom-navbar">
      <div className="container">
        <Link className="navbar-brand" to="/">Invyt</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/create-event">Create Event</Link>
                </li>
                <li className="nav-item dropdown" ref={dropdownRef}>
                  <button 
                    className="btn dropdown-toggle profile-dropdown" 
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    {user.name}
                  </button>
                  <ul className={`dropdown-menu ${dropdownOpen ? "show" : ""}`}>
                    <li>
                      <Link className="dropdown-item" to="/profile">My Profile</Link>
                    </li>
                    <li>
                      <button className="dropdown-item logoutText" onClick={logout}>Logout</button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <a href="http://localhost:3001/auth/google" className="btn loginButton">Login</a>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;