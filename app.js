// Import the express module
const express=require('express');
const { connectToDatabase } = require('./config/db');
// Create an instance of the express application
const app=express();
// Specify a port number for the server
const port=5000;
//Connect to the database
connectToDatabase()
//Simple route
app.get('/', (req, res) =>{
  res.send('Welcome to the Tiac Chat Reimagined API!');
})
// Start the server and listen to the port
app.get('/users', async (req, res) => {
  try {
      const result = await pool.request().query('SELECT TOP 4 * FROM Users');
      res.json(result.recordset); // Send the result as JSON
  } catch (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Failed to fetch users.');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});