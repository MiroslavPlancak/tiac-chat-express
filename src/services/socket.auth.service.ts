import * as socketIO from 'socket.io'

export class SocketAuthService {
    public clientConnectionSocketIdMap: Map<string, string>

    constructor() {
        this.clientConnectionSocketIdMap = new Map<string, string>()
    }

    // Handle user authentication and store userId with socket ID
    public authenticateUser(socketId: socketIO.Socket, userId: string) {
        this.clientConnectionSocketIdMap.set(userId, socketId.id)
        console.log(`Client authenticated: ${userId} with socket ID: ${socketId.id}`)
        console.log(`map at login:`, this.clientConnectionSocketIdMap)
    }

    // Retrieve socket ID for a given user ID
    public getSocketIdByUserId(userId: string): string | undefined {
        return this.clientConnectionSocketIdMap.get(userId)
    }

    // Remove user from the map when they disconnect
    public removeUser(socket: socketIO.Socket, userId?:string) {
        for (let [userId, socketId] of this.clientConnectionSocketIdMap) {
            if (socketId === socket.id) {
                this.clientConnectionSocketIdMap.delete(userId)
                console.log(`User ${userId} removed from the map`)
                
                break
            }
        }
        console.log(`map at logout:`, this.clientConnectionSocketIdMap)
    }

    // This method will register the events to the socket.
    public registerAuthEvents(socket: socketIO.Socket): void {
        socket.on('clientAuthenticated', (userId: string) => {
            this.authenticateUser(socket, userId)
        })
        /**
         * The reason why both of these listeners
         * (clientLoggedOut and disconnect) are calling
         * for the same method is because `clientLoggedOut`
         * is the actual event of client pressing the logout 
         * button,where as `disconnect` is a built in socket
         * disconnect function in the socketServer library, 
         * which is called when user closes the browser tab,
         * or his internet connection is interrupted suddenly. 
         * In both of these cases we can to call removeUser() 
         * method to remove the user from the map of online 
         * users.
         */
        socket.on('clientDeauthenticated', () => {
            this.removeUser(socket)
        })
        
        socket.on('disconnect', () => {
            this.removeUser(socket)
        })
    }

    public getOnlineUsers(): string[] {
        return Array.from(this.clientConnectionSocketIdMap.keys());
    }
}
