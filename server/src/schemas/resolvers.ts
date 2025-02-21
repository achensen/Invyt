import User from "../models/User.js";
import Event from "../models/Event.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const resolvers = {
  Query: {
    users: async () => await User.find(),
    user: async (_: any, { id }: { id: string }) => await User.findById(id),
    events: async () => await Event.find(),
    event: async (_: any, { id }: { id: string }) => await Event.findById(id),
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

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "secret", { expiresIn: "1h" });

      return { token, user };
    },
    login: async (_: any, { email, password }: any) => {
      const user = await User.findOne({ email });
      if (!user) throw new Error("User not found");

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new Error("Invalid password");

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "secret", { expiresIn: "1h" });

      return { token, user };
    },
    createEvent: async (_: any, { title, date, location }: any, context: any) => {
      if (!context.user) throw new Error("Authentication required");

      const event = new Event({ title, date, location });
      await event.save();
      return event;
    },
    rsvp: async (_: any, { eventId }: any, context: any) => {
      if (!context.user) throw new Error("Authentication required");

      const event = await Event.findById(eventId);
      if (!event) throw new Error("Event not found");

      event.attendees.push(context.user._id);
      await event.save();
      return event;
    },
  },
};

export default resolvers;