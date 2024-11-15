import * as express from 'express'
import * as db from '../config/db'
import * as models from '../models'
import * as utils from '../utilities/conversation-utils'
import mssql from 'mssql';



/**
 * Get all {@link models.Conversation}[] objects from the database.
 */
export const getConversationsByUserId = async (req: express.Request, res: express.Response): Promise<void> => {
    const { userId } = req.params;
    try {
        const pool = await db.connectToDatabase();
        
        // Step 1: Retrieve conversation IDs for the user
        const conversationIdsResult = await pool.request()
            .input('UserId', userId)
            .query('SELECT conversationId FROM Users_Conversations WHERE UserId = @UserId');
        
        const conversationIds = conversationIdsResult.recordset.map(record => record.conversationId);

        if (conversationIds.length === 0) {
            res.json([]); // No conversations for the user
            return;
        }

     

        // Step 2: Retrieve the full conversation details for each conversation ID
        const conversationsResult = await pool.request()
            .input('id', mssql.VarChar(mssql.MAX), conversationIds.join(',')) // Convert array to comma-separated string
            .query(`
                SELECT * FROM Conversations 
                WHERE id IN (SELECT value FROM STRING_SPLIT(@id, ','))
            `);

        const conversations = conversationsResult.recordset;

        // Step 3: Send the conversations as a JSON response
        res.json(conversations);

    } catch (err) {
        console.error('Error retrieving conversations:', err);
        res.status(500).json({ message: 'Error retrieving conversations.' });
    }
};

/**
 * Get a specific {@link models.Conversation} object by unique string identifier.
 * @param {string} id - The unique identifier of the user to retrieve.
 * @returns {Promise<void>} - Sends the user data as JSON or an error response.
 */
export const getConversationById = async (req: express.Request, res: express.Response): Promise<void> => {
    const { id } = req.params
    try {
        const pool = await db.connectToDatabase()
        const request = pool.request()  // request object

        // input parameter
        request.input('id', id)


        const result = await request.query('SELECT * FROM Conversations WHERE id = @id')
        const conversation: models.Conversation.Con | undefined = result.recordset[0]

        if (result.recordset.length === 0) {
            res.status(404).json({ message: 'Conversation not found' })
        }

        res.json(conversation)
    } catch (err) {
        console.error('Error retrieving conversation:', err)
        res.status(500).json({ message: 'Error retrieving conversation' })
    }
}
/**
 * Create a new {@link models.Conversation} object via a POST request.
 * 
 * @param {express.Request} req - The request object containing the user data.
 * @param {express.Response} res - The response object used to send the response.
 * @returns {Promise<void>} - A Promise that resolves when the user is created successfully or an error response is returned.
 */
export const createConversation = async (req: express.Request, res: express.Response): Promise<void> => {
    const newConvPayload = req.body
    console.log(`second participant id is:`, newConvPayload.participantIds[1])
    try {
        const pool = await db.connectToDatabase()

        // Find user object 
        const findUser = await pool.request()
            .input('Id', newConvPayload.participantIds[1])
            .query('SELECT * FROM Users WHERE Id =@id ')
        console.log(`findUser`, findUser.recordset)
        if (!findUser.recordset.length) {
            throw new Error('Participant not found.')
        }
        //Assign the name of the conversation
        //based on the first participant added
        const conversationName = findUser.recordset[0].name
        const createConv = await pool.request()
            .input('Name', conversationName)
            .query('INSERT INTO Conversations (Name) OUTPUT inserted.* VALUES (@Name)')
        // Retrieve the created conversation object
        const createdConversation: models.Conversation.Con = createConv.recordset[0]

        if (!createdConversation) {
            throw new Error('Conversation creation failed')
        }

        // Add entries to relational table for each participantId
        // under the newly generated conversationId
        for (const userId of newConvPayload.participantIds) {
            await pool.request()
                .input('UserId', userId)
                .input('ConversationId', createdConversation.id)
                .query('INSERT INTO Users_Conversations (userId, conversationId) VALUES (@UserId, @ConversationId)')
        }

        if (!createdConversation) {
            throw new Error('Conversation creation failed')
        }
        res.status(201).json(createdConversation)
    } catch (err) {
        console.error('Error creating conversation:', err)
        res.status(500).json({ message: 'Error creating conversation' })
    }
}
/**
 * Update an existing {@link models.Conversation} object via a PUT request.
 *
 * @param {string} id - The unique identifier of the user to update.
 * @param {express.Request} req - The request object containing the updated user data.
 * @param {express.Response} res - The response object used to send the response.
 * @returns {Promise<void>} - A Promise that resolves when the user is updated successfully or an error response is returned.
 */
export const updateConversation = async (req: express.Request, res: express.Response): Promise<void> => {
    const { id } = req.params;
    const payload = req.body;
  
    try {
      // Update conversation participants (reusing the utility function)
      const updatedConversation = await utils.updateConversationParticipants(
        id, 
        payload.participantIdsToAdd, 
        payload.participantIdsToRemove
      );
  
      res.status(200).json(updatedConversation);
    } catch (err) {
      console.error('Error updating Conversation:', err);
      res.status(500).json({ message: 'Error updating Conversation' });
    }
  };
/**
 * Delete an existing {@link models.Conversation} object via a DELETE request.
 *
 * @param {string} id - The unique identifier of the user to delete.
 * @param {express.Request} req - The request object containing the user ID to delete.
 * @param {express.Response} res - The response object used to send the response.
 * @returns {Promise<void>} - A Promise that resolves when the user is deleted successfully or an error response is returned.
 */
export const deleteConversation = async (req: express.Request, res: express.Response): Promise<void> => {
    const { id } = req.params

    try {
        const pool = await db.connectToDatabase()
        const result = await pool.request()
            .input('id', id)
            .query(`
                DELETE FROM Conversations 
                OUTPUT deleted.* 
                WHERE id = @id
            `)

        const deletedConversation: models.Conversation.Con = result.recordset[0]

        if (!deletedConversation) {
            res.status(404).json({ message: 'Conversation not found or already deleted' })
        }

        res.status(200).json({ message: 'Conversation deleted successfully', conversation: deletedConversation })
    } catch (err) {
        console.error('Error deleting conversation:', err)
        res.status(500).json({ message: 'Error deleting conversation' })
    }
}


