import express from "express";
import { verifyJwt } from "../middlewares/verifyJwt.middleware.js";
import { createMaintenanceController, getAllMaintenanceController, getMaintenanceByIdController } from "../controllers/maintenance.controllers.js";
import { getBookingByIdController } from "../controllers/booking.controllers.js";

const maintenance_router = express.Router();

maintenance_router.use(verifyJwt);

maintenance_router.post('/', createMaintenanceController);
maintenance_router.get('/', getAllMaintenanceController);
maintenance_router.get('/:id', getMaintenanceByIdController);
maintenance_router.put('/:id');
maintenance_router.delete('/:id');

export default maintenance_router;