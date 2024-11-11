// services/socket.config.ts
import { Server } from 'socket.io';
import { corsOptions } from '../config/cors.config';  // Import CORS options

const setupSocketIO = (server: any) => {
  const io = new Server(server, {
    cors: corsOptions,  // Use the same CORS options
  });



  return io;
};

export { setupSocketIO };
