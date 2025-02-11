import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEventById, rsvpToEvent } from "../utils/api";

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    getEventById(id).then((data) => setEvent(data));
  }, [id]);

  const handleRSVP = async () => {
    await rsvpToEvent(id);
    alert("RSVP Confirmed!");
  };

  if (!event) return <p>Loading...</p>;

  return (
    <div className="container mt-4">
      <h1>{event.title}</h1>
      <p>Date: {event.date}</p>
      <p>Location: {event.location}</p>
      <button className="btn btn-success w-100" onClick={handleRSVP}>
        RSVP Now
      </button>
    </div>
  );
};

export default EventDetails;