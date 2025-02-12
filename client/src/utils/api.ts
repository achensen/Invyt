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
export const createEvent = async (eventData: { title: string; date: string; location: string }) => {
  await api.post("", {
    query: `
      mutation {
        createEvent(title: "${eventData.title}", date: "${eventData.date}", location: "${eventData.location}") {
          _id
        }
      }
    `,
  });
};

// RSVP to an event
export const rsvpToEvent = async (eventId: string) => {
  await api.post("", {
    query: `
      mutation {
        rsvp(eventId: "${eventId}") {
          _id
        }
      }
    `,
  });
};

// User login
export const loginUser = async (credentials: { email: string; password: string }) => {
  const response = await api.post("", {
    query: `
      mutation {
        login(email: "${credentials.email}", password: "${credentials.password}") {
          token
          user {
            _id
            email
          }
        }
      }
    `,
  });

  const token = response.data.data.login.token;
  setToken(token);
};

// User signup
export const registerUser = async (userData: { name: string; email: string; password: string }) => {
  const response = await api.post("", {
    query: `
      mutation {
        register(name: "${userData.name}", email: "${userData.email}", password: "${userData.password}") {
          token
          user {
            _id
            email
          }
        }
      }
    `,
  });

  const token = response.data.data.register.token;
  setToken(token);
};