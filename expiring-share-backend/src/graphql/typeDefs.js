const typeDefs = `#graphql
  type SecretPayload {
    decryptedContent: String!
  }

  type ShortLink {
    urlCode: String!
  }

  type Query {
    revealSecret(urlCode: String!): SecretPayload!
  }

  type Mutation {
    generateSecretLink(
      plainTextContent: String!, 
      expirationMinutes: Int!, 
      allowedViews: Int!
    ): ShortLink!
  }
`;

module.exports = typeDefs;
