import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEventById, rsvpToEvent } from "../utils/api";

interface Event {
  _id: string;
  title: string;
  date: string;
  location: string;
}

const EventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [name, setName] = useState("");
  const [response, setResponse] = useState<"yes" | "no">("yes");

  useEffect(() => {
    if (id) {
      getEventById(id)
        .then((data) => {
          if (data) setEvent(data);
        })
        .catch((error) => console.error("Error fetching event:", error));
    }
  }, [id]);

  const handleRSVP = async () => {
    if (id && name.trim() !== "") {
      await rsvpToEvent(id, name, response);
      alert("RSVP Confirmed!");
    } else {
      alert("Please enter your name before RSVPing.");
    }
  };

  if (!event) return <p>Loading event details...</p>;

  return (
    <div className="container mt-4">
      <h1>{event.title}</h1>
      <p>Date: {event.date}</p>
      <p>Location: {event.location}</p>
      <div className="mt-3">
        <label className="form-label">Enter your name:</label>
        <input className="form-control mb-2" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        <label className="form-label">RSVP:</label>
        <select className="form-select mb-2" value={response} onChange={(e) => setResponse(e.target.value as "yes" | "no")}>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
        <button className="btn btn-success w-100" onClick={handleRSVP}>Submit RSVP</button>
      </div>
    </div>
  );
};

export default EventDetails;