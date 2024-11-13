// socket.con.service.ts
import * as socketIO from 'socket.io';
import * as models from '../models';
import * as services from './socket.auth.service';

export class SocketConService {
  private _io: socketIO.Server;
  private _authService: services.SocketAuthService;

  constructor(io: socketIO.Server, authService: services.SocketAuthService) {
    this._io = io;
    this._authService = authService;
  }

  // This method handles the update of conversation participants and emits the update
  public async updateConv(conId: string, participantIds: models.Conversation.participantIds) {
    try {

      participantIds.forEach(userId => {
        const socketId = this._authService.getSocketIdByUserId(userId);
        if (socketId) {
          this._io.to(socketId).emit('conParticipantListUpdatedResponse', { conId, participantIds: participantIds });
        }
      });
    } catch (error) {
      console.error('Error emitting conversation participant update:', error);
    }
  }

  public registerConversationEvents(socket: socketIO.Socket): void {
    socket.on('updateParticipantListRequest', (conId: string, participantIds: models.Conversation.participantIds) => {
 
      this.updateConv(conId, participantIds);
    });
  }
}
