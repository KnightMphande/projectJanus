import { AdminService } from "../services/admin.services.js";
import { HelperFunc } from "../utils/helper.utils.js";

// Create employee
export const createEmployeeController = async (req, res) => {
    try {
        const { names, phone, email } = req.body;

        console.log(req.body);
        

        const password = "Employee@123";
        const hashedPassword = await HelperFunc.hashFunc(password);

        const role = "employee";

        const newEmployee = await AdminService.createEmployee(names, phone, email, hashedPassword, role);
        return res.status(201).json({ success: true, message: "Employee successfully added", newEmployee });
    } catch (error) {
      console.error("Failed to create an employee: ", error);
  
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


// Get all damages
export const getAllDamagesController = async (req, res) => {
  try {
      const damages = await AdminService.getAllDamages();
      return res.status(200).json({ success: true, damages });
  } catch (error) {
    console.log("Error fetching damages: ", error);
    
      return res.status(500).json({ success: false, error: "Internal Server Error"});
  }
};

// Get damage by ID
export const getDamageByIdController = async (req, res) => {
  try {
      const damage = await AdminService.getDamageById(req.params.id);
      if (!damage) {
          return res.status(404).json({ success: false, error: 'Damage not found' });
      }
      return res.status(200).json({ success: true, damage });
  } catch (error) {
    console.log("Error fetching damage: ", error);
      return res.status(500).json({ message: error.message });
  }
};

// Create a new damage
export const createDamageController = async (req, res) => {
  try {
      const newDamage = await AdminService.createDamage(req.body);
      return res.status(201).json({ success: true, message: "Successfully created damaged", newDamage });
  } catch (error) {
    console.log("Error creating damage: ", error);
      return res.status(400).json({ success: false, error: "Internal Server Error" });
  }
};

// Update damage by ID
export const updateDamageController = async (req, res) => {
  try {
      const updatedDamage = await AdminService.updateDamage(req.params.id, req.body);
      if (!updatedDamage) {
          return res.status(404).json({ success: false, error: 'Damage not found' });
      }
      res.status(200).json(updatedDamage);
  } catch (error) {
    console.log("Error updating damage: ", error);
      return res.status(400).json({ success: false, error: "Internal Server Error" });
  }
};

// Delete damage by ID
export const deleteDamageController = async (req, res) => {
  try {
      const deletedDamage = await AdminService.deleteDamage(req.params.id);
      if (!deletedDamage) {
          return res.status(404).json({ success: false, error: 'Damage not found' });
      }
      return res.status(204).json({ success: true, message: "Successfully deleted damage" });
  } catch (error) {
    console.log("Error deleting damage: ", error);
      return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
  