import express from "express";
import { verifyJwt } from "../middlewares/verifyJwt.middleware.js";
import { createDamageController, createEmployeeController, 
    deleteDamageController, 
    deleteEmployeeController, 
    getAllDamagesController, 
    getAllEmployeesController, 
    getDamageByIdController, 
    getEmployeeByIdController, 
    updateDamageController, 
    updateEmployeeController 
} from "../controllers/admin.controllers.js";

const admin_router = express.Router();

admin_router.use(verifyJwt);

// Admin routes for employees
admin_router.post('/employees/', createEmployeeController); 
admin_router.get('/employees/', getAllEmployeesController); 
admin_router.get('/employees/:id', getEmployeeByIdController);
admin_router.put('/employees/:id', updateEmployeeController); 
admin_router.delete('/employees/:id', deleteEmployeeController);

// Damages
admin_router.get('/damages/', getAllDamagesController);
admin_router.get('/damages/:id', getDamageByIdController);
admin_router.post('/damages/', createDamageController);
admin_router.put('/damages/:id', updateDamageController);
admin_router.delete('/damages/:id', deleteDamageController);

export default admin_router;