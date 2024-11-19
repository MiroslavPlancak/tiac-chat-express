import * as db from '../config/db'
import * as models from '../models'

/**
 * Updates the participants of a conversation by adding or removing participants.
 * @param conversationId - The unique identifier of the conversation.
 * @param participantIdsToAdd - The list of participant IDs to be added.
 * @param participantIdsToRemove - The list of participant IDs to be removed.
 * @returns {models.Conversation.ConWithParticipants} - The updated conversation with participants.
 */
export async function updateConversationParticipants(
  conversationId: string, 
  participantIdsToAdd?: string[], 
  participantIdsToRemove?: string[]
): Promise<models.Conversation.ConWithParticipants> {
  const pool = await db.connectToDatabase()

  // Add participants
  if (participantIdsToAdd) {
    for (const userId of participantIdsToAdd) {
      await pool.request()
        .input('UserId', userId)
        .input('ConversationId', conversationId)
        .query(`
          INSERT INTO Users_Conversations (userId, conversationId)
          VALUES (@UserId, @ConversationId)
        `)
    }
  }

  // Remove participants
  if (participantIdsToRemove) {
    for (const userId of participantIdsToRemove) {
      await pool.request()
        .input('UserId', userId)
        .input('ConversationId', conversationId)
        .query(`
          DELETE FROM Users_Conversations
          WHERE userId = @UserId AND conversationId = @ConversationId
        `)
    }
  }

  const updatedConversation = await pool.request()
    .input('ConversationId', conversationId)
    .query(`
      SELECT c.id, c.name,c.creatorId, uc.userId AS participantId
      FROM Conversations AS c
      LEFT JOIN Users_Conversations AS uc ON c.id = uc.conversationId
      WHERE c.id = @ConversationId
    `)

  const conversationWithParticipants: models.Conversation.ConWithParticipants = {
    id: updatedConversation.recordset[0].id,
    name: updatedConversation.recordset[0].name,
    participantIds: updatedConversation.recordset.map(row => row.participantId),
    creatorId: updatedConversation.recordset[0].creatorId
  }

  return conversationWithParticipants
}


export async function getUserIdsByConversationId(conId: string): Promise<string[]> {
  
  const pool = await db.connectToDatabase()
  
  const updatedParticipantIds = await pool.request()
  .input('ConversationId', conId)
  .query('SELECT userId FROM Users_Conversations WHERE conversationId = @ConversationId')
  const participantIds = updatedParticipantIds.recordset
  
  return participantIds.map(row => row.userId)
 
}


export async function getConversationNameByConId(conId: string): Promise<string> {
  const pool = await db.connectToDatabase()
  const foundConName = await pool.request()
  .input('conId', conId)
  .query('SELECT name FROM Conversations WHERE id = @conId')
  const conName = foundConName.recordset[0]?.name
  if (typeof conName !== 'string') {
    throw new Error(`Conversation name not found for conversation ID: ${conId}`);
  }
  return conName 
}
