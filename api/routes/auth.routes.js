import express from "express";
import { loginController, logoutController, registerCustomerController } from "../controllers/auth.controllers.js";

const auth_router = express.Router();

auth_router.post('/signup', registerCustomerController);
auth_router.post('/signin', loginController);
auth_router.get('/signout', logoutController); 

export default auth_router;