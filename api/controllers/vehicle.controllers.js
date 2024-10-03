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
        return res.status(201).json({
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
  const vehicleId = parseInt(req.params.vehicleId);
  const vehicleDetails = req.body;

  try {
    const vehicle = await vehicleService.getVehicleById(vehicleId);

   if(vehicle) {
    const vehicleDetailsFound = await vehicleService.getVehicleDetailsById(vehicleId);

    if(vehicleDetailsFound) {
      return res
      .status(409)
      .json({ success: false, error: "Cannot add different details for the same vehicle" });
    }
     // Add vehicle to object
     vehicleDetails.vehicleId = vehicleId;
    
     // Check missing information
     const missingFieldsArr = DataValidation.checkMissingInfo(vehicleDetails);
 
     if (missingFieldsArr?.length > 0) {
       return res
         .status(400)
         .json({ success: false, error: `${missingFieldsArr[0]} is missing` });
     }
 
     // Check if mileage is greater than 0
     if (vehicleDetails?.mileage < 0) {
       return res
         .status(400)
         .json({
           success: false,
           error: "Mileage has to be greater or equal to 0",
         });
     }
 
     // Add vehicle details
     const savedVehicleDetails = await vehicleService.addVehicleDetails(
       vehicleDetails
     );
 
     if (savedVehicleDetails) {
       return res
         .status(400)
         .json({
           success: true,
           message: "Vehicle saved successfully",
           details: savedVehicleDetails,
         });
     } else {
       return res
         .status(400)
         .json({ success: false, error: "Something went wrong" });
     }
   } else {
    return res
    .status(404)
    .json({ success: false, error: `No vehicle of id ${vehicleId} found` });
   }
  } catch (error) {
    console.log(error);
  }
};
