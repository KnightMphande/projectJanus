import client from "../configs/db.configs.js";

export class BookingService {
  /**
   * make a booking.
   * @param {object} bookingData Contains information about the booking.
   * @returns {object} created booking details or null.
   */
  static async createBooking(bookingData) {
    try {
      const {
        customerId,
        vehicleId,
        checkOut,
        checkIn,
        pickUpLocation,
        dropOffLocation,
        status,
      } = bookingData;

      // Start a new transaction
      await client.query("BEGIN");

      const query = `
        INSERT INTO bookings 
        (customer_id, vehicle_id, check_out, check_in, pick_up_location, drop_off_location, status) 
        VALUES ($1, $2, $3, $4, $5, $6, $7) 
        RETURNING *;
      `;
      const values = [
        customerId,
        vehicleId,
        checkOut,
        checkIn,
        pickUpLocation,
        dropOffLocation,
        status,
      ];

      const result = await client.query(query, values);

      // Commit the transaction if successful
      await client.query("COMMIT");

      return result.rows[0] || null;
    } catch (error) {
      // Rollback the transaction in case of an error
      await client.query("ROLLBACK");

      console.error("Error creating a booking:", error);
      throw error;
    }
  }

  static async getAllBookings() {
    try {
      const query = `SELECT * FROM bookings;`;
      const { rows } = await client.query(query);
      return rows;
    } catch (error) {
      console.error("Error fetching bookings:", error);
      throw error;
    }
  }
}
