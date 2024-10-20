import client from "../configs/db.configs.js";

export class ReportsService {
  //   Returns an array of the counts of the statuses
  static async getFleetReportCounts() {
    const query = `
            SELECT
                COUNT(CASE WHEN LOWER(status) = 'available' THEN 1 END) AS available_count,
                COUNT(CASE WHEN LOWER(status) = 'rented' THEN 1 END) AS booked_count,
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

  // Service to get customer activity reports
  static async getCustomerActivityReports() {
    try {
        const query = `
            SELECT c.customer_id, c.names, 
                   COUNT(b.booking_id) AS total_rented,
                   COUNT(CASE WHEN b.status = 'cancelled' THEN 1 END) AS total_cancelled,
                   COUNT(CASE WHEN b.check_in < CURRENT_DATE THEN 1 END) AS overdue_returns
            FROM customers c
            LEFT JOIN bookings b ON c.customer_id = b.customer_id
            GROUP BY c.customer_id
            ORDER BY c.customer_id;
        `;

        const result = await client.query(query);
        return result.rows;
    } catch (error) {
        console.error('Error retrieving customer activity reports:', error);
        throw new Error('Unable to fetch customer activity reports'); 
    }
};

// Service to get usage statistics
static async getUsageStatistics() {
    try {
        const query = `
            SELECT v.vehicle_id, v.make, v.model,
                   COUNT(b.booking_id) AS times_rented
            FROM vehicles v
            LEFT JOIN bookings b ON v.vehicle_id = b.vehicle_id
            GROUP BY v.vehicle_id
            ORDER BY times_rented DESC;
        `;

        const result = await client.query(query);
        return result.rows;
    } catch (error) {
        console.error('Error retrieving usage statistics:', error);
        throw new Error('Unable to fetch usage statistics'); 
    }
};
}
