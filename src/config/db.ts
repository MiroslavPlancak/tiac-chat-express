import sql from 'mssql' 


// Define the database configuration object
const dbConfig = {
  user: 'miroslav',
  password: 'Amorfati1988!',
  server: 'localhost',
  database: 'TiacChatExpress',
  
  options: {
    encrypt: false,
    trustServerCertificate: true,
    
  },
  
}

// Connect to the database and return the pool instance
export async function connectToDatabase() {
  try {
    const pool = await new sql.ConnectionPool(dbConfig).connect()// Accessing ConnectionPool through sql
    // console.log('Connected to the database!')
    return pool
  } catch (err) {
    console.error('Database connection failed:', err)
    process.exit(1) // Exit the process on failure
  }
}

