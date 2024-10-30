import * as express from 'express'
import * as db from './config/db' 
import * as connPool from 'mssql' 
import * as models from './models'

const app = express.default()
const port = 5000

// Initialize the pool variable with correct typing
let pool: connPool.ConnectionPool | undefined

// Connect to the database and cache the pool instance
db.connectToDatabase()
  .then((dbPool: connPool.ConnectionPool) => {
    pool = dbPool
    console.log('Database connected and pool cached.')
  })
  .catch((err: unknown) => {
    console.error('Failed to initialize the app:', err)
    process.exit(1) 
  })


app.get('/', (req: express.Request, res: express.Response): void => {
  res.send('Welcome to the Tiac Chat Reimagined API!')
})

// fetch data from the Users table (for testing purposes)
app.get('/users', async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    if (!pool) {
      res.status(500).send('Database connection not established.')
      return
    }

    const result = await pool.request().query('SELECT TOP 3 * FROM Users')
    const users: models.User[] = result.recordset.map((userRow: any) => {
      console.log('Mapping userRow:', userRow)
      return {
        id: userRow.Id, 
        name: userRow.Name, 
      }
    })

    res.json(users) // send the result as JSON
  } catch (err) {
    console.error('Error executing query:', err)
    res.status(500).send('Failed to fetch users.')
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
