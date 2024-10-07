import express from "express";
import { loginController, registerCustomerController } from "../controllers/auth.controllers.js";

const auth_router = express.Router();

auth_router.post('/signup', registerCustomerController);
auth_router.post('/signin/:role', loginController);

export default auth_router;