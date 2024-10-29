// Import the required modules with type support
import express, { Request, Response } from 'express';
import * as db from './config/db'; // Ensure `Pool` is exported from db.ts
import { ConnectionPool } from 'mssql'; // Import the type directly from 'mssql'
// Create an instance of the express application
const app = express();
const port = 5000;

// Initialize the pool variable with correct typing
let pool: ConnectionPool | undefined;

// Connect to the database and cache the pool instance
db.connectToDatabase()
  .then((dbPool: ConnectionPool) => {
    pool = dbPool;
    console.log('Database connected and pool cached.');
  })
  .catch((err: unknown) => {
    console.error('Failed to initialize the app:', err);
    process.exit(1); // Exit the process if the database connection fails
  });

// Simple route to test server functionality
app.get('/', (req: Request, res: Response): void => {
  res.send('Welcome to the Tiac Chat Reimagined API!');
});

// Route to fetch data from the Users table (for testing purposes)
app.get('/users', async (req: Request, res: Response): Promise<void> => {
  try {
    if (!pool) {
      res.status(500).send('Database connection not established.');
      return;
    }

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
