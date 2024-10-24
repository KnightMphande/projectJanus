import { BookingService } from "../services/booking.services.js";
import { InvoiceService } from "../services/invoice.services.js";
import { MaintenanceService } from "../services/maintenance.services.js";
import { ProfileService } from "../services/profile.services.js";
import { ReportsService } from "../services/reports.services.js";
import { VehicleService } from "../services/vehicle.services.js";

export const getFleetReports = async (req, res) => {
  try {
    const reportCounts = await ReportsService.getFleetReportCounts();
    return res.status(200).json({ success: true, data: reportCounts });
  } catch (error) {
    console.error("Error fetching fleet reports:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
};

export const getAllCustomersController = async (req, res) => {
  try {
    const customers = await ProfileService.getAllCustomers();

    return res.status(200).json({ success: true, customers })
    
  } catch (error) {
    console.error("Error updating drivers license:", error);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}

// Calculations Controller organize them and serve them (bookings, earnings, fleet, maintenance)
export const getCalculationsController = async (req, res) => {
  
  try {
    const vehiclesOnMaintenanceOrScheduled = await MaintenanceService.getAllMaintenance();
    const fleet = await VehicleService.getAllVehicles();
    const bookings = await BookingService.getAllBookings();
    const totalEarnings = await InvoiceService.getTotalEarnings();
    

    return res.status(200).json({ success: true, data: {
      bookings: bookings.length,
      earnings: totalEarnings,
      fleet: fleet.length,
      maintenance: vehiclesOnMaintenanceOrScheduled.length
    } })

  } catch (error) {
    console.error("Error fetch and performing calculations:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
}

// Controller to get customer activity reports
export const getCustomerActivityReportsController = async (req, res) => {
  console.log("Reached");
  
  try {
      const reports = await ReportsService.getCustomerActivityReports();
      return res.status(200).json({ success: true, reports });
  } catch (error) {
      return res.status(500).json({ success: false, error : 'Error retrieving customer activity reports'});
  }
};

// Controller to get usage statistics
export const getUsageStatisticsController = async (req, res) => {
  try {
      const stats = await ReportsService.getUsageStatistics();
      return res.status(200).json({ success: true, stats });
  } catch (error) {
      return res.status(500).json({ success: false, error: 'Error retrieving usage statistics' });
  }
};