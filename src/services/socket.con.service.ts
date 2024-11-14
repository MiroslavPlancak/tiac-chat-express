// socket.con.service.ts
import * as socketIO from 'socket.io';
import * as models from '../models';
import * as services from './socket.auth.service';
import * as utils from '../utilities/conversation-utils';

export class SocketConService {
  private _io: socketIO.Server;
  private _authService: services.SocketAuthService;

  constructor(io: socketIO.Server, authService: services.SocketAuthService) {
    this._io = io;
    this._authService = authService;
  }

  // This method handles the update of conversation participants and emits the update
  public async notifyParticipantsOfAddion(conId: string, participantIds: models.Conversation.ConWithParticipants) {
    try {
      console.log(`updateConv`, participantIds)
      const currentConParticipants = await utils.getUserIdsByConversationId(conId)
      console.log(`updateconv/currentConParticipants`, currentConParticipants)
      //emit to all current participants of the update 
      //including the added one/s
      currentConParticipants.forEach(userId => {
        const participantSocketId = this._authService.getSocketIdByUserId(userId);
        if (participantSocketId) {
          this._io.to(participantSocketId).emit('conParticipantListUpdatedResponse', { conId, participantIds: currentConParticipants });
        }
      });
    } catch (error) {
      console.error('Error emitting conversation participant update:', error);
    }
  }
  public async notifyParticipantsOfRemoval(conId: string, participantIds: models.Conversation.ConWithParticipants){
    try {
  
      //emit message to the participant that 
      //has been removed from conversation
      const removedParticipantId = participantIds?.participantIdsToRemove
      const currentConParticipants = await utils.getUserIdsByConversationId(conId)

      //notify the remaining participants in the conversation of the removal
      currentConParticipants?.forEach(userId => {
        const participantSocketId = this._authService.getSocketIdByUserId(userId);
        if (participantSocketId) {
          
          this._io.to(participantSocketId).emit('conParticipantListUpdatedResponse', { conId, participantIds: currentConParticipants });
        }
      });
      //notify the participant who got removed
      removedParticipantId?.forEach(userId => {
        const participantSocketId = this._authService.getSocketIdByUserId(userId);
        if (participantSocketId) {
          //this needs to emit to a different method, that method needs to pick it up and update the conList properly on front end
          this._io.to(participantSocketId).emit('conParticipantRemovedResponse', conId );
        }
      });
      
    } catch (error) {
      console.error('Error emitting conversation participant update:', error);
    }
  }
  public registerConversationEvents(socket: socketIO.Socket): void {
    socket.on('updateParticipantListRequest', (conId: string, participantIds: models.Conversation.ConWithParticipants) => {
      console.log(`register:`, participantIds)
      if(participantIds.participantIdsToAdd){
        this.notifyParticipantsOfAddion(conId, participantIds);
      }else{
        this.notifyParticipantsOfRemoval(conId, participantIds)
      } 
      
    });
  }
}
