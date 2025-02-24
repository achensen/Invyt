import { gql } from "graphql-tag";

const typeDefs = gql`
  type User {
    _id: ID!
    name: String!
    email: String!
    token: String
  }

  type Event {
    _id: ID!
    title: String!
    date: String!
    location: String!
    attendees: [User]
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    users: [User]
    user(id: ID!): User
    events: [Event]
    event(id: ID!): Event
  }

  type Mutation {
    register(name: String!, email: String!, password: String!): AuthPayload
    login(email: String!, password: String!): AuthPayload
    createEvent(title: String!, date: String!, location: String!): Event
    rsvp(eventId: ID!): Event
  }
`;

export default typeDefs;