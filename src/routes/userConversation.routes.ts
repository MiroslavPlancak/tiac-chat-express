import * as router from 'express'
import * as controller from '../controllers/userConversation.controller'

const routerObj = router.Router();
routerObj.get('/conversationsList/:userId', controller.getUsersConversationsByUserId)
routerObj.get('/conversationParticipants/:conversationId', controller.getUsersConversationsByConversationId)

export default routerObj