import client from "../configs/db.configs.js";
import { HelperFunc } from "../utils/helper.utils.js";
import { VehicleService } from "./vehicle.services.js";

export class ProfileService {
  // Get user information by customer ID
  static async getCustomerInfo(customerId) {
    try {
      const result = await client.query(
        `SELECT * FROM customers WHERE customer_id = $1`,
        [customerId]
      );

      const { password: pass, ...rest } = result.rows[0];
      return rest;
    } catch (error) {
      console.error("Error fetching user information:", error);
      throw new Error("Failed to get user information");
    }
  }

  // Get driver's license information by customer ID
  static async getUserDriversLicense(customerId) {
    try {
      const result = await client.query(
        `SELECT license_number, issue_date, expiry_date FROM drivers_license WHERE customer_id = $1`,
        [customerId]
      );
      return result.rows[0] || {};
    } catch (error) {
      console.error("Error fetching driver's license information:", error);
      throw new Error("Failed to get driver's license information");
    }
  }

  // Get current bookings for the customer
  static async getCustomerCurrentBookings(customerId) {
    try {
      const result = await client.query(
        `SELECT * FROM bookings WHERE customer_id = $1 AND status IN ('confirmed', 'in-progress')`,
        [customerId]
      );
      return result.rows;
    } catch (error) {
      console.error("Error fetching current bookings:", error);
      throw new Error("Failed to get current bookings");
    }
  }

  // Get booking history for the customer
  static async getCustomerHistoryBookings(customerId) {
    try {
      const result = await client.query(
        `SELECT * FROM booking_history WHERE customer_id = $1`,
        [customerId]
      );
      return result.rows;
    } catch (error) {
      console.error("Error fetching booking history:", error);
      throw new Error("Failed to get booking history");
    }
  }

  // Get invoice details for a specific booking
  static async getBookingInvoice(bookingId) {
    try {
      const result = await client.query(
        `SELECT * FROM invoices WHERE booking_id = $1`,
        [bookingId]
      );
      return result.rows[0];
    } catch (error) {
      console.error("Error fetching booking invoice:", error);
      throw new Error("Failed to get booking invoice");
    }
  }

  // Get vehicle details by vehicle ID
  static async getVehicleDetails(vehicleId) {
    try {
      const result = await client.query(
        `SELECT v.*, vi.filename 
         FROM vehicles v
         LEFT JOIN vehicle_images vi ON v.vehicle_id = vi.vehicle_id
         WHERE v.vehicle_id = $1`,
        [vehicleId]
      );
      return result.rows[0];
    } catch (error) {
      console.error("Error fetching vehicle details:", error);
      throw new Error("Failed to get vehicle details");
    }
  }

  // Get the full customer profile by combining various services
  static async getCustomerProfile(customerId) {
    try {
      // Fetch user details
      const userDetails = await this.getCustomerInfo(customerId);
      if (!userDetails) {
        throw new Error("User not found");
      }

      // Fetch driver's license details
      const driversLicenseDetails = await this.getUserDriversLicense(
        customerId
      );

      // Fetch current bookings
      const currentBookings = await this.getCustomerCurrentBookings(customerId);

      // Fetch booking history
      const bookingHistory = await this.getCustomerHistoryBookings(customerId);

      const allVehicles = await VehicleService.getAllVehicles();

      const combinedCurrentBookings =
        await HelperFunc.combineBookingWithVehicle(
          currentBookings,
          allVehicles
        );
      const combinedHistoryBookings =
        await HelperFunc.combineBookingWithVehicle(bookingHistory, allVehicles);

      return {
        user: userDetails,
        driversLicense: driversLicenseDetails,
        currentBookings: combinedCurrentBookings,
        bookingHistory: combinedHistoryBookings,
      };
    } catch (error) {
      console.error("Error retrieving customer profile:", error);
      throw new Error("Failed to get customer profile");
    }
  }

  // Update profile service
  static async updateProfileService(id, data) {
    const { names, address, phone, profilePic } = data;

    try {
      const query = `
        UPDATE customers
        SET names = $1, address = $2, phone = $3, logo_url = $4
        WHERE customer_id = $5
        RETURNING *;
      `;
      const values = [names, address, phone, profilePic, id];

      const result = await client.query(query, values);

      // Return the updated profile data
      return result.rows[0];
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  }

  // Update profile service
  static async updateDriversLicense(id, data) {
    const { licenseNumber, issueDate, expiryDate} = data;

    try {
      const query = `
        UPDATE drivers_license
        SET license_number = $1, issue_date = $2, expiry_date = $3
        WHERE customer_id = $4
        RETURNING *;
      `;
      const values = [licenseNumber, issueDate, expiryDate, id];

      const result = await client.query(query, values);

      // Return the updated drivers license 
      return result.rows[0];
    } catch (error) {
      console.error("Error updating drivers license:", error);
      throw error;
    }
  }
}
