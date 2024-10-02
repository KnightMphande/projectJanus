import express from "express";
import { loginController, registerCustomerController } from "../controllers/auth.controllers.js";

const auth_router = express.Router();

auth_router.post('/register', registerCustomerController);
auth_router.post('/login/:role', loginController);

export default auth_router;