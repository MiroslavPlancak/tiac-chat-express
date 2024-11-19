// socket.con.service.ts
import * as socketIO from 'socket.io'
import * as models from '../models'
import * as services from './socket.auth.service'
import * as utils from '../utilities/conversation-utils'

export class SocketConService {
  private _ioServer: socketIO.Server
  private _authService: services.SocketAuthService

  constructor(ioServer: socketIO.Server, authService: services.SocketAuthService) {
    this._ioServer = ioServer
    this._authService = authService
  }

  /**This method handles the notification of addition of participants to the conversation */
  public async notifyParticipantsOfAddion(conId: string) {
    try {
      const currentConParticipants = await utils.getUserIdsByConversationId(conId)
      const conversationName = await utils.getConversationNameByConId(conId)

      //notify all current participants of the addition
      //including the added one/s
      currentConParticipants.forEach(userId => {
        const participantSocketId = this._authService.getSocketIdByUserId(userId)
        if (participantSocketId) {
          this._ioServer.to(participantSocketId).emit('conParticipantListUpdatedResponse', { conId, name: conversationName, participantIds: currentConParticipants })
        }
      })
    } catch (error) {
      console.error('Error emitting conversation participant update:', error)
    }
  }
  /**This method handles the notification of removal of the participants from the conversation */
  public async notifyParticipantsOfRemoval(conId: string, participantIds: models.Conversation.ConWithParticipants) {
    try {
      const removedParticipantId = participantIds?.participantIdsToRemove
      const currentConParticipants = await utils.getUserIdsByConversationId(conId)

      //notify the client that he has been removed from the conversation
      removedParticipantId?.forEach(userId => {
        const participantSocketId = this._authService.getSocketIdByUserId(userId)
        if (participantSocketId) {
          this._ioServer.to(participantSocketId).emit('conParticipantRemovedResponse', conId)
        }
      })

      //notify the remaining participants in that conversation of that removal
      currentConParticipants?.forEach(userId => {
        const participantSocketId = this._authService.getSocketIdByUserId(userId)
        if (participantSocketId) {
          this._ioServer.to(participantSocketId).emit('conParticipantListUpdatedResponse', { conId, participantIds: currentConParticipants })
        }
      })
    } catch (error) {
      console.error('Error emitting conversation participant update:', error)
    }
  }
  /**This method handles the notification of updating the client about being added to a new conversation */
  public async notifyAddedClientOfNewConversation(
    con: models.Conversation.ConWithParticipants,
    addedParticipantsId: models.User.id[]
  ) 
  {
    try {
      const addedParticipantSocketId = this._authService.getSocketIdByUserId(addedParticipantsId[1])
      const conWithParticipants: models.Conversation.ConWithParticipants = {
        id: con.id,
        name: con.name,
        createdAt: con.createdAt,
        participantIds: [...addedParticipantsId],
      }
      //notify added participant of private conversation creation
      if (addedParticipantSocketId) {
        this._ioServer.to(addedParticipantSocketId).emit('privateConversationCreatedResponse', conWithParticipants)
      }
    } catch (error) {
      console.error('Error emitting conversation participant update:', error)
    }
  }

  public async notifyClientsOfDeletedConversation(deletedConversation: models.Conversation.ConWithParticipants) {
    try{
     
      const participantIdsToNotify = deletedConversation.participantIds
      participantIdsToNotify.forEach(participantId =>{
        const participantSocketId = this._authService.getSocketIdByUserId(participantId)
        if (participantSocketId) {
          this._ioServer.to(participantSocketId).emit('deleteCoversationResponse', deletedConversation)
        }
      })
    }catch(error){
      console.error('Error emitting conversation participant update:', error)
    }
  }

  public registerConversationEvents(socket: socketIO.Socket): void {
    /**
     * This request method determines whether we will notify the client of addition
     * or removal of participants in a given conversation.
     */
    socket.on('updateConParticipantListRequest', (conId: string, participantIds: models.Conversation.ConWithParticipants) => {
      if (participantIds.participantIdsToAdd) {
        this.notifyParticipantsOfAddion(conId)
      } else {
        this.notifyParticipantsOfRemoval(conId, participantIds)
      }
    })
    /**
     * This request method simply forwards the payload to the notifier method.
     */
    socket.on('updateParticipantOfPrivateConCreationRequest',
      (
        con: models.Conversation.ConWithParticipants,
        addedParticipantsId: models.User.id[]
      ) => {
        this.notifyAddedClientOfNewConversation(con, addedParticipantsId)
      })
    /**
      * This request method forwards the payload to the notifier method
      */
    socket.on('deleteCoversationRequest',(deletedConversation: models.Conversation.ConWithParticipants)=>{
      this.notifyClientsOfDeletedConversation(deletedConversation)
    })
  }


}
