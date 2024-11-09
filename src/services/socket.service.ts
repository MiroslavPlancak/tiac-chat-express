import * as socketIO from 'socket.io'
import * as services from '../services'


export const setupSocketEvents = (io: socketIO.Server) => {


    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id)
        
        // Instantiate services
        const authService = new services.SocketAuthService.SocketAuthService()
        const messageService = new services.SocketMessageService.SocketMessageService(io)

        // Register socket events for authentication and messaging
        authService.registerAuthEvents(socket)
        messageService.registerMessageEvents(socket)
    })
}
