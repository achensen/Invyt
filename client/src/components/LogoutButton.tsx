import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";

const LogoutButton = () => {
  const userContext = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  if (!userContext) return null;
  const { logout } = userContext;

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      setLoading(true);
      setTimeout(() => {
        logout();
      }, 1000);
    }
  };

  return (
    <button className="btn btn-outline-danger w-100" onClick={handleLogout} disabled={loading}>
      {loading ? "Logging out..." : "Logout"}
    </button>
  );
};

export default LogoutButton;
