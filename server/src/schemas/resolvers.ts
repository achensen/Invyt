import User from "../models/User.js";
import Event from "../models/Event.js";
import nodemailer from "nodemailer";
import { refreshGoogleToken } from "../routes/auth.js"; // Import refresh function

// Function to create OAuth2 transporter
const createTransporter = async (email: string) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found in database.");
  }

  if (!user.refreshToken) {
    throw new Error(`User ${email} is missing a refresh token.`);
  }

  // Log current tokens
  console.log(`🔄 Attempting email send for: ${email}`);
  console.log(`🔑 Stored Access Token: ${user.accessToken}`);
  console.log(`🔄 Stored Refresh Token: ${user.refreshToken}`);

  // Refresh access token if missing or expired
  let accessToken = user.accessToken;
  if (!accessToken) {
    console.log(`🚨 Access Token missing for ${email}, attempting refresh.`);
    accessToken = await refreshGoogleToken(user.refreshToken);

    if (!accessToken) {
      throw new Error(`Failed to refresh Google Access Token for ${email}.`);
    }

    // Save the refreshed token
    user.accessToken = accessToken;
    await user.save();
    console.log(`✅ Refreshed Access Token saved for ${email}`);
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: email,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      refreshToken: user.refreshToken,
      accessToken: accessToken, // Use refreshed access token
    },
  });
};

const resolvers = {
  Query: {
    users: async () => await User.find(),
    user: async (_: any, { id }: { id: string }) => await User.findById(id),
    events: async (_: any, __: any, context: any) => {
      if (!context.user) throw new Error("Authentication required");
      return await Event.find({ createdBy: context.user.userId });
    },
    event: async (_: any, { id }: any, context: any) => {
      const event = await Event.findById(id);
      if (!event) throw new Error("Event not found");

      if (
        context.user &&
        String(event.createdBy) === String(context.user.userId)
      ) {
        return event;
      }

      return { ...event.toObject(), attendees: [] };
    },
  },
  Mutation: {
    createEvent: async (
      _: any,
      { title, date, location, recipients }: any,
      context: any
    ) => {
      if (!context.user) {
        throw new Error("Authentication required");
      }

      const event = new Event({
        title,
        date,
        location,
        recipients,
        createdBy: context.user.userId,
        attendees: [],
      });

      await event.save();

      try {
        const transporter = await createTransporter(context.user.email);

        const mailOptions = {
          from: context.user.email,
          to: recipients.join(","),
          subject: `You're Invited to ${title}!`,
          html: `
            <h2>You're invited to ${title}!</h2>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Location:</strong> ${location}</p>
            <p>Click <a href="http://localhost:3000/event/${event._id}">here</a> to view the event details and RSVP.</p>
          `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`📧 Invitation emails sent from ${context.user.email}`);
      } catch (error) {
        const err = error as any;
        console.error("❌ Email sending failed:", err.message || err);
      }

      return event;
    },
    rsvp: async (_: any, { eventId, name, response }: any) => {
      const event = await Event.findById(eventId);
      if (!event) throw new Error("Event not found");

      if (!["yes", "no"].includes(response)) {
        throw new Error("Invalid RSVP response. Must be 'yes' or 'no'.");
      }

      const existingRSVP = event.attendees.find(
        (attendee) => attendee.name === name
      );
      if (existingRSVP) {
        throw new Error("You have already RSVP'd for this event.");
      }

      event.attendees.push({ name, response });
      await event.save();

      return event;
    },
    addContact: async (_: any, { contactEmail }: any, context: any) => {
      if (!context.user) {
        throw new Error("Authentication required");
      }
      const user= await User.findOne({email: contactEmail})
      if (!user) {
        throw new Error("user not found");
      }
      const updatedUser = await User.findOneAndUpdate(
        { _id: context.user.userId },
        { $addToSet: { contacts: user._id } },
        { new: true }
      );
      return updatedUser;
    },
    removeContact: async (_: any, { contactId }: any, context: any) => {
      if (!context.user) {
        throw new Error("Authentication required");
      }
      const user = await User.findOneAndUpdate(
        { _id: context.user.userId },
        { $pull: { contacts: {contactId:contactId} } },
        { new: true }
      );
      return user;
    },
  },
};

export default resolvers;
