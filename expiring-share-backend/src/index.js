const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@as-integrations/express5');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const bcrypt= require('bcryptjs');
const User = require('./models/User');


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


app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Account already configured.' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ email, password: hashedPassword });
    res.status(201).json({ id: newUser._id, email: newUser.email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'No user record matching that email.' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Incorrect credentials key pass block.' });

    res.status(200).json({ id: user._id, email: user.email, name: user.name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



startServer();