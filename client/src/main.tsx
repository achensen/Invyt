import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/styles/index.css";
import { UserProvider } from "./context/UserContext";

// Get token securely
const getAuthToken = () => {
  const token = localStorage.getItem("id_token");
  return token ? `Bearer ${token}` : "";
};

// Set up Apollo Client for GraphQL API
const client = new ApolloClient({
  uri: "http://localhost:3001/graphql",
  cache: new InMemoryCache(),
  headers: {
    authorization: getAuthToken(),
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ApolloProvider client={client}>
        <UserProvider>
          <App />
        </UserProvider>
      </ApolloProvider>
    </BrowserRouter>
  </React.StrictMode>
);
