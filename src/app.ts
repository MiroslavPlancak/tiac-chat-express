import * as express from 'express'
import * as db from './config/db' 
import * as connPool from 'mssql' 
import * as userRoutes from './routes/user.routes'
import * as messageRoutes from './routes/message.routes'
import * as conversationRoutes from './routes/conversation.routes'
import * as authRoutes from './routes/auth.routes'
import * as usersConversationsRoutes from './routes/userConversation.routes'

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
 

// welcome root route
app.get('/', (req: express.Request, res: express.Response): void => {
  res.send('Welcome to the Tiac Chat Reimagined API!')
})

// Middleware to use JSON (only useful for request with a payload: POST PUT PATCH)
app.use(express.json())

// test routes
app.use('/api', userRoutes.default);
app.use('/api', messageRoutes.default);
app.use('/api', conversationRoutes.default)
app.use('/api', authRoutes.default)
app.use('/api', usersConversationsRoutes.default)
// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
