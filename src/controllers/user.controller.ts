import * as express from 'express'
import * as db from '../config/db'
import * as models from '../models'

/**
 * Get all {@link models.User}[] objects from the database.
 */
export const getUsers = async (req: express.Request, res: express.Response) => {
    try {
        const pool = await db.connectToDatabase() // request object
        const result = await pool.query('SELECT * FROM Users')
        const users: models.User[] = result.recordset
        //console.log(users)
        res.json(users)
    } catch (err) {
        console.error('Error retrieving users:', err)
        res.status(500).json({ message: 'Error retrieving users.' })
    }
}
/**
 * Get a specific {@link models.User} object by unique string identifier.
 * @param {string} id - The unique identifier of the user to retrieve.
 * @returns {Promise<void>} - Sends the user data as JSON or an error response.
 */
export const getUserById = async (req: express.Request, res: express.Response): Promise<void> => {
    const { id } = req.params
    try {
        const pool = await db.connectToDatabase()
        const request = pool.request()  // request object

        // input parameter
        request.input('id', id)


        const result = await request.query('SELECT * FROM Users WHERE id = @id')
        const user: models.User | undefined = result.recordset[0]

        if (result.recordset.length === 0) {
             res.status(404).json({ message: 'User not found' })
        }

        res.json(user)
    } catch (err) {
        console.error('Error retrieving user:', err)
        res.status(500).json({ message: 'Error retrieving user' })
    }
}
/**
 * Create a new {@link models.User} object via a POST request.
 * 
 * @param {express.Request} req - The request object containing the user data.
 * @param {express.Response} res - The response object used to send the response.
 * @returns {Promise<void>} - A Promise that resolves when the user is created successfully or an error response is returned.
 */
export const createUser = async (req: express.Request, res: express.Response): Promise<void> => {
    const newUser = req.body
    try {
        const pool = await db.connectToDatabase()
        const result = await pool.request()
            .input('Name', newUser.name)
            .query('INSERT INTO Users (Name) OUTPUT inserted.* VALUES (@Name)')
        
        const createdUser: models.User = result.recordset[0]

        if (!createdUser) {
            throw new Error('User creation failed')
        }
        res.status(201).json(createdUser)
    } catch (err) {
        console.error('Error creating user:', err)
        res.status(500).json({ message: 'Error creating user' })
    }
};
/**
 * Update an existing {@link models.User} object via a PUT request.
 *
 * @param {string} id - The unique identifier of the user to update.
 * @param {express.Request} req - The request object containing the updated user data.
 * @param {express.Response} res - The response object used to send the response.
 * @returns {Promise<void>} - A Promise that resolves when the user is updated successfully or an error response is returned.
 */
export const updateUser = async (req: express.Request, res: express.Response): Promise<void> => {
    const { id } = req.params
    const updatedUser = req.body

    try {
        const pool = await db.connectToDatabase()
        const result = await pool.request()
            .input('Id', id)
            .input('Name', updatedUser.name)
            .query(`
                UPDATE Users 
                SET Name = @Name 
                OUTPUT inserted.* 
                WHERE Id = @Id
            `)

        const user: models.User = result.recordset[0]

        if (!user) {
             res.status(404).json({ message: 'User not found or update failed' })
        }

        res.status(200).json(user) // Return the updated user
    } catch (err) {
        console.error('Error updating user:', err)
        res.status(500).json({ message: 'Error updating user' })
    }
};
/**
 * Delete an existing {@link models.User} object via a DELETE request.
 *
 * @param {string} id - The unique identifier of the user to delete.
 * @param {express.Request} req - The request object containing the user ID to delete.
 * @param {express.Response} res - The response object used to send the response.
 * @returns {Promise<void>} - A Promise that resolves when the user is deleted successfully or an error response is returned.
 */
export const deleteUser = async (req: express.Request, res: express.Response): Promise<void> => {
    const { id } = req.params

    try {
        const pool = await db.connectToDatabase()
        const result = await pool.request()
            .input('Id', id)
            .query(`
                DELETE FROM Users 
                OUTPUT deleted.* 
                WHERE Id = @Id
            `)

        const deletedUser: models.User = result.recordset[0]

        if (!deletedUser) {
             res.status(404).json({ message: 'User not found or already deleted' })
        }

        res.status(200).json({ message: 'User deleted successfully', user: deletedUser })
    } catch (err) {
        console.error('Error deleting user:', err)
        res.status(500).json({ message: 'Error deleting user' })
    }
};
