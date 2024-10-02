import client from "../configs/db.configs.js";

export class vehicleService {
  /**
   * add new vehicle.
   * @param {object} vehicleDetails Contains vehicle information.
   * @returns {number} vehicle id.
   */
  static addNewVehicle = async (vehicleData) => {
    try {
      // Destructure vehicle data
      const { make, model, year, category, status } = vehicleData;

      const query = `INSERT INTO vehicles (make, model, year, category, status) VALUES 
        ($1, $2, $3, $4, $5) RETURNING vehicle_id`;

      // Execute the query
      const result = await client.query(query, [
        make,
        model,
        year,
        category.toLowerCase(),
        status.toLowerCase(),
      ]);

      return result.rows[0].vehicle_id;
    } catch (error) {
      console.error("Failed to add new vehicle:", error);
      throw error;
    }
  };
}
