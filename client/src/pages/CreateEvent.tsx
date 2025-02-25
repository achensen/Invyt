import { useState, useContext } from "react";
import { createEvent } from "../utils/api";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

interface EventForm {
  title: string;
  date: string;
  location: string;
  recipients: string[];
}

const CreateEvent = () => {
  const [form, setForm] = useState<EventForm>({ title: "", date: "", location: "", recipients: [] });
  const [email, setEmail] = useState(""); // Stores the current email input
  const userContext = useContext(UserContext);
  const navigate = useNavigate();

  if (!userContext?.user) return <p>You must be logged in to create an event.</p>;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Add email to the list
  const handleAddRecipient = () => {
    if (email.trim() && !form.recipients.includes(email)) {
      setForm({ ...form, recipients: [...form.recipients, email.trim()] });
      setEmail("");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    // Ensure the last email entered is added before submitting
    if (email.trim() && !form.recipients.includes(email)) {
      form.recipients.push(email.trim());
      setEmail(""); 
    }
  
    try {
      if (!userContext.user) {
        console.error("User context is missing.");
        return;
      }
  
      const newEvent = await createEvent(form);
  
      if (!newEvent) {
        console.error("Failed to create event.");
        return;
      }
  
      navigate(`/event/${newEvent._id}`);
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };  

  return (
    <div className="container mt-4">
      <h1>Create an Event</h1>
      <form onSubmit={handleSubmit} className="p-4 shadow-lg rounded bg-light">
        <div className="mb-3">
          <label className="form-label">Event Title</label>
          <input className="form-control" name="title" value={form.title} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Date</label>
          <input type="date" className="form-control" name="date" value={form.date} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Location</label>
          <input className="form-control" name="location" value={form.location} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Invite Guests</label>
          <input className="form-control" type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <button type="button" className="btn btn-secondary mt-2" onClick={handleAddRecipient}>Add Email</button>
          <ul>
            {form.recipients.map((recip, index) => (
              <li key={index}>{recip}</li>
            ))}
          </ul>
        </div>
        <button type="submit" className="btn btn-primary w-100">Create Event</button>
      </form>
    </div>
  );
};

export default CreateEvent;
