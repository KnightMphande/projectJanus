import client from "../configs/db.configs.js";

export class ReportsService {
  //   Returns an array of the counts of the statuses
  static async getFleetReportCounts() {
    const query = `
            SELECT
                COUNT(CASE WHEN LOWER(status) = 'available' THEN 1 END) AS available_count,
                COUNT(CASE WHEN LOWER(status) = 'booked' THEN 1 END) AS booked_count,
                COUNT(CASE WHEN LOWER(status) = 'maintenance' THEN 1 END) AS maintenance_count,
                COUNT(CASE WHEN LOWER(status) = 'out of service' THEN 1 END) AS out_of_service_count
            FROM vehicles
        `;

    try {
      const result = await client.query(query);
      const counts = result.rows[0];
      return [
        counts.available_count || 0,
        counts.booked_count || 0,
        counts.maintenance_count || 0,
        counts.out_of_service_count || 0,
      ];
    } catch (error) {
      throw new Error("Failed to fetch fleet report counts");
    }
  }
}
