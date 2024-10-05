import client from "../configs/db.configs.js";

export class vehicleService {
  /**
   * add new vehicle.
   * @param {object} vehicleData Contains vehicle information.
   * @returns {object} vehicle.
   */
  static addNewVehicle = async (vehicleData) => {
    try {
      // Destructure vehicle data
      const { make, model, year, category, status } = vehicleData;

      const query = `INSERT INTO vehicles (make, model, year, category, status) VALUES 
        ($1, $2, $3, $4, $5) RETURNING *`;

      // Start a new transaction
      await client.query("BEGIN");

      // Execute the query
      const result = await client.query(query, [
        make,
        model,
        year,
        category.toLowerCase(),
        status.toLowerCase(),
      ]);

      // Commit the transaction if successful
      await client.query("COMMIT");

      return result.rows[0] || null;
    } catch (error) {
      // Rollback the transaction in case of an error
      await client.query("ROLLBACK");

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

      // Start a new transaction
      await client.query("BEGIN");

      // Execute the query
      const result = await client.query(query, [
        vehicleId,
        color,
        numberOfSeats,
        mileage,
      ]);

      // Commit the transaction if successful
      await client.query("COMMIT");

      return result.rows[0];
    } catch (error) {
      // Rollback the transaction in case of an error
      await client.query("ROLLBACK");

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

      // Start a new transaction
      await client.query("BEGIN");

      // Execute the query
      const result = await client.query(query, [
        vehicleId,
        hasGPS,
        hasChildSeats,
        hasParkingSensors,
        hasAirConditioning,
        hasBlutooth,
      ]);

      // Commit the transaction if successful
      await client.query("COMMIT");

      return result.rows[0];
    } catch (error) {
      // Rollback the transaction in case of an error
      await client.query("ROLLBACK");

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
`;

      // Start a new transaction
      await client.query("BEGIN");
      const result = await client.query(query, [vehicleId]);

      // Commit the transaction if successful
      await client.query("COMMIT");

      return result.rowCount > 0;
    } catch (error) {
      // Rollback the transaction in case of an error
      await client.query("ROLLBACK");

      console.log("Error Error deleting vehicle: ", error);
      throw error;
    }
  }

  /**
   * update vehicle.
   * @param {id} vehicleId for for vehicle.
   * @param {object} vehicleData Contains vehicle information.
   * @returns {object} updated vehicle or null.
   */
  static async updateVehicle(vehicleId, vehicleData) {
    try {
      // Destructure vehicle data
      const { make, model, year, category, status } = vehicleData;

      // Start a new transaction
      await client.query("BEGIN");

      const query = `
        UPDATE vehicles
        SET make = $2, model = $3, year = $4, category = $5, status = $6
        WHERE vehicle_id = $1
        RETURNING *;
      `;

      // Commit the transaction if successful
      await client.query("COMMIT");

      const result = await client.query(query, [
        vehicleId,
        make,
        model,
        year,
        category,
        status,
      ]);

      return result.rows[0] || null;
    } catch (error) {
      // Rollback the transaction in case of an error
      await client.query("ROLLBACK");

      console.error("Error updating vehicle:", error);
      throw error;
    }
  }

  /**
   * update vehicle details.
   * @param {id} vehicleId for for vehicle.
   * @param {object} vehicleDetails Contains vehicle details information.
   * @returns {object} updated vehicle details or null.
   */
  static async updateVehicleDetails(vehicleId, vehicleDetails) {
    try {
      // Destructure vehicle data
      const { color, numberOfSeats, mileage } = vehicleDetails;

      // Start a new transaction
      await client.query("BEGIN");

      const query = `
        UPDATE vehicle_details
        SET color = $2, number_seats = $3, mileage = $4
        WHERE vehicle_id = $1
        RETURNING *;
      `;

      const result = await client.query(query, [
        vehicleId,
        color,
        numberOfSeats,
        mileage,
      ]);

      // Commit the transaction if successful
      await client.query("COMMIT");

      return result.rows[0] || null;
    } catch (error) {
      // Rollback the transaction in case of an error
      await client.query("ROLLBACK");

      console.error("Error updating vehicle details:", error);
      throw error;
    }
  }
}
