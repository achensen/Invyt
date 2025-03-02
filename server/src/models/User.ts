import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  googleId: { type: String, unique: true, required: true }, // Store Google ID
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  accessToken: { type: String },
  refreshToken: { type: String },
  contacts: [{ type: mongoose.Schema.Types.ObjectId, ref: "User"}], // Track event creator
});

export default mongoose.model("User", UserSchema);
