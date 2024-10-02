import { AuthenticationService } from "../services/auth.services.js";
import { vehicleService } from "../services/vehicle.services.js";
import { DataValidation } from "../utils/validations.utils.js";

export const addNewVehicleController = async (req, res) => {
  // Access the userId and role from the req object
  const userId = req.user;
  const role = req.role;

  const vehicleData = req.body;
  try {
    // Check missing information
    const missingFieldsArr = DataValidation.checkMissingInfo(vehicleData);

    if (missingFieldsArr?.length > 0) {
      return res
        .status(400)
        .json({ success: false, error: `${missingFieldsArr[0]} is missing` });
    }

    if (role === "customer") {
      return res
        .status(400)
        .json({ success: false, error: "Not allowed to add vehicle" });
    }

    const user = await AuthenticationService.getUserById(userId, role);

    if (!user) {
      return res.status(404).json({ success: true, error: "User not found" });
    } else {
      const vehicleId = await vehicleService.addNewVehicle(vehicleData);

      if (vehicleId) {
        return res
          .status(201)
          .json({
            success: true,
            message: "Vehicle added successfully",
            vehicleId,
          });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

export const addVehicleDetailsController = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
  }
};
