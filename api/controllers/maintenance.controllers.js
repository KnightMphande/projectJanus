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
      return res
        .status(409)
        .json({
          success: false,
          error: "Cannot same same vehicle more then once",
        });
    }
    const newMaintenance = await MaintenanceService.createMaintenance(maintenanceData);
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
