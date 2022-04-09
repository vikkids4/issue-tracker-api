import express from "express"
// import { login } from '../controllers/AuthController.js'
import { signUp, login } from '../controllers/AuthController.js'

export const AuthRoutes = express.Router();

AuthRoutes.post('/signup', signUp)
AuthRoutes.post('/login', login)
