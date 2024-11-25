import * as router from 'express'
import * as controller from '../controllers/auth.controller'

const routerObj = router.Router()

routerObj.post('/register', controller.registerUser);
routerObj.post('/login', controller.loginUser)
routerObj.post('/logout/:userId', controller.logoutUser)
routerObj.post('/refresh', controller.refreshToken)
export default routerObj 
