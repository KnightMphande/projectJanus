import client from "../configs/db.configs.js";

export class vehicleService {
  /**
   * add new vehicle.
   * @param {object} vehicleData Contains vehicle information.
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

  /**
   * add vehicle details.
   * @param {object} vehicleDetails Contains vehicle information.
   * @returns {object} vehicle details.
   */
  static addVehicleDetails = async (vehicleDetails) => {
    try {
      // Destructure vehicle data
      const { vehicleId, color, numberOfSeats, mileage } = vehicleDetails;

      const query = `INSERT INTO vehicle_details (vehicle_id, color, number_seats, mileage) VALUES 
          ($1, $2, $3, $4) RETURNING *`;

      // Execute the query
      const result = await client.query(query, [
        vehicleId,
        color,
        numberOfSeats,
        mileage,
      ]);

      return result.rows[0];
    } catch (error) {
      console.error("Failed to add vehicle details:", error);
      throw error;
    }
  };

  /**
   * add vehicle features.
   * @param {object} vehicleFeatures Contains vehicle information.
   * @returns {object} vehicle features.
   */
  static addvehicleFeatures = async (vehicleFeatures) => {
    try {
      // Destructure vehicle data
      const {
        vehicleId,
        hasGPS,
        hasChildSeats,
        hasParkingSensors,
        hasAirConditioning,
        hasBlutooth,
      } = vehicleFeatures;

      const query = `INSERT INTO vehicle_features (vehicle_id, has_gps, has_child_seats, has_parking_sensors, has_air_conditioning, has_bluetooth) VALUES 
            ($1, $2, $3, $4, $5, $6) RETURNING *`;

      // Execute the query
      const result = await client.query(query, [
        vehicleId,
        hasGPS,
        hasChildSeats,
        hasParkingSensors,
        hasAirConditioning,
        hasBlutooth,
      ]);

      return result.rows[0];
    } catch (error) {
      console.error("Failed to add vehicle features:", error);
      throw error;
    }
  };

  /**
   * Get vehicle by id.
   * @param {id} vehicleId for for vehicle.
   * @returns {object} vehicle if found or null if not.
   */
  static async getVehicleById(id) {
    try {
      const query = "SELECT * FROM vehicles WHERE vehicle_id = $1;";

      // Execute the query
      const result = await client.query(query, [id]);

      return result.rows[0] || null;
    } catch (error) {
      console.log("Error fetching vehicle by id: ", error);
      throw error;
    }
  }

  /**
   * Get vehicle details by vehicle id.
   * @param {id} vehicleId for for vehicle.
   * @returns {object} vehicle details if found or null if not.
   */
  static async getVehicleDetailsById(id) {
    try {
      const query = "SELECT * FROM vehicle_details WHERE vehicle_id = $1;";

      // Execute the query
      const result = await client.query(query, [id]);

      return result.rows[0] || null;
    } catch (error) {
      console.log("Error fetching vehicle details by id: ", error);
      throw error;
    }
  }

  /**
   * Get vehicle features by vehicle id.
   * @param {id} vehicleId for for vehicle.
   * @returns {object} vehicle features if found or null if not.
   */
  static async getVehicleFeaturesById(id) {
    try {
      const query = "SELECT * FROM vehicle_features WHERE vehicle_id = $1;";

      // Execute the query
      const result = await client.query(query, [id]);

      return result.rows[0] || null;
    } catch (error) {
      console.log("Error fetching vehicle features by id: ", error);
      throw error;
    }
  }

  /**
   * Get vehicle features by vehicle id.
   * @param {id} vehicleId for for vehicle.
   * @returns {object} vehicle features if found or null if not.
   */
static async deleteVehicle(vehicleId) {
  try {
    const query = `DELETE FROM vehicles WHERE vehicle_id = $1;
`
    const result = await client.query(query, [vehicleId]);

     return result.rowCount > 0;
  } catch (error) {
    console.log("Error Error deleting vehicle: ", error);
    throw error;
  }
};
}
