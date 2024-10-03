import { AuthenticationService } from "../services/auth.services.js";
import { vehicleService } from "../services/vehicle.services.js";
import { DataValidation } from "../utils/validations.utils.js";


// Add new vehicle to fleet
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
    console.error("Failed to add vehicle to the fleet: ", error);

    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// Add vehicle details
export const addVehicleDetailsController = async (req, res) => {
  const vehicleId = parseInt(req.params.vehicleId);
  const vehicleDetails = req.body;
  // Access the userId and role from the req object
  const userId = req.user;
  const role = req.role;

  try {
    if (role === "customer") {
      return res
        .status(400)
        .json({ success: false, error: "Not allowed to delete vehicle" });
    }
    const vehicle = await vehicleService.getVehicleById(vehicleId);

    if (vehicle) {
      const vehicleDetailsFound = await vehicleService.getVehicleDetailsById(
        vehicleId
      );

      if (vehicleDetailsFound) {
        return res
          .status(409)
          .json({
            success: false,
            error: "Cannot add different details for the same vehicle",
          });
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
        return res.status(400).json({
          success: false,
          error: "Mileage has to be greater or equal to 0",
        });
      }

      // Add vehicle details
      const savedVehicleDetails = await vehicleService.addVehicleDetails(
        vehicleDetails
      );

      if (savedVehicleDetails) {
        return res.status(400).json({
          success: true,
          message: "Vehicle details saved successfully",
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
    console.error("Failed to add vehicle details: ", error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// Add vehicle features
export const addVehicleFeaturesController = async (req, res) => {
  const vehicleId = parseInt(req.params.vehicleId);
  const vehicleFeatures = req.body;
  // Access the userId and role from the req object
  const userId = req.user;
  const role = req.role;

  try {
    if (role === "customer") {
      return res
        .status(400)
        .json({ success: false, error: "Not allowed to delete vehicle" });
    }
    const vehicle = await vehicleService.getVehicleById(vehicleId);

    if (vehicle) {
      const vehicleFeaturesFound = await vehicleService.getVehicleFeaturesById(
        vehicleId
      );

      if (vehicleFeaturesFound) {
        return res
          .status(409)
          .json({
            success: false,
            error: "Cannot add different features for the same vehicle",
          });
      }
      // Add vehicle to object
      vehicleFeatures.vehicleId = vehicleId;

      // Check missing information
      const missingFieldsArr = DataValidation.checkMissingInfo(vehicleFeatures);

      if (missingFieldsArr?.length > 0) {
        return res
          .status(400)
          .json({ success: false, error: `${missingFieldsArr[0]} is missing` });
      }

      // Add vehicle features
      const savedVehicleFeatures = await vehicleService.addvehicleFeatures(
        vehicleFeatures
      );

      if (savedVehicleFeatures) {
        return res.status(400).json({
          success: true,
          message: "Vehicle features saved successfully",
          details: savedVehicleFeatures,
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
    console.error("Failed to add vehicle features: ", error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// Delete a vehicle by ID
export const deleteVehicleController = async (req, res) => {
  const vehicleId = parseInt(req.params.vehicleId);

  // Access the userId and role from the req object
  const userId = req.user;
  const role = req.role;
  console.log(role);
  

  try {
    if (role === "customer") {
      return res
        .status(400)
        .json({ success: false, error: "Not allowed to delete vehicle" });
    }

    const vehicleDeleted = await vehicleService.deleteVehicle(vehicleId);
    if (!vehicleDeleted) {
      return res
        .status(404)
        .json({
          success: false,
          error: `Vehicle with ID ${vehicleId} not found.`,
        });
    }
    return res
      .status(200)
      .json({ success: true, message: `Vehicle with successfully deleted.` });
  } catch (error) {
    console.error("Failed to delete vehicle: ", error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// Update vehicle 
export const updateVehicleController = async (req, res) => {
  try {
    
  } catch (error) {
    console.error("Failed to update vehicle: ", error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
}