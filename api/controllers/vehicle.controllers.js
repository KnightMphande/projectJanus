import { AuthenticationService } from "../services/auth.services.js";
import { VehicleService } from "../services/vehicle.services.js";
import { DataValidation } from "../utils/validations.utils.js";
import path from "path";
import fs from "fs";
import { BookingService } from "../services/booking.services.js";

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
      const vehicle = await VehicleService.addNewVehicle(vehicleData);

      if (vehicle) {
        return res.status(201).json({
          success: true,
          message: "Vehicle added successfully",
          vehicle,
        });
      }
    }
  } catch (error) {
    console.error("Failed to add vehicle to the fleet: ", error);

    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
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
    const vehicle = await VehicleService.getVehicleById(vehicleId);

    if (vehicle) {
      const vehicleDetailsFound = await VehicleService.getVehicleDetailsById(
        vehicleId
      );

      if (vehicleDetailsFound) {
        return res.status(409).json({
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

      // Check if the car has an image
      if (!req.file) {
        return res
          .status(400)
          .json({ success: false, error: "No file uploaded." });
      }

      // Image of the car: metadata
      const fileDetails = {
        filename: req.file.filename,
        path: req.file.path,
        size: req.file.size,
        mimetype: req.file.mimetype,
      };

      // Add vehicle details
      const savedVehicleDetails = await VehicleService.addVehicleDetails(
        vehicleDetails
      );

      if (savedVehicleDetails) {
        // After car has be saved, then save the image metadata to database
        const imageData = await VehicleService.addVehicleImage(
          vehicleId,
          fileDetails
        );

        const details = Object.assign({}, savedVehicleDetails, imageData);

        return res.status(200).json({
          success: true,
          message: "Vehicle details saved successfully",
          details,
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
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
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

    const vehicle = await VehicleService.getVehicleById(vehicleId);

    if (vehicle) {
      const vehicleFeaturesFound = await VehicleService.getVehicleFeaturesById(
        vehicleId
      );

      if (vehicleFeaturesFound) {
        return res.status(409).json({
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
      const savedVehicleFeatures = await VehicleService.addvehicleFeatures(
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
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
};

// Delete a vehicle by ID
export const deleteVehicleController = async (req, res) => {
  const vehicleId = parseInt(req.params.vehicleId);

  // Access the userId and role from the req object
  const userId = req.user;
  const role = req.role;

  try {
    if (role === "customer") {
      return res
        .status(400)
        .json({ success: false, error: "Not allowed to delete vehicle" });
    }

    // Get the directory path for the vehicle images
    const uploadDir = path.join("uploads/vehicles", `car-${vehicleId}`);

    // Check if the directory exists
    if (fs.existsSync(uploadDir)) {
      // Remove the entire directory and its contents
      fs.rm(uploadDir, { recursive: true, force: true }, (err) => {
        if (err) {
          console.error(`Failed to delete directory ${uploadDir}: `, err);
          return res
            .status(500)
            .json({ success: false, error: "Failed to delete vehicle files" });
        }
      });
    }

    const vehicleDeleted = await VehicleService.deleteVehicle(vehicleId);
    if (!vehicleDeleted) {
      return res.status(404).json({
        success: false,
        error: `Vehicle with ID ${vehicleId} not found.`,
      });
    }
    return res
      .status(200)
      .json({ success: true, message: `Vehicle with successfully deleted.` });
  } catch (error) {
    console.error("Failed to delete vehicle: ", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
};

// Update vehicle
export const updateVehicleController = async (req, res) => {
  const vehicleId = parseInt(req.params.vehicleId);
  const vehicleData = req.body;

  // Access the userId and role from the req object
  const userId = req.user;
  const role = req.role;

  try {
    if (role === "customer") {
      return res
        .status(400)
        .json({ success: false, error: "Not allowed to delete vehicle" });
    }

    const vehicle = await VehicleService.getVehicleById(vehicleId);

    if (!vehicle) {
      return res.status(400).json({
        success: false,
        error: `Vehicle of id ${vehicleId} not found`,
      });
    }

    const updatedVehicle = await VehicleService.updateVehicle(
      vehicleId,
      vehicleData
    );

    if (updatedVehicle) {
      return res.status(200).json({
        success: true,
        message: "Vehicle updated successfully.",
        vehicle: updatedVehicle,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found.",
      });
    }
  } catch (error) {
    console.error("Failed to update vehicle: ", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
};

// Update vehicle details
export const updateVehicleDetailsController = async (req, res) => {
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

    const vehicle = await VehicleService.getVehicleById(vehicleId);

    if (!vehicle) {
      return res.status(400).json({
        success: false,
        error: `Vehicle of id ${vehicleId} not found`,
      });
    }

    const updatedVehicleDetails = await VehicleService.updateVehicleDetails(
      vehicleId,
      vehicleDetails
    );

    if (updatedVehicleDetails) {
      return res.status(200).json({
        success: true,
        message: "Vehicle updated successfully.",
        vehicleDetails: updatedVehicleDetails,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found.",
      });
    }
  } catch (error) {
    console.error("Failed to update vehicle details: ", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
};

// Get all vehicles controller
export const getAllVehiclesController = async (req, res) => {
  try {
    const vehicles = await VehicleService.getAllVehicles();

    // Use Promise.all to wait for all asynchronous operations to complete
    const vehiclesWithBookingDates = await Promise.all(
      vehicles.map(async (vehicle) => {
        const dates = await BookingService.getBookingDates(vehicle.vehicle_id);
        // Add the dates to the vehicle object
        return { ...vehicle, dates };
      })
    );

    // console.log(vehiclesWithBookingDates);
    
    return res
      .status(200)
      .json({ success: true, vehicles: vehiclesWithBookingDates });
  } catch (error) {
    console.error("Failed to fetch all vehicles: ", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
};

export const getVehicleByIdController = async (req, res) => {
  const vehicleId = parseInt(req.params.vehicleId);
  try {
    const vehicle = await VehicleService.getAllVehicleInfoById(vehicleId);

    const dates = await BookingService.getBookingDates(vehicleId);

    vehicle.dates = dates;

    return res.status(200).json({ success: true, vehicle });
  } catch (error) {
    console.error("Failed to fetch vehicle: ", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
};
