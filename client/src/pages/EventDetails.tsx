import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { getEventById, rsvpToEvent, updateVote } from "../utils/api";
import { UserContext } from "../context/UserContext";

interface Event {
  _id: string;
  title: string;
  date: string;
  location: string;
  activities: object[];
}

const EventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const userContext: any = useContext(UserContext);
  const { user} = userContext;
  const [event, setEvent] = useState<Event | null>(null);
  const [name, setName] = useState("");
  const [response, setResponse] = useState<"yes" | "no">("yes");
  const [copied, setCopied] = useState(false);
  const [activities, setActivities] = useState([] as any);
  const [voteId, setVoteId] = useState(null);
  const [totalVotes, setTotalVotes] = useState(0)
// const [previousSelectionId, setPreviousSelectionId] = useState(null)

  useEffect(() => {
  console.log(totalVotes);
  
  
  }, [totalVotes])
  

  useEffect(() => {
   if (!(activities?.length > 0)) return
   console.log(user);
   let count= 0
   activities.forEach((element: any)=>{
    count=count+element.votes.length
    //sets voteId to the activiyId that the user voted for
    if (element.votes.includes(user._id)){
      setVoteId(element._id)
    }
   })
   setTotalVotes(count)
  }, [activities])
  

  useEffect(() => {
    if (id) {
      getEventById(id).then((data) => {
        setEvent(data);
        setActivities(data.activities);
      });
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

  const handleVote = async (selectionId: string) => {
    // const newVote={
    //   selectionId:selectionId,
    //   eventId:id,
    //   revoting:false,
    //   previousSelectionId:"",
    // }
    console.log("selectionID", selectionId);
    const revoting = voteId? true: false
    const previousSelectionId = voteId?voteId:""
    const updatedEvent = await updateVote(id || "", selectionId, revoting, previousSelectionId);
    if (updatedEvent?.activities) {
      console.log(updatedEvent.activities);
      
      setActivities(updatedEvent.activities);
    }
  };
  if (!event) return <p>Loading...</p>;

  return (
    <div className="container mt-4">
      {/* Event Details Section */}
      <div className="event-details-container">
        <h1>{event.title}</h1>
        <p>
          <strong>Date:</strong> {event.date}
        </p>
        <p>
          <strong>Location:</strong> {event.location}
        </p>
      </div>
      <div className="container mt-4 d-flex flex-column align-items-center">
        {activities?.length > 0 &&
          activities.map((activity: any) => (
            <div
              key={activity._id}
              className="d-flex w-100 justify-content-center align-items-center position-relative"
            >
              <div
                className="px-4 py-2 my-2 bg-light text-dark rounded w-50 text-center "
                style={{ cursor: "pointer", height: "5vh"}}
                onClick={() => handleVote(activity._id)}
              >
                <div 
                className= "rounded h-100"
                style= {{backgroundColor: "red", width: `${(activity.votes.length/totalVotes)*100}%` }}>
                </div>
                
                <div className= "position-absolute top-50 start-50 translate-middle">
                  {activity.name}
                </div>
              </div>
              <div className="mx-3">{activity?.votes?.length}</div>
            </div>
          ))}
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
