import * as socketIO from 'socket.io';
import * as db from '../config/db'
import * as models from '../models'

export class SocketMessageService {
  private ioServer: socketIO.Server;

  constructor(ioServer: socketIO.Server) {
    this.ioServer = ioServer;
  }

  // Broadcast the message to all connected clients
  public async sendMessage(message: models.Messages.FrontendMessage) {
    
    try {
      // Connect to the database
      const pool = await db.connectToDatabase()
      const result = await pool.request()
        .input('content', message.content)
        .input('conversationId', message.conId)
        .input('userId', message.userId)
        .input('dateTime', message.datetime) 
        .query(`
          INSERT INTO Messages (content, conversationId, userId, dateTime)
          OUTPUT inserted.*
          VALUES (@content, @conversationId, @userId, @dateTime)
        `)

      const createdMessage = result.recordset[0]

      if (!createdMessage) {
        throw new Error('Message creation failed')
      }

      console.log('Message saved to database:', createdMessage)

      // Broadcast to other clients
      this.ioServer.emit('newMessage', createdMessage)

    } catch (error) {
      console.error('Error saving message to database:', error)
    }

  }

    // This method will register the events to the socket.
    public registerMessageEvents(socket: socketIO.Socket): void {
        socket.on('sendMessage', (message: models.Messages.FrontendMessage) => {
          this.sendMessage(message)
        });
      }
}
