import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
  location: { type: String, required: true },
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