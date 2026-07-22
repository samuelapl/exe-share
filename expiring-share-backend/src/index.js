const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@as-integrations/express5");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const authRoutes = require("./services/authService");

require("dotenv").config();

const app = express();
// Middleware pipeline stack configuration
app.use(cors());
app.use(express.json());

const startServer = async () => {
  const PORT = process.env.PORT || 4000;

  try {
    await connectDB();

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      formatError: (formattedError) => {
        console.error("GraphQL Error:", formattedError);
        return formattedError;
      },
    });

    await server.start();

    app.use(cors());
    app.use(express.json());

    // Health check endpoint
    app.get("/health", (req, res) => {
      res
        .status(200)
        .json({ status: "OK", timestamp: new Date().toISOString() });
    });

    app.use("/api/auth", authRoutes);

    app.use(
      "/graphql",
      expressMiddleware(server, {
        context: async ({ req }) => ({ req }),
      }),
    );

    app.listen(PORT, () => {
      console.log(
        `🚀 Server spinning efficiently at http://localhost:${PORT}/graphql`,
      );
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
