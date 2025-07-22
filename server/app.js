const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/schema'); // Import the schema you created

const app = express();

// Use express-graphql middleware
app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true  // Enables the browser UI for testing queries
}));

app.listen(4000, () => {
  console.log('now listening for request on port 4000');
});
