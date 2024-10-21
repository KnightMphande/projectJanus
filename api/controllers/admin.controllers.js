import { AdminService } from "../services/admin.services.js";

// Create employee
export const createEmployeeController = async (req, res) => {
    try {
        const { names, phone, email, password, role } = req.body;
        const newEmployee = await AdminService.createEmployee(names, phone, email, password, role);
        return res.status(201).json({ success: true, message: "Employee successfully added", newEmployee });
    } catch (error) {
      console.error("Failed to create n employee: ", error);
  
      return res
        .status(500)
        .json({ success: false, error: "Internal Server Error" });
    }
  };
  
  // Get all employees
  export const getAllEmployeesController = async (req, res) => {
    try {
        const employees = await AdminService.getAllEmployees();
        return res.status(200).json({ success: true, employees });
    } catch (error) {
      console.error("Failed to get all employees: ", error);
  
      return res
        .status(500)
        .json({ success: false, error: "Internal Server Error" });
    }
  };
  
  // Get employee by ID
  export const getEmployeeByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const employee = await AdminService.getEmployeeById(id);
        if (!employee) {
            return res.status(404).json({ success: false, error: 'Employee not found' });
        }
        return res.status(200).json({ success: true, employee });
    } catch (error) {
      console.error("Failed to get an employee by id: ", error);
  
      return res
        .status(500)
        .json({ success: false, error: "Internal Server Error" });
    }
  };
  
  // Update employee
  export const updateEmployeeController = async (req, res) => {
    try {
        const { id } = req.params;
        const { names, phone, email, password, role, logo_url } = req.body;
        const updatedEmployee = await AdminService.updateEmployee(id, names, phone, email, password, role, logo_url);
        return res.status(200).json({ success: true, message: "Successfully updated", updatedEmployee });
    } catch (error) {
      console.error("Failed to update an employee: ", error);
  
      return res
        .status(500)
        .json({ success: false, error: "Internal Server Error" });
    }
  };
  
  // Delete employee
  export const deleteEmployeeController = async (req, res) => {
    try {
        const { id } = req.params;
        await AdminService.deleteEmployee(id);
        res.status(204).json({ success: true, message: 'Employee deleted' });
    } catch (error) {
      console.error("Failed to delete an employee: ", error);
  
      return res
        .status(500)
        .json({ success: false, error: "Internal Server Error" });
    }
  };
  