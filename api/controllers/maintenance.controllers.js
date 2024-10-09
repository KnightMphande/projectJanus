import { MaintenanceService } from "../services/maintenance.services.js";

export const createMaintenanceController = async (req, res) => {
  const userId = req.user;
  const role = req.role;

  try {
    if (role === "customer") {
      return res.status(400).json({ success: false, error: "Not allowed" });
    }

    const maintenanceData = req.body;

    //   Get Maintenance record by id
    const maintenanceRecord =
      await MaintenanceService.getMaintenanceByVehicleId(
        maintenanceData.vehicleId
      );

    if (maintenanceRecord) {
      return res.status(409).json({
        success: false,
        error: "Cannot same same vehicle more then once",
      });
    }
    const newMaintenance = await MaintenanceService.createMaintenance(
      maintenanceData
    );
    return res
      .status(201)
      .json({ success: true, message: "Successfully added", newMaintenance });
  } catch (error) {
    console.error("Error creating maintenance:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to create maintenance record." });
  }
};

export const getAllMaintenanceController = async (req, res) => {
  try {
    const maintenanceRecords = await MaintenanceService.getAllMaintenance();
    return res.status(200).json({ success: true, maintenanceRecords });
  } catch (error) {
    console.error("Error fetching maintenance records:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to fetch maintenance records." });
  }
};

export const getMaintenanceByIdController = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const maintenanceRecord = await MaintenanceService.getMaintenanceById(id);
    if (!maintenanceRecord) {
      return res
        .status(404)
        .json({ success: false, error: "Maintenance record not found." });
    }
    return res.status(200).json({ success: true, maintenanceRecord });
  } catch (error) {
    console.error("Error fetching maintenance record:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to fetch maintenance record." });
  }
};

export const deleteMaintenanceController = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const deleted = await MaintenanceService.deleteMaintenance(id);

    if (deleted) {
      return res
        .status(200)
        .json({ success: true, message: "Successfully deleted" });
    } else {
      return res.status(200).json({ success: false, error: "Deltion failed" });
    }
  } catch (error) {
    console.error("Error deleting maintenance record:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to delete maintenance record." });
  }
};

export const updateMaintenanceController = async (req, res) => {
  const id = parseInt(req.params.id);
  const updateData = req.body;
  try {
    // Get maintenance by id
    const maintenanceRecord = await MaintenanceService.getMaintenanceById(id);
    if (!maintenanceRecord) {
      return res
        .status(404)
        .json({ success: false, error: `No record found for id of ${id}` });
    }
    const updatedMaintenance = await MaintenanceService.updateMaintenance(
      id,
      updateData
    );
    return res
      .status(200)
      .json({
        success: true,
        message: "Successfully updated",
        updatedMaintenance,
      });
  } catch (error) {
    console.error("Error updating maintenance record:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to update maintenance record." });
  }
};
