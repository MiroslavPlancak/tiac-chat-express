import * as router from 'express'
import * as controller from '../controllers/user.controller'

const routerObj = router.Router()

routerObj.get('/users',controller.getUsers)
routerObj.get('/users/:id', controller.getUserById)
routerObj.post('/users', controller.createUser)
routerObj.put('/users/:id', controller.updateUser)
routerObj.delete('/users/:id', controller.deleteUser) 

export default routerObj 
