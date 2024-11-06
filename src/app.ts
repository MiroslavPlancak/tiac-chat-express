import * as express from 'express'
import * as db from './config/db' 
import * as connPool from 'mssql' 
import * as userRoutes from './routes/user.routes'
import * as messageRoutes from './routes/message.routes'
import * as conversationRoutes from './routes/conversation.routes'
import * as authRoutes from './routes/auth.routes'
import * as usersConversationsRoutes from './routes/userConversation.routes'
import * as cors from 'cors';
import * as http from 'http'; 
import { Server } from 'socket.io';

const app = express.default()
const port = 5000
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:4200', 
    methods: ['GET', 'POST'],
    credentials: true
  }
});


app.use(cors.default({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

let pool: connPool.ConnectionPool | undefined


db.connectToDatabase()
  .then((dbPool: connPool.ConnectionPool) => {
    pool = dbPool
    console.log('Database connected and pool cached.')
  })
  .catch((err: unknown) => {
    console.error('Failed to initialize the app:', err)
    process.exit(1) 
  })
 
// Set up Socket.IO events
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Handle custom events, for example, a message event
  socket.on('sendMessage', (message) => {
    console.log('Message received:', message);
    // Broadcast the message to all connected clients
    io.emit('newMessage', message);
  });

  // Handle user disconnects
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

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
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`)
// })

// Start the server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


