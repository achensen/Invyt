import { setToken } from "./auth";
import axios from "axios";
import { getToken } from "./auth";

// Create a base instance of Axios
const api = axios.create({
  baseURL: "http://localhost:3001/graphql", // Change this when deployed
  headers: {
    "Content-Type": "application/json",
  },
});

// Add authorization token to every request if user is authenticated
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Fetch all events
export const getEvents = async () => {
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
  return response.data.data.events;
};

// Fetch a single event by ID
export const getEventById = async (id: string) => {
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
  return response.data.data.event;
};

// Create an event
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

    console.log("Create Event Response:", response.data);

    if (response.data.errors) {
      console.error("GraphQL Create Event Error:", response.data.errors);
      alert(response.data.errors[0].message);
      return null;
    }

    return response.data.data.createEvent;
  } catch (error) {
    console.error("Create Event GraphQL Error:", error);
    alert("Failed to create event.");
    throw error;
  }
};

// User login
export const loginUser = async (credentials: { email: string; password: string }, updateUser: (newUser: any) => void) => {
  try {
    const response = await api.post("", {
      query: `
        mutation {
          login(email: "${credentials.email}", password: "${credentials.password}") {
            token
            user {
              _id
              name
              email
            }
          }
        }
      `,
    });

    console.log("Login Response:", response.data);

    const { token, user } = response.data.data.login;
    setToken(token);
    updateUser(user);
    return user;
  } catch (error) {
    console.error("Login GraphQL Error:", error);
    alert("Login failed. Please try again.");
    throw error;
  }
};

// User signup
export const registerUser = async (userData: { name: string; email: string; password: string }, updateUser: (newUser: any) => void) => {
  try {
    const response = await api.post("", {
      query: `
        mutation {
          register(name: "${userData.name}", email: "${userData.email}", password: "${userData.password}") {
            token
            user {
              _id
              name
              email
            }
          }
        }
      `,
    });

    console.log("Signup Response:", response.data);

    if (response.data.errors) {
      console.error("GraphQL Signup Error:", response.data.errors);
      alert(response.data.errors[0].message);
      return null;
    }

    const { token, user } = response.data.data.register;
    setToken(token);
    updateUser(user);
    return user;
  } catch (error) {
    console.error("Signup GraphQL Error:", error);
    alert("Signup failed. Please try again.");
    throw error;
  }
};

// RSVP to an event
export const rsvpToEvent = async (eventId: string, name: string, response: "yes" | "no") => {
  try {
    const res = await api.post("", {
      query: `
        mutation {
          rsvp(eventId: "${eventId}", name: "${name}", response: "${response}") {
            _id
          }
        }
      `,
    });

    console.log("RSVP Response:", res.data);

    if (res.data.errors) {
      console.error("GraphQL RSVP Error:", res.data.errors);
      alert(res.data.errors[0].message);
      return null;
    }

    return res.data.data.rsvp;
  } catch (error) {
    console.error("RSVP GraphQL Error:", error);
    alert("Failed to RSVP.");
    throw error;
  }
};

