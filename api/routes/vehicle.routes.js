import express from "express";
import { verifyJwt } from "../middlewares/verifyJwt.middleware.js";
import { addNewVehicleController, addVehicleDetailsController, addVehicleFeaturesController } from "../controllers/vehicle.controllers.js";

const vehicle_router = express.Router();

vehicle_router.use(verifyJwt)

vehicle_router.post('/add-vehicle', addNewVehicleController);
vehicle_router.post('/vehicle-details/:vehicleId', addVehicleDetailsController);
vehicle_router.post('/vehicle-features/:vehicleId', addVehicleFeaturesController);

export default vehicle_router;