import express from "express"
import {fetchUsers} from "../controllers/UserController.js";
// import {signUp} from '../controllers/userController.js'

export const UserRoutes = express.Router();


// userRoutes.get('/', keyCloak.protect('admin'), getUser)
// userRoutes.get('/', getUser)
// UserRoutes.post('/signup', signUp)

UserRoutes.get('/internals', fetchUsers)
