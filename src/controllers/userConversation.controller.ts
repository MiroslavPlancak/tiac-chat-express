import * as express from 'express'
import * as db from '../config/db'
import * as models from '../models'

/**
 * Get all {@link models.UserConversation} [] objects of a specific user {@link models.User.id} id.
 *  @param {string} userId - The unique identifier of the user.
 */
export const getUsersConversationsByUserId = async (req: express.Request, res: express.Response) => {
    const { userId } = req.params
    try {
        const pool = await db.connectToDatabase() // request object
        const result = await pool.request()
            .input('UserId', userId)
            .query('SELECT * FROM Users_Conversations WHERE UserId = @UserId')
        const usersConversations: models.UserConversation[] = result.recordset
        res.json(usersConversations)
    } catch (err) {
        console.error('Error retrieving usersConversations:', err)
        res.status(500).json({ message: 'Error retrieving usersConversations.' })
    }
}
/**
 * Get all {@link models.UserConversation} [] objects for a specific conversation  {@link models.Conversation.id} id.
 *  @param {string} conversationId - The unique identifier for the conversation.
 */

export const getUsersConversationsByConversationId = async (req: express.Request, res: express.Response) => {
    const { conversationId } = req.params
    try {
        const pool = await db.connectToDatabase() // request object
        const result = await pool.request()
            .input('ConversationId', conversationId)
            .query('SELECT * FROM Users_Conversations WHERE ConversationId = @ConversationId')
        const usersConversations: models.UserConversation[] = result.recordset
        res.json(usersConversations)
    } catch (err) {
        console.error('Error retrieving usersConversations:', err)
        res.status(500).json({ message: 'Error retrieving usersConversations.' })
    }
}