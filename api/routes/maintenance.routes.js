import express from "express";
import { verifyJwt } from "../middlewares/verifyJwt.middleware.js";
import { createMaintenanceController, deleteMaintenanceController, getAllMaintenanceController, getMaintenanceByIdController, updateMaintenanceController } from "../controllers/maintenance.controllers.js";

const maintenance_router = express.Router();

maintenance_router.use(verifyJwt);

maintenance_router.post('/', createMaintenanceController);
maintenance_router.get('/', getAllMaintenanceController);
maintenance_router.get('/:id', getMaintenanceByIdController);
maintenance_router.put('/:id', updateMaintenanceController);
maintenance_router.delete('/:id', deleteMaintenanceController);

export default maintenance_router;