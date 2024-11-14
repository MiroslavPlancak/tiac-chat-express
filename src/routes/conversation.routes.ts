import * as router from 'express'
import * as controller from '../controllers/conversation.controller'
const routerObj = router.Router();

routerObj.get('/conversations/:userId', controller.getConversationsByUserId)
routerObj.get('/conversations/:id', controller.getConversationById)
routerObj.post('/conversations', controller.createConversation)
routerObj.put('/conversations/:id', controller.updateConversation)
routerObj.delete('/conversations/:id', controller.deleteConversation) 

export default routerObj