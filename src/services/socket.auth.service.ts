import * as socketIO from 'socket.io'

export class SocketAuthService {
    private clientConnectionSocketMap: Map<string, string>

    constructor() {
        this.clientConnectionSocketMap = new Map<string, string>()
    }

    // Handle user authentication and store userId with socket ID
    public authenticateUser(socketId: socketIO.Socket, userId: string) {
        this.clientConnectionSocketMap.set(userId, socketId.id)
        console.log(`Client authenticated: ${userId} with socket ID: ${socketId.id}`)
    }

    // Retrieve socket ID for a given user ID
    public getSocketIdByUserId(userId: string): string | undefined {
        return this.clientConnectionSocketMap.get(userId)
    }

    // Remove user from the map when they disconnect
    public removeUser(socket: socketIO.Socket) {
        for (let [userId, socketId] of this.clientConnectionSocketMap) {
            if (socketId === socket.id) {
                this.clientConnectionSocketMap.delete(userId)
                console.log(`User ${userId} removed from the map`)
                break
            }
        }
    }

    // This method will register the events to the socket.
    public registerAuthEvents(socket: socketIO.Socket): void {
        socket.on('clientAuthenticated', (userId: string) => {
            this.authenticateUser(socket, userId)
        })

        socket.on('disconnect', () => {
            this.removeUser(socket)
        })
    }


}
