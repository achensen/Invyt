import User from "../models/User.js";
import Event from "../models/Event.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

// Set up nodemailer for sending emails
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const resolvers = {
  Query: {
    users: async () => await User.find(),
    user: async (_: any, { id }: { id: string }) => await User.findById(id),
    events: async () => await Event.find(),
    event: async (_: any, { id }: any, context: any) => {
      const event = await Event.findById(id);
      if (!event) throw new Error("Event not found");

      // Only allow event creator to see attendees
      if (context.user && String(event.createdBy) === String(context.user._id)) {
        return event;
      }

      // Hide attendees from non-owners
      return {
        ...event.toObject(),
        attendees: [],
      };
    },
  },
  Mutation: {
    register: async (_: any, { name, email, password }: any) => {
      if (!name || !email || !password) {
        throw new Error("All fields are required.");
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error("User already exists.");
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ name, email, password: hashedPassword });
      await user.save();

      const token = jwt.sign(
        { userId: user._id, name: user.name, email: user.email },
        process.env.JWT_SECRET || "secret",
        { expiresIn: "1h" }
      );

      return { token, user };
    },
    login: async (_: any, { email, password }: any) => {
      const user = await User.findOne({ email });
      if (!user) throw new Error("User not found");

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new Error("Invalid password");

      const token = jwt.sign(
        { userId: user._id, name: user.name, email: user.email },
        process.env.JWT_SECRET || "secret",
        { expiresIn: "1h" }
      );

      return { token, user };
    },
    createEvent: async (_: any, { title, date, location, recipients }: any, context: any) => {
      if (!context.user) {
        throw new Error("Authentication required");
      }
  
      if (!Array.isArray(recipients) || recipients.length === 0) {
        throw new Error("Recipients must be a non-empty array of email addresses");
      }
  
      console.log("📌 Creating event for user:", context.user._id);
  
      const event = new Event({
        title,
        date,
        location,
        recipients,
        createdBy: context.user._id,
        attendees: [],
      });
  
      await event.save();
      console.log("✅ Event successfully created:", event);
  
      // Send email invitations
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: recipients.join(","),
        subject: `You're Invited to ${title}!`,
        html: `
          <h2>You're invited to ${title}!</h2>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Location:</strong> ${location}</p>
          <p>Click <a href="http://localhost:3000/event/${event._id}">here</a> to view the event details and RSVP.</p>
        `,
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("❌ Email sending failed:", error);
        } else {
          console.log(`📧 Invitation emails sent: ${info.response}`);
        }
      });
  
      return event;
    },
    rsvp: async (_: any, { eventId, name, response }: any) => {
      const event = await Event.findById(eventId);
      if (!event) throw new Error("Event not found");

      if (!["yes", "no"].includes(response)) {
        throw new Error("Invalid RSVP response. Must be 'yes' or 'no'.");
      }

      event.attendees.push({ name, response });
      await event.save();

      return event;
    },
  },
};

export default resolvers;
