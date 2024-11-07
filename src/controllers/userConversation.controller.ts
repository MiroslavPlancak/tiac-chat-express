import * as express from 'express'
import * as db from '../config/db'
import * as models from '../models'

export const getUserIdsGroupedByConversation = async (req: express.Request, res: express.Response) => {
    try {
        const pool = await db.connectToDatabase()
        const result = await pool.request()
            .query('SELECT * FROM Users_Conversations')

        const usersConversations: { userId: string, conversationId: string }[] = result.recordset

        // Group userIds by conversationId
        const conversations: { [key: string]: { id: string, participantIds: string[] } } = {}

        usersConversations.forEach(({ userId, conversationId }) => {
            if (!conversations[conversationId]) {
                conversations[conversationId] = { id: conversationId, participantIds: [] }
            }
            conversations[conversationId].participantIds.push(userId)
        })

        // Convert the object to an array for response
        const conversationArray = Object.values(conversations)
        res.json(conversationArray)
    } catch (err) {
        console.error('Error retrieving grouped conversations:', err)
        res.status(500).json({ message: 'Error retrieving conversations.' })
    }
}

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

export const getUserIdsByConversationId = async (req: express.Request, res: express.Response) => {
    const { conversationId } = req.params
    try {
        const pool = await db.connectToDatabase() // request object
        const result = await pool.request()
            .input('ConversationId', conversationId)
            .query('SELECT * FROM Users_Conversations WHERE ConversationId = @ConversationId')
        const usersConversations: models.UserConversation[] = result.recordset
        const participantIds = await usersConversations.map( userConversation => userConversation.userId)
        res.json(usersConversations)
    } catch (err) {
        console.error('Error retrieving usersConversations:', err)
        res.status(500).json({ message: 'Error retrieving usersConversations.' })
    }
}

export const getParticipantsByConId = async (req: express.Request, res: express.Response) => {
    const { conversationId } = req.params;
    try {
        const pool = await db.connectToDatabase();
        const result = await pool.request()
            .query('SELECT * FROM Users_Conversations');

        const usersConversations: { userId: string, conversationId: string }[] = result.recordset;

        // Group userIds by conversationId
        const conversations: { [key: string]: { id: string, participantIds: string[] } } = {};

        usersConversations.forEach(({ userId, conversationId }) => {
            if (!conversations[conversationId]) {
                conversations[conversationId] = { id: conversationId, participantIds: [] };
            }
            conversations[conversationId].participantIds.push(userId);
        });

        // Check if the conversationId exists and return the relevant conversation
        const conversation = conversations[conversationId];
        if (conversation) {
            res.json(conversation);
        } else {
            res.json([])
            return;
        }
    } catch (err) {
        console.error('Error retrieving grouped conversations:', err);
        res.status(500).json({ message: 'Error retrieving conversations.' });
    }
};

