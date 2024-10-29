import sql from 'mssql'; // Importing sql as the default export

// Define the database configuration object
const dbConfig = {
  user: 'miroslavExpress',
  password: 'Dzgx8n+QqBoD0',
  server: 'localhost',
  database: 'TiacChatReimagined',
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

// Connect to the database and return the pool instance
export async function connectToDatabase() {
  try {
    const pool = await new sql.ConnectionPool(dbConfig).connect(); // Accessing ConnectionPool through sql
    console.log('Connected to the database!');
    return pool;
  } catch (err) {
    console.error('Database connection failed:', err);
    process.exit(1); // Exit the process on failure
  }
}

// Export the sql module if needed elsewhere
export { sql };
