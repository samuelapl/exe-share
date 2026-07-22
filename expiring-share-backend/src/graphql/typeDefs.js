const typeDefs = `#graphql
  type SecretPayload {
    decryptedContent: String!
  }

  type ShortLink {
    urlCode: String!
  }

    type SecretLog {
    id: ID!
    urlCode: String!
    maxViews: Int!
    viewCount: Int!
    expiresAt: String!
    createdAt: String!
    isDestroyed: Boolean!
  }

  type Query {
    revealSecret(urlCode: String!): SecretPayload!
    getUserLogs(userId: ID!): [SecretLog!]!
  }

  type Mutation {
    generateSecretLink(
      plainTextContent: String!, 
      expirationMinutes: Int!, 
      allowedViews: Int!
      userId: ID!
    ): ShortLink!

    revokeSecret(urlCode: String!): Boolean!
  }
`;

module.exports = typeDefs;
