import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEventById, rsvpToEvent } from "../utils/api";

interface Event {
  _id: string;
  title: string;
  date: string;
  location: string;
  activities: object[]
}

const EventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [name, setName] = useState("");
  const [response, setResponse] = useState<"yes" | "no">("yes");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (id) {
      getEventById(id).then((data) => setEvent(data));
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

  const handleCopyLink = () => {
    if (id) {
      const eventURL = `${window.location.origin}/event/${id}`;
      navigator.clipboard.writeText(eventURL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset copied status after 2 seconds
    }
  };

  if (!event) return <p>Loading...</p>;

  return (
    <div className="container mt-4">
      {/* Event Details Section */}
      <div className="event-details-container">
        <h1>{event.title}</h1>
        <p><strong>Date:</strong> {event.date}</p>
        <p><strong>Location:</strong> {event.location}</p>
      </div>
    <div className="container mt-4">
      {event?.activities?.length > 0 && event.activities.map((activity:any)=>(<div key={activity._id}> 
        {activity.name}
      </div>))}
    </div>
      {/* Copyable Event Link */}
      <div className="copy-link-container mt-3">
        <label className="form-label">Shareable link:</label>
        <input 
          type="text" 
          value={`${window.location.origin}/event/${id}`} 
          readOnly 
          className="copy-link-input form-control"
        />
        <button onClick={handleCopyLink} className="btn btn-secondary copy-btn">
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      {/* RSVP Section */}
      <div className="rsvp-container mt-3">
        <label className="form-label">Enter your name:</label>
        <input
          className="form-control mb-2"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <label className="form-label">RSVP:</label>
        <select
          className="form-select mb-2"
          value={response}
          onChange={(e) => setResponse(e.target.value as "yes" | "no")}
        >
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
        <button className="btn btn-success w-100" onClick={handleRSVP}>
          Submit RSVP
        </button>
      </div>
    </div>
  );
};

export default EventDetails;