import express from "express";
import { verifyJwt } from "../middlewares/verifyJwt.middleware.js";
import { addNewVehicleController } from "../controllers/vehicle.controllers.js";

const vehicle_router = express.Router();

vehicle_router.use(verifyJwt)

vehicle_router.post('/add-vehicle', addNewVehicleController);

export default vehicle_router;