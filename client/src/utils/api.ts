import axios from "axios";
import { getToken, setToken, removeToken } from "./auth";

// Create Axios Instance
const api = axios.create({
  baseURL: "http://localhost:3001/graphql",
  headers: { "Content-Type": "application/json" },
});

// Attach JWT Token to Every Request
api.interceptors.request.use(async (config) => {
  let token = getToken();
  if (!token) return config;

  config.headers.Authorization = `Bearer ${token}`;

  try {
    // Check Token Expiry & Refresh If Needed
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (payload.exp * 1000 < Date.now()) {
      console.log("⏳ Token expired, refreshing...");
      const res = await axios.get("http://localhost:3001/auth/refresh-token", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.accessToken) {
        setToken(res.data.accessToken);
        config.headers.Authorization = `Bearer ${res.data.accessToken}`;
      } else {
        removeToken();
      }
    }
  } catch (err) {
    console.error("Token refresh error:", err);
    removeToken();
  }

  return config;
});

// 🔹 Fetch all events
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

  return response.data.data?.events || [];
};

// 🔹 Fetch a single event by ID
export const getEventById = async (id: string) => {
  const response = await api.post("", {
    query: `
      query {
        event(id: "${id}") {
          _id
          title
          date
          location
          activities {
            _id
            name
            votes
          }
        }
      }
    `,
  });

  return response.data.data?.event || null;
};

// 🔹 RSVP to an event
export const rsvpToEvent = async (
  eventId: string,
  name: string,
  response: "yes" | "no"
) => {
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

    return res.data.data?.rsvp || null;
  } catch (error) {
    console.error("RSVP GraphQL Error:", error);
    throw error;
  }
};

// 🔹 Create an event
export const updateVote = async ( 
  eventId: string|undefined,
  selectionId: string,
  revoting: boolean,
  previousSelectionId: string,
  
) => {
  try {
    const response = await api.post("", {
      query: `
      mutation UpdateVote($eventId: ID!, $selectionId: ID!, $revoting: Boolean, $previousSelectionId: ID) {
  updateVote(eventId: $eventId, selectionId: $selectionId, revoting: $revoting, previousSelectionId: $previousSelectionId) {
    _id
    title
    date
    location
    recipients
    activities {
      name
      votes
    }
  }
}
      `,
      variables: { selectionId,eventId, revoting,previousSelectionId },
    });

    return response.data.data?.updateVote || null;
  } catch (error) {
    console.error("Create Event GraphQL Error:", error);
    throw error;
  }
};

export const createEvent = async (eventData: {
  title: string;
  date: string;
  location: string;
  recipients: string[];
  activities: object[];
}) => {
  try {
    const response = await api.post("", {
      query: `
        mutation CreateEvent($title: String!, $date: String!, $location: String!, $recipients: [String!]!, $activities: [ActivityInput]) {
          createEvent(title: $title, date: $date, location: $location, recipients: $recipients, activities: $activities) {
            _id
          }
        }
      `,
      variables: eventData,
    });

    return response.data.data?.createEvent || null;
  } catch (error) {
    console.error("Create Event GraphQL Error:", error);
    throw error;
  }
};


// 🔹 Login User
export const loginUser = async () => {
  window.location.href = "http://localhost:3001/auth/google";
};

// 🔹 Logout User
export const logoutUser = () => {
  removeToken();
  window.location.href = "/";
};

export const getMe = async () => {
  const response = await api.post("", {
    query: `
     query Me {
  me {
    _id
    email
    name
    token
    contacts {
      _id
      email
      name
    }
  }
}
    `,
  });

  return response.data.data?.me || [];
};

export const getUsers = async () => {
  const response = await api.post("", {
    query: `
     query users {
  users {
    name
    email
    _id
  }
}
    `,
  });

  return response.data.data?.users || [];
};
export const addContact = async (contactEmail: string) => {
  try {
    const res = await api.post("", {
      query: `
       mutation AddContact($contactEmail: String!) {
  addContact(contactEmail: $contactEmail) {
    _id
    email
    name
    token
    contacts {
      _id
      email
      name
    }
  }
}
      `,
      variables: {contactEmail:contactEmail}
    });

    return res.data.data?.addContact || null;
  } catch (error) {
    console.error("RSVP GraphQL Error:", error);
    throw error;
  }
};
