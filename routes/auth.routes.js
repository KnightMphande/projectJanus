import express from "express";
import { registerCustomerController } from "../controllers/auth.controllers.js";

const auth_router = express.Router();

auth_router.post('/register', registerCustomerController);
auth_router.post('/login');

export default auth_router;