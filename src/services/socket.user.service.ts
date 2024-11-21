import * as socketIO from 'socket.io';
import * as db from '../config/db'
import * as models from '../models'
import * as services from './socket.auth.service'

export class SocketUserService {
    private _ioServer: socketIO.Server
    private _authService: services.SocketAuthService

    constructor(ioServer: socketIO.Server, authService: services.SocketAuthService) {
        this._ioServer = ioServer
        this._authService = authService
    }

    //----------------------------------- NOTIFIER METHODS ---------------------------------------//
    notifyAllClientsOfUserComingOnline(userId: string) {
        console.log(`Notifying all clients that user ${userId} is online.`);

        // Iterate over the map and send the notification to each user
        this._authService.clientConnectionSocketIdMap.forEach((socketId, connectedUserId) => {
            console.log(`Sending 'userHasComeOnlineResponse' to user ${connectedUserId} via socket ${socketId}.`);
            this._ioServer.to(socketId).emit('userHasComeOnlineResponse', { userId });
        });
    }

    notifyAllClientsOfUserGoingOffline(userId: string) {
        console.log(`Notifying all clients that user ${userId} is offline.`);

        // Iterate over the map and send the notification to each user
        this._authService.clientConnectionSocketIdMap.forEach((socketId, connectedUserId) => {
            console.log(`Sending 'userHasWentOfflineResponse' to user ${connectedUserId} via socket ${socketId}.`);
            this._ioServer.to(socketId).emit('userHasWentOfflineResponse', { userId });
        });
    }

    // This method will register the events to the socket.
    public registerUserEvents(socket: socketIO.Socket): void {

        socket.on('userHasComeOnlineRequest', (userId: models.User.id): void => {
            console.log(`userComingOnlineListener`)
            this.notifyAllClientsOfUserComingOnline(userId)
        })
        socket.on('userHasWentOfflineRequest', (userId: models.User.id): void => {
            console.log(`userGoingOfflineListener`)
            this.notifyAllClientsOfUserGoingOffline(userId)
        })
    }

}
