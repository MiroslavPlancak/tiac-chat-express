// Import the required modules
const express = require('express');
const { connectToDatabase } = require('./config/db');

// Create an instance of the express application
const app = express();
const port = 5000;

// Connect to the database and cache the pool instance
let pool;
connectToDatabase().then((dbPool) => {
    pool = dbPool;
}).catch((err) => {
    console.error('Failed to initialize the app:', err);
});

// Simple route to test server functionality
app.get('/', (req, res) => {
    res.send('Welcome to the Tiac Chat Reimagined API!');
});

// Route to fetch data from the Users table (for testing purposes)
app.get('/users', async (req, res) => {
    try {
        const result = await pool.request().query('SELECT TOP 5 * FROM Users');
        res.json(result.recordset); // Send the result as JSON
    } catch (err) {
        console.error('Error executing query:', err);
        res.status(500).send('Failed to fetch users.');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
