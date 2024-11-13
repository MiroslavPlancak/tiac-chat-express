// socket.service.ts
import * as socketIO from 'socket.io';
import * as services from '../services';

export const setupSocketEvents = (io: socketIO.Server) => {
  const authService = new services.SocketAuthService.SocketAuthService();

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Instantiate services with authService as a shared dependency
    const messageService = new services.SocketMessageService.SocketMessageService(io);
    const conService = new services.SocketConService.SocketConService(io, authService);

    // Register socket events for authentication and messaging
    authService.registerAuthEvents(socket);
    messageService.registerMessageEvents(socket);
    conService.registerConversationEvents(socket);
  });
};
