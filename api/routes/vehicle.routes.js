import express from "express";
import { verifyJwt } from "../middlewares/verifyJwt.middleware.js";
import { addNewVehicleController, addVehicleDetailsController, addVehicleFeaturesController, deleteVehicleController, getAllVehiclesController, getVehicleByIdController, updateVehicleController, updateVehicleDetailsController } from "../controllers/vehicle.controllers.js";
import { upload } from "../configs/multer.configs.js";

const vehicle_router = express.Router();

vehicle_router.get('/', getAllVehiclesController);
vehicle_router.get('/:vehicleId', getVehicleByIdController);

vehicle_router.use(verifyJwt)

vehicle_router.post('/', addNewVehicleController);
vehicle_router.post('/details/:vehicleId', upload.single('file'), addVehicleDetailsController);
vehicle_router.post('/features/:vehicleId', addVehicleFeaturesController);
vehicle_router.delete('/:vehicleId', deleteVehicleController);
vehicle_router.put('/:vehicleId', updateVehicleController);
vehicle_router.put('/details/:vehicleId', updateVehicleDetailsController);

export default vehicle_router;