import axios from "axios";
import { getToken } from "./auth";

// Create a base Axios instance
const api = axios.create({
  baseURL: "http://localhost:3001/graphql",
  headers: {
    "Content-Type": "application/json",
  },
});

// Ensure Authorization Header is included if user is authenticated
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Fetch all events (Only events created by the authenticated user)
export const getEvents = async () => {
  try {
    const response = await api.post("", {
      query: `
        query {
          events {
            _id
            title
            date
            location
          }
        }
      `,
    });

    if (response.data.errors) {
      console.error("GraphQL Event Fetch Error:", response.data.errors);
      return [];
    }

    return response.data.data.events;
  } catch (error) {
    console.error("Event Fetch GraphQL Error:", error);
    return [];
  }
};

// Fetch a single event by ID
export const getEventById = async (id: string) => {
  try {
    const response = await api.post("", {
      query: `
        query {
          event(id: "${id}") {
            _id
            title
            date
            location
          }
        }
      `,
    });

    if (response.data.errors) {
      console.error("GraphQL Event Fetch Error:", response.data.errors);
      return null;
    }

    return response.data.data.event;
  } catch (error) {
    console.error("Event Fetch GraphQL Error:", error);
    return null;
  }
};

// Create an event (Authenticated User Only)
export const createEvent = async (eventData: { title: string; date: string; location: string; recipients: string[] }) => {
  try {
    const response = await api.post("", {
      query: `
        mutation CreateEvent($title: String!, $date: String!, $location: String!, $recipients: [String!]!) {
          createEvent(title: $title, date: $date, location: $location, recipients: $recipients) {
            _id
          }
        }
      `,
      variables: {
        title: eventData.title,
        date: eventData.date,
        location: eventData.location,
        recipients: eventData.recipients,
      },
    });

    if (response.data.errors) {
      console.error("GraphQL Create Event Error:", response.data.errors);
      alert(response.data.errors[0].message);
      return null;
    }

    return response.data.data.createEvent;
  } catch (error) {
    console.error("Create Event GraphQL Error:", error);
    alert("Failed to create event.");
    return null;
  }
};

// RSVP to an event
export const rsvpToEvent = async (eventId: string, name: string, response: "yes" | "no") => {
  try {
    const res = await api.post("", {
      query: `
        mutation RSVP($eventId: ID!, $name: String!, $response: String!) {
          rsvp(eventId: $eventId, name: $name, response: $response) {
            _id
          }
        }
      `,
      variables: {
        eventId,
        name,
        response,
      },
    });

    if (res.data.errors) {
      console.error("GraphQL RSVP Error:", res.data.errors);
      alert(res.data.errors[0].message);
      return null;
    }

    return res.data.data.rsvp;
  } catch (error) {
    console.error("RSVP GraphQL Error:", error);
    alert("Failed to RSVP.");
    return null;
  }
};
