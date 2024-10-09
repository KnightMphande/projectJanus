import express from "express";
import { verifyJwt } from "../middlewares/verifyJwt.middleware.js";

const maintenance_router = express.Router();

maintenance_router.use(verifyJwt);

maintenance_router.post('/');
maintenance_router.get('/');
maintenance_router.get('/:id');
maintenance_router.put('/:id');
maintenance_router.delete('/:id');

export default maintenance_router;