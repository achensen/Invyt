import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/styles/index.css";
import { UserProvider } from "./context/UserContext"; // ✅ Import User Context

// Set up Apollo Client for GraphQL API
const client = new ApolloClient({
  uri: "http://localhost:3001/graphql",
  cache: new InMemoryCache(),
  headers: {
    authorization: localStorage.getItem("id_token") ? `Bearer ${localStorage.getItem("id_token")}` : "",
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <UserProvider> {/* ✅ Wrap App with UserProvider */}
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </UserProvider>
    </ApolloProvider>
  </React.StrictMode>
);
