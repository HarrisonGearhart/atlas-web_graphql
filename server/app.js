const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');
const schema = require('./schema/schema'); // Import the schema you created

const app = express();

const MONGO_URI = 'mongodb+srv://JoBlo:000999@cluster0.jnk7tr8.mongodb.net/taskmanager?retryWrites=true&w=majority';

// Connect to MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.once('open', () => {
  console.log('connected to database');
});

// Use express-graphql middleware
app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true  // Enables the browser UI for testing queries
}));

app.listen(4000, () => {
  console.log('now listening for request on port 4000');
});
