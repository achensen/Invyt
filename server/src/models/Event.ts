import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
  activities: [
    {
      name: { type: String, required: true },
      votes: [{ type:  mongoose.Schema.Types.ObjectId }],
    },
  ],
  location: { type: String, required: true },
  time: { type: String, default:"TBA" },
  recipients: [{ type: String, required: true }], // Store recipient emails
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Track event creator
  attendees: [
    {
      name: { type: String, required: true },
      response: { type: String, enum: ["yes", "no"], required: true },
    },
  ],
});

export default mongoose.model("Event", EventSchema);