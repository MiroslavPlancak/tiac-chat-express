import * as express from 'express'
import * as db from '../config/db'
import * as models from '../models'

/**
 * Get all {@link models.Message}[] objects from the database.
 */
export const getMessages = async (req: express.Request, res: express.Response) => {
    try {
        const pool = await db.connectToDatabase() // request object
        const result = await pool.query('SELECT * FROM Messages')
        const messages: models.Message[] = result.recordset
        res.json(messages)
    } catch (err) {
        console.error('Error retrieving messages:', err)
        res.status(500).json({ message: 'Error retrieving messages.' })
    }
}
/**
 * Get a specific {@link models.Message} object by unique string identifier.
 * @param {string} id - The unique identifier of the Message to retrieve.
 * @returns {Promise<void>} - Sends the Message data as JSON or an error response.
 */
export const getMessageById = async (req: express.Request, res: express.Response): Promise<void> => {
    const { id } = req.params
    try {
        const pool = await db.connectToDatabase()
        const request = pool.request()  // request object

        // input parameter
        request.input('id', id)


        const result = await request.query('SELECT * FROM Messages WHERE id = @id')
        const message: models.Message | undefined = result.recordset[0]

        if (result.recordset.length === 0) {
             res.status(404).json({ message: 'Message not found' })
        }

        res.json(message)
    } catch (err) {
        console.error('Error retrieving Message:', err)
        res.status(500).json({ message: 'Error retrieving Message' })
    }
}
/**
 * Get a specific {@link models.Message} object/s by unique string identifier of {@link models.Conversation.id}.
 * @param {string} id - The unique identifier of the Message to retrieve.
 * @returns {Promise<void>} - Sends the Message data as JSON or an error response.
 */
export const getMessagesByConversationId = async (req: express.Request, res: express.Response): Promise<void> => {
    const { id } = req.params
    try {
        const pool = await db.connectToDatabase()
        const request = pool.request()  // request object

        // input parameter
        request.input('id', id)


        const result = await request.query('SELECT * FROM Messages WHERE conversationId = @id')
        const message: models.Message[] | []= result.recordset
        
        if (result.recordset.length === 0) {
             res.json([])
             return;
        }

        res.json(message)
    } catch (err) {
        console.error('Error retrieving Message:', err)
        res.status(500).json({ message: 'That conversationId does not exist.' })
    }
}
/**
 * Create a new {@link models.Message} object via a POST request.
 * 
 * @param {express.Request} req - The request object containing the Message data.
 * @param {express.Response} res - The response object used to send the response.
 * @returns {Promise<void>} - A Promise that resolves when the Message is created successfully or an error response is returned.
 */
export const createMessage = async (req: express.Request, res: express.Response): Promise<void> => {
    const newMessage = req.body
    try {
        const pool = await db.connectToDatabase()
        const result = await pool.request()
            .input('messageBody', newMessage.messageBody)
            .input('conversationId', newMessage.conversationId)
            .input('userId', newMessage.userId)
            .query(`
                INSERT INTO Messages (messageBody, conversationId, userId)
                 OUTPUT inserted.*
                  VALUES (@messageBody, @conversationId, @userId)
                  `)
        
        const createdMessage: models.Message = result.recordset[0]

        if (!createdMessage) {
            throw new Error('Message creation failed')
        }
        res.status(201).json(createdMessage)
    } catch (err) {
        console.error('Error creating Message:', err)
        res.status(500).json({ message: 'Error creating Message' })
    }
};
/**
 * Update an existing {@link models.Message} object via a PUT request.
 *
 * @param {string} id - The unique identifier of the message to update.
 * @param {express.Request} req - The request object containing the updated message data.
 * @param {express.Response} res - The response object used to send the response.
 * @returns {Promise<void>} - A Promise that resolves when the message is updated successfully or an error response is returned.
 */
export const updateMessage= async (req: express.Request, res: express.Response): Promise<void> => {
    const { id } = req.params
    const updatedMessage = req.body

    try {
        const pool = await db.connectToDatabase()
        const result = await pool.request()
            .input('Id', id)
            .input('messageBody', updatedMessage.messageBody)
            .query(`
                UPDATE Messages 
                SET MessageBody = @MessageBody 
                OUTPUT inserted.* 
                WHERE Id = @Id
            `)

        const message: models.Message= result.recordset[0]

        if (!message) {
             res.status(404).json({ message: 'Message not found or update failed' })
        }

        res.status(200).json(message) // Return the updated message
    } catch (err) {
        console.error('Error updating message:', err)
        res.status(500).json({ message: 'Error updating message' })
    }
};
/**
 * Delete an existing {@link models.Message} object via a DELETE request.
 *
 * @param {string} id - The unique identifier of the message to delete.
 * @param {express.Request} req - The request object containing the message ID to delete.
 * @param {express.Response} res - The response object used to send the response.
 * @returns {Promise<void>} - A Promise that resolves when the message is deleted successfully or an error response is returned.
 */
export const deleteMessage = async (req: express.Request, res: express.Response): Promise<void> => {
    const { id } = req.params

    try {
        const pool = await db.connectToDatabase()
        const result = await pool.request()
            .input('Id', id)
            .query(`
                DELETE FROM Messages 
                OUTPUT deleted.* 
                WHERE Id = @Id
            `)

        const deletedMessage: models.Message = result.recordset[0]

        if (!deletedMessage) {
             res.status(404).json({ message: 'Message not found or already deleted' })
        }

        res.status(200).json({ message: 'Message deleted successfully', deletedMessage: deletedMessage })
    } catch (err) {
        console.error('Error deleting message:', err)
        res.status(500).json({ message: 'Error deleting message' })
    }
};
