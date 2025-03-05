import { useState, useContext } from "react";
import { createEvent } from "../utils/api";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const CreateEvent = () => {
  const userContext = useContext(UserContext);
  const navigate = useNavigate();

  if (!userContext?.user) {
    return (
      <p className="text-center">
        You must be logged in to create an event. <a href="/signup">Sign in</a>
      </p>
    );
  }

  const [form, setForm] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    recipients: [] as string[],
    // activities: [""],
  });

  const [email, setEmail] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleAddRecipient = () => {
    if (email.trim() && !form.recipients.includes(email.trim())) {
      setForm((prev) => ({
        ...prev,
        recipients: [...prev.recipients, email.trim()],
      }));
      setEmail("");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const newEvent = await createEvent({
        title: form.title,
        date: form.date,
        location: form.location,
        recipients: form.recipients,
      });

      if (!newEvent) {
        console.error("Failed to create event.");
        return;
      }

      navigate(`/event/${newEvent._id}`);
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };
  // const handleAddActivityInput = () => {
  //   setForm({ ...form, activities: [...form.activities, ""] });
  // };
//   const handleAddActivity = (e: React.ChangeEvent<HTMLInputElement>) =>{
//     e.preventDefault()
//     const activityName=e.target.name
//     const activityValue=e.target.value
//     const activityIndex=parseInt(activityName.split('-')[1])
// console.log(activityIndex,activityValue);
// setForm({...form,activities:[...form.activities.map((activity,index)=>{
//   if (index===activityIndex) {
//     return activityValue
//   } else {
//     return activity
//   }
// })]})
  // }
  return (
    <div className="event-container">
      <h1 className="event-title">Create an Event</h1>
      <form onSubmit={handleSubmit} className="event-form">
        <div className="input-group">
          <label>Event Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <label>Activity</label>
          {/* {form?.activities?.length>0&&form.activities.map((activity: string, index: number) => (
            <input
              type="text"
              name={`activity-${index}`}
              value={activity}
              onChange={handleAddActivity}
              required
            />
          ))} */}
          {/* <button
            type="button"
            className="btn-secondary"
            onClick={handleAddActivityInput}
          >
            Add
          </button> */}
        </div>
        <div className="input-group">
          <label>Date</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <label>Time</label>
          <input
            name="time"
            value={form.time}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <label>Location</label>
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <label>Invite Guests</label>
          <div className="email-input">
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              type="button"
              className="btn-secondary"
              onClick={handleAddRecipient}
            >
              Add
            </button>
          </div>
          <ul className="recipient-list">
            {form.recipients.map((recip, index) => (
              <li key={index}>{recip}</li>
            ))}
          </ul>
        </div>
        <button type="submit" className="btn-primary">
          Create Event
        </button>
      </form>
    </div>
  );
};

export default CreateEvent;
