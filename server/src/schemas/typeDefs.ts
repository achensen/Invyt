import { gql } from "graphql-tag";

const typeDefs = gql`
  type User {
    _id: ID!
    name: String!
    email: String!
    token: String
    contacts: [User]
  }

  type Event {
    _id: ID!
    title: String!
    date: String!
    location: String!
    recipients: [String!]!
    createdBy: User!
    attendees: [RSVP!]
  }

  type RSVP {
    name: String!
    response: String!
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
    me: User
  }

  type Mutation {
    register(name: String!, email: String!, password: String!): AuthPayload
    login(email: String!, password: String!): AuthPayload
    createEvent(title: String!, date: String!, location: String!, recipients: [String!]!): Event
    rsvp(eventId: ID!, name: String!, response: String!): Event
    addContact(contactEmail: String!): User
    removeContact(contactId: String!): User
  }
`;

export default typeDefs;