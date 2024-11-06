import * as router from 'express'
import * as controller from '../controllers/userConversation.controller'

const routerObj = router.Router();
routerObj.get('/usersConversations', controller.getUserIdsGroupedByConversation)
routerObj.get('/conversationsList/:userId', controller.getUsersConversationsByUserId)
routerObj.get('/conversationParticipants/:conversationId', controller.getUserIdsByConversationId)
routerObj.get('/participantsByConId/:conversationId', controller.getParticipantsByConId)

export default routerObj