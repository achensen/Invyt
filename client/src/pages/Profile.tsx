import { useContext } from "react";
import { UserContext } from "../context/UserContext";

const Profile = () => {
  const userContext = useContext(UserContext);

  if (!userContext?.user) {
    return <p className="text-center">You must be logged in to view your profile.</p>;
  }

  const { user, logout } = userContext;

  return (
    <div className="profile-container">
      <h1 className="profile-title">My Profile</h1>
      <div className="profile-card">
        <div className="avatar">{user.name[0]}</div>
        <h2>{user.name}</h2>
        <p>{user.email}</p>
        <button className="btn-danger" onClick={logout}>Logout</button>
      </div>
    </div>
  );
};

export default Profile;
