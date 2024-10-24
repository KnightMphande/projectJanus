import client from "../configs/db.configs.js";
import { HelperFunc } from "../utils/helper.utils.js";

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

      console.log("Data from Controller Customer Booking: ", bookingData);
      

      const query = `
        INSERT INTO bookings 
        (customer_id, vehicle_id, check_out, check_in, pick_up_location, drop_off_location, amount, total_days, status) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
        RETURNING *;
      `;

          // Explicitly set to midnight UTC before saving check_out and check_in to the database
    const resettedCheckout = await HelperFunc.setToMidnightUTC(checkOut);
    const resettedCheckin = await HelperFunc.setToMidnightUTC(checkIn);

    // Add 1 day to both check-in and check-out
resettedCheckout.setDate(resettedCheckout.getDate() + 1);
resettedCheckin.setDate(resettedCheckin.getDate() + 1);

      const values = [
        customerId,
        vehicleId,
        resettedCheckout,
        resettedCheckin,
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
            b.amount,
            b.total_days,
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

  static async getHistoryBookingById(id) {
    try {
      const query = `SELECT * FROM booking_history WHERE booking_id = $1;`;
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
      !["confirmed", "completed", "in-progress", "cancelled", "rented"].includes(updatedBooking.status)
    ) {
      throw new Error(
        `Invalid status provided: ${updatedBooking.status}. Expected "confirmed" or "completed" or "in-progress".`
      );
    }

    try {
      const { status } =
        updatedBooking;

      const query = `
          UPDATE bookings 
          SET status = COALESCE($1, status)
          WHERE booking_id = $2
          RETURNING *;
        `;
      const values = [
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
        amount,
        total_days,
        damaged_image_url
      } = bookingData;

      const query = `
      INSERT INTO booking_history 
      (customer_id, booking_id, vehicle_id, check_out, check_in, pick_up_location, drop_off_location, status, amount, total_days, damaged_image_url) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
      RETURNING *;
    `;

    // Explicitly set to midnight UTC before saving check_out and check_in to the database
    const resettedCheckout = await HelperFunc.setToMidnightUTC(check_out);
    const resettedCheckin = await HelperFunc.setToMidnightUTC(check_in);

      const values = [
        customer_id,
        bookingId,
        vehicle_id,
        resettedCheckout,
        resettedCheckin,
        pick_up_location,
        drop_off_location,
        status,
        amount,
        total_days,
        damaged_image_url
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

  // BookingService.js
static async getBookingDates(vehicleId) {
  try {
    const query = `
      SELECT check_out, check_in
      FROM bookings
      WHERE vehicle_id = $1
    `;
    const result = await client.query(query, [vehicleId]);
    return result.rows; 
  } catch (error) {
    console.error("Error fetching booking dates:", error);
    throw error;
  }
}

}
