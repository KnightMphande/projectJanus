import client from "../configs/db.configs.js";

export class VehicleService {
  /**
   * add new vehicle.
   * @param {object} vehicleData Contains vehicle information.
   * @returns {object} vehicle.
   */
  static addNewVehicle = async (vehicleData) => {
    try {
      // Destructure vehicle data
      const { make, model, year, category, price, status } = vehicleData;

      const query = `INSERT INTO vehicles (make, model, year, category, price, status) VALUES 
        ($1, $2, $3, $4, $5, $6) RETURNING *`;

      // Start a new transaction
      await client.query("BEGIN");

      // Execute the query
      const result = await client.query(query, [
        make,
        model,
        year,
        category.toLowerCase(),
        price,
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
  static async addvehicleFeatures(vehicleFeatures) {
    try {
      // Destructure vehicle data
      const {
        vehicleId,
        hasGPS,
        hasChildSeats,
        hasParkingSensors,
        hasAirConditioning,
        hasBluetooth,
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
        hasBluetooth,
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
  }

  static async addVehicleImage(id, fileData) {
    try {
      // Destructure file details
      const { filename, path, size, mimetype } = fileData;

      const query = `INSERT INTO vehicle_images (vehicle_id, filename, path, size, mimetype) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING *`;

      // Start a new transaction
      await client.query("BEGIN");

      const result = await client.query(query, [
        id,
        filename,
        path,
        size,
        mimetype,
      ]);

      // Commit the transaction if successful
      await client.query("COMMIT");

      return result.rows[0];
    } catch (error) {
      // Rollback the transaction in case of an error
      await client.query("ROLLBACK");

      console.error("Failed to add vehicle image:", error);
      throw error;
    }
  }

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
      const { price, status } = vehicleData;
      
      // Start a new transaction
      await client.query("BEGIN");

      const query =
        price === null
          ? ` UPDATE vehicles
        SET status = $1
        WHERE vehicle_id = $2
        RETURNING *;`
          : `
        UPDATE vehicles
        SET price = $1, status = $2
        WHERE vehicle_id = $3
        RETURNING *;
      `;

      // Commit the transaction if successful
      await client.query("COMMIT");

      const values =
        price === null ? [status, vehicleId] : [price, status, vehicleId];

      const result = await client.query(query, values);

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
   * @param {id} vehicleId for vehicle.
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

  static async getAllVehicles() {
    try {
      const query = `SELECT 
      v.vehicle_id,
      v.make, 
      v.model, 
      v.year, 
      v.category,
      v.status, 
      v.price,
      vi.filename, 
      vi.path, 
      vd.color, 
      vd.number_seats, 
      vd.mileage, 
      CASE 
          WHEN vf.has_gps THEN jsonb_build_object('GPS', true)
          ELSE jsonb_build_object('GPS', false) 
      END AS gps,
      CASE 
          WHEN vf.has_child_seats THEN jsonb_build_object('Child Seats', true)
          ELSE jsonb_build_object('Child Seats', false)
      END AS child_seats,
      CASE 
          WHEN vf.has_parking_sensors THEN jsonb_build_object('Parking Sensors', true)
          ELSE jsonb_build_object('Parking Sensors', false)
      END AS parking_sensors,
      CASE 
          WHEN vf.has_air_conditioning THEN jsonb_build_object('Air Conditioning', true)
          ELSE jsonb_build_object('Air Conditioning', false)
      END AS air_conditioning,
      CASE 
          WHEN vf.has_bluetooth THEN jsonb_build_object('Bluetooth', true)
          ELSE jsonb_build_object('Bluetooth', false)
      END AS bluetooth
  FROM 
      vehicles v
  LEFT JOIN 
      vehicle_images vi ON v.vehicle_id = vi.vehicle_id
  LEFT JOIN 
      vehicle_details vd ON v.vehicle_id = vd.vehicle_id
  LEFT JOIN 
      vehicle_features vf ON v.vehicle_id = vf.vehicle_id
  ORDER BY 
      v.vehicle_id;
  `;

      const result = await client.query(query);

      return result.rows;
    } catch (error) {
      console.error("Error get vehicles:", error);
      throw error;
    }
  }

  static async getAllVehicleInfoById(id) {
    try {
      const query = `
      SELECT 
          v.vehicle_id,
          v.make, 
          v.model, 
          v.year, 
          v.category,
          v.status, 
          v.price,
          vi.filename, 
          vi.path, 
          vd.color, 
          vd.number_seats, 
          vd.mileage, 
          CASE 
              WHEN vf.has_gps THEN jsonb_build_object('GPS', true)
              ELSE jsonb_build_object('GPS', false) 
          END AS gps,
          CASE 
              WHEN vf.has_child_seats THEN jsonb_build_object('Child Seats', true)
              ELSE jsonb_build_object('Child Seats', false)
          END AS child_seats,
          CASE 
              WHEN vf.has_parking_sensors THEN jsonb_build_object('Parking Sensors', true)
              ELSE jsonb_build_object('Parking Sensors', false)
          END AS parking_sensors,
          CASE 
              WHEN vf.has_air_conditioning THEN jsonb_build_object('Air Conditioning', true)
              ELSE jsonb_build_object('Air Conditioning', false)
          END AS air_conditioning,
          CASE 
              WHEN vf.has_bluetooth THEN jsonb_build_object('Bluetooth', true)
              ELSE jsonb_build_object('Bluetooth', false)
          END AS bluetooth,
          b.booking_id,
          b.check_out,
          b.check_in,
          b.pick_up_location,
          b.drop_off_location,
          b.amount,
          b.total_days,
          b.status AS booking_status
      FROM 
          vehicles v
      LEFT JOIN 
          vehicle_images vi ON v.vehicle_id = vi.vehicle_id
      LEFT JOIN 
          vehicle_details vd ON v.vehicle_id = vd.vehicle_id
      LEFT JOIN 
          vehicle_features vf ON v.vehicle_id = vf.vehicle_id
      LEFT JOIN 
          bookings b ON v.vehicle_id = b.vehicle_id
      WHERE 
          v.vehicle_id = $1
      ORDER BY 
          v.vehicle_id;
  `;
  

      const result = await client.query(query, [id]);

      return result.rows[0];
    } catch (error) {
      console.error("Error get vehicles:", error);
      throw error;
    }
  }
}
