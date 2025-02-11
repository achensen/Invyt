import { useState } from "react";
import { createEvent } from "../utils/api";

const CreateEvent = () => {
  const [form, setForm] = useState({ title: "", date: "", location: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createEvent(form);
    alert("Event Created!");
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
        <button type="submit" className="btn btn-primary w-100">Create Event</button>
      </form>
    </div>
  );
};

export default CreateEvent;