import * as socketIO from 'socket.io';

export class SocketMessageService {
  private io: socketIO.Server;

  constructor(io: socketIO.Server) {
    this.io = io;
  }

  // Broadcast the message to all connected clients
  public sendMessage(message: string) {
    console.log('Message received:', message);
    this.io.emit('newMessage', message);
  }

    // This method will register the events to the socket.
    public registerMessageEvents(socket: socketIO.Socket): void {
        socket.on('sendMessage', (message: string) => {
          this.sendMessage(message);
        });
      }
}
