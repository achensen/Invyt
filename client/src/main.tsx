import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/styles/index.css";
import { UserProvider } from "./context/UserContext";

// Create HTTP Link for Apollo Client
const httpLink = createHttpLink({
  uri: "http://localhost:3001/graphql",
});

// Dynamically attach JWT token for every request
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("id_token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// Initialize Apollo Client
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
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
