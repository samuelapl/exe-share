const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@as-integrations/express5');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
require('dotenv').config();

const startServer = async () => {
  const app = express();
  const PORT = process.env.PORT || 4000;

  try {
    // Establish Database Link
    await connectDB();

    // Instantiate GraphQL Apollo Server Setup
    const server = new ApolloServer({ 
      typeDefs, 
      resolvers,
      formatError: (formattedError) => {
        console.error('GraphQL Error:', formattedError);
        return formattedError;
      }
    });
    
    await server.start();

    // Middleware pipeline stack configuration
    app.use(cors());
    app.use(express.json());

    // Health check endpoint
    app.get('/health', (req, res) => {
      res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
    });

    // Mount GraphQL - using the correct middleware
    app.use(
      '/graphql',
      expressMiddleware(server, {
        context: async ({ req }) => ({ req }),
      })
    );

    app.listen(PORT, () => {
      console.log(`🚀 Server spinning efficiently at http://localhost:${PORT}/graphql`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();