import express from "express";
import { verifyJwt } from "../middlewares/verifyJwt.middleware.js";
import { createEmployeeController, 
    deleteEmployeeController, 
    getAllEmployeesController, 
    getEmployeeByIdController, 
    updateEmployeeController 
} from "../controllers/admin.controllers.js";

const admin_router = express.Router();

admin_router.use(verifyJwt);

// Admin routes for employees
admin_router.post('/', createEmployeeController); 
admin_router.get('/', getAllEmployeesController); 
admin_router.get('/:id', getEmployeeByIdController);
admin_router.put('/:id', updateEmployeeController); 
admin_router.delete('/:id', deleteEmployeeController);

export default admin_router;