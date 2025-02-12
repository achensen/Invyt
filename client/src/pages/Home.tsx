import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getEvents } from "../utils/api";

interface Event {
  _id: string;
  title: string;
  date: string;
  location: string;
}

const Home = () => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    getEvents().then((data) => setEvents(data));
  }, []);

  return (
    <div className="container mt-4">
      <h1 className="text-center">Upcoming Events</h1>
      <div className="row">
        {events.map((event) => (
          <div className="col-md-4 col-sm-6 mb-4" key={event._id}>
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{event.title}</h5>
                <p className="card-text">{event.date}</p>
                <Link to={`/event/${event._id}`} className="btn btn-primary w-100">
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;