import * as socket from 'socket.io'
import * as cors from '../config/cors.config'  

const setupSocketIO = (server: any) => {
  const io = new socket.Server(server, {
    cors: cors.corsOptions,  // Use the same CORS options
  })

  return io
}

export { setupSocketIO }
