import * as router from 'express'
import * as controller from '../controllers/message.controller'

const routerObj = router.Router();

routerObj.get('/messages', controller.getMessages)
routerObj.get('/messages/:id', controller.getMessageById)
routerObj.post('/messages', controller.createMessage)
routerObj.put('/messages/:id', controller.updateMessage)
routerObj.delete('/messages/:id', controller.deleteMessage)

export default routerObj