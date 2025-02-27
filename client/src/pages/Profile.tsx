import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { getEvents } from "../utils/api";
import { Link } from "react-router-dom";

const Profile = () => {
  const userContext = useContext(UserContext);
  const [events, setEvents] = useState<any[]>([]);

  if (!userContext?.user) {
    return <p className="text-center">You must be logged in to view your profile.</p>;
  }

  const { user, logout } = userContext;

  useEffect(() => {
    getEvents()
      .then((data) => setEvents(data || [])) // Ensures it never sets null
      .catch((error) => console.error("Error fetching events:", error));
  }, []);

  return (
    <div className="profile-container">
      <h1 className="profile-title">My Profile</h1>
      <div className="profile-card">
        <div className="avatar">{user.name[0]}</div>
        <h2>{user.name}</h2>
        <p>{user.email}</p>

        {/* Display User's Events */}
        <div className="user-events">
          <h3>My Events</h3>
          {events.length === 0 ? (
            <p>No events created yet.</p>
          ) : (
            <ul>
              {events.map((event) => (
                <li key={event._id}>
                  <Link to={`/event/${event._id}`} className="event-link">
                    {event.title} - {event.date}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button className="btn-danger" onClick={logout}>Logout</button>
      </div>
    </div>
  );
};

export default Profile;
