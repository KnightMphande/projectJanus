import { ProfileService } from "../services/profile.services.js";
import { ReportsService } from "../services/reports.services.js";

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