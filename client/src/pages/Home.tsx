import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { getEvents } from "../utils/api";

const Home = () => {
  const userContext = useContext(UserContext);
  const [events, setEvents] = useState<any[]>([]);

  if (!userContext) return null;

  const { user } = userContext;

  useEffect(() => {
    if (user) {
      getEvents()
        .then((data) => setEvents(data))
        .catch((error) => console.error("Error fetching events:", error));
    }
  }, [user]);

  if (!user) {
    return <h2>Please log in to see events.</h2>;
  }

  return (
    <div className="container mt-4">
      <h1>Upcoming Events</h1>
      {events.length === 0 ? (
        <p>No events available.</p>
      ) : (
        <ul>
          {events.map((event) => (
            <li key={event._id}>{event.title} - {event.date}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Home;