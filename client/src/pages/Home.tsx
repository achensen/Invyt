import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { getEvents } from "../utils/api";
import Places from "../components/Places";

const Home = () => {
  const userContext = useContext(UserContext);
  const [events, setEvents] = useState<any[]>([]);

  if (!userContext) return null;

  const { user } = userContext;

  useEffect(() => {
    if (user) {
      getEvents()
        .then((data) => setEvents(data || [])) // Ensure it never sets null
        .catch((error) => console.error("Error fetching events:", error));
    }
  }, [user]);

  // Show this message if no user is logged in
  if (!user) {
    return <h2 className="text-center mt-4">Please log in to see events.</h2>;
  }
  // if (!user) {
  //   return <Places/>;
  // }

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
