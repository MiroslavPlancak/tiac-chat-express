import * as router from 'express'
import * as controller from '../controllers/auth.controller'

const routerObj = router.Router()

routerObj.post('/register', controller.registerUser);
routerObj.post('/login', controller.loginUser)
export default routerObj 
