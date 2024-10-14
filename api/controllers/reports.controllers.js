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
