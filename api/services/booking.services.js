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
        amount,
        totalDays,
        status,
      } = bookingData;

      // Start a new transaction
      await client.query("BEGIN");

      const query = `
        INSERT INTO bookings 
        (customer_id, vehicle_id, check_out, check_in, pick_up_location, drop_off_location, amount, total_days, status) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
        RETURNING *;
      `;
      const values = [
        customerId,
        vehicleId,
        checkOut,
        checkIn,
        pickUpLocation,
        dropOffLocation,
        amount,
        totalDays,
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
      const query = `
        SELECT 
            b.booking_id,
            b.customer_id,
            b.vehicle_id,
            b.check_out,
            b.check_in,
            b.pick_up_location,
            b.drop_off_location,
            b.status,
            b.created_at,
            v.make,
            v.model,
            v.year,
            v.category,
            vi.filename AS filename
        FROM bookings b
        JOIN vehicles v ON b.vehicle_id = v.vehicle_id
        LEFT JOIN vehicle_images vi ON v.vehicle_id = vi.vehicle_id;
      `;
      const result = await client.query(query);

      return result.rows;
    } catch (error) {
      console.error("Error fetching bookings:", error);
      throw error;
    }
  }

  static async getBookingById(id) {
    try {
      const query = `SELECT * FROM bookings WHERE booking_id = $1;`;
      const result = await client.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error("Error fetching a single booking:", error);
      throw error;
    }
  }

  static async deleteBooking(id) {
    try {
      const query = `DELETE FROM bookings WHERE booking_id = $1 RETURNING *;`;
      const result = await client.query(query, [id]);

      return result.rows[0];
    } catch (error) {
      console.error("Error deleting booking:", error);
      throw error;
    }
  }

  /**
   * update booking details.
   * @param {id} bookingId for the booking.
   * @param {object} updatedBooking Contains updated booking details information.
   * @returns {object} updated booking or null.
   */
  static async updateBooking(id, updatedBooking) {
    // Validate status input
    if (
      !["confirmed", "completed", "in-progress", "canceled"].includes(updatedBooking.status)
    ) {
      throw new Error(
        `Invalid status provided: ${updatedBooking.status}. Expected "confirmed" or "completed" or "in-progress".`
      );
    }

    try {
      const { checkOut, checkIn, pickUpLocation, dropOffLocation, status } =
        updatedBooking;
      const query = `
          UPDATE bookings 
          SET check_out = COALESCE($1, check_out),
              check_in = COALESCE($2, check_in),
              pick_up_location = COALESCE($3, pick_up_location),
              drop_off_location = COALESCE($4, drop_off_location),
              status = COALESCE($5, status)
          WHERE booking_id = $6
          RETURNING *;
        `;
      const values = [
        checkOut,
        checkIn,
        pickUpLocation,
        dropOffLocation,
        status,
        id,
      ];
      const result = await client.query(query, values);

      return result.rows[0] || null;
    } catch (error) {
      console.error("Error updating booking:", error);
      throw error;
    }
  }

  static async moveBookingToHistory(bookingId, bookingData) {
    // Validate status input
    if (!["completed", "cancelled"].includes(bookingData.status)) {
      throw new Error(
        `Invalid status provided: ${bookingData.status}. Expected "completed" or cancelled`
      );
    }

    try {
      const {
        customer_id,
        vehicle_id,
        check_out,
        check_in,
        pick_up_location,
        drop_off_location,
        status,
      } = bookingData;

      const query = `
      INSERT INTO booking_history 
      (customer_id, booking_id, vehicle_id, check_out, check_in, pick_up_location, drop_off_location, status) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
      RETURNING *;
    `;

      const values = [
        customer_id,
        bookingId,
        vehicle_id,
        check_out,
        check_in,
        pick_up_location,
        drop_off_location,
        status,
      ];

      const result = await client.query(query, values);

      return result.rows[0] || null;
    } catch (error) {
      console.error("Error moving booking to history:", error);
      throw error;
    }
  }

  static async getLocations() {
    try {
      const query = `SELECT location_id, location, address FROM locations;`;

      const result = await client.query(query);

      return result.rows;
    } catch (error) {
      console.log("Error fetching locations: ", error);

      throw error;
    }
  }
}
