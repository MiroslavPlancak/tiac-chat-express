// Import necessary modules
import express, { Application, Request, Response } from 'express';
import { connectToDatabase } from './config/db';
import { ConnectionPool } from 'mssql';

// Create an instance of the express application
const app: Application = express();

// Specify a port number for the server
const port: number = 5000;

// Initialize a variable to hold the database connection pool
let pool: ConnectionPool;

// Connect to the database
connectToDatabase()
  .then((connectedPool) => {
    pool = connectedPool; // Assign the connection pool to the pool variable
    console.log('Connected to the database!');
  })
  .catch((err) => {
    console.error('Database connection failed:', err);
    process.exit(1); // Exit the process if the database connection fails
  });

// Simple route for the home page
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the Tiac Chat Reimagined API!');
});

// Route to fetch users from the database
app.get('/users', async (req: Request, res: Response):Promise<void> => {
  try {
    if (!pool) {
       res.status(500).send('Database connection not established.');
       return
    }

    const result = await pool.request().query('SELECT TOP 4 * FROM Users');
    res.json(result.recordset); // Send the result as JSON
  } catch (err) {
    console.error('Error executing query:', err);
    res.status(500).send('Failed to fetch users.');
  }
});

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
