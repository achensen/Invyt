import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

// Set up Apollo Client for GraphQL API
const client = new ApolloClient({
  uri: "http://localhost:3001/graphql", // Ensure backend is running here
  cache: new InMemoryCache(),
  headers: {
    authorization: localStorage.getItem("id_token") ? `Bearer ${localStorage.getItem("id_token")}` : "",
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ApolloProvider>
  </React.StrictMode>
);