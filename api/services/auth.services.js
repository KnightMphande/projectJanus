import { query } from "express";
import client from "../configs/db.configs.js";

export class AuthenticationService {
  /**
   * Checks if a user exists by their email.
   * @param {string} email The email of the user to check.
   * @returns {object} exists and user if found.
   */
  static async checkEmailExists(email) {
    try {
      const resultCustomer = await client.query(
        `SELECT * FROM customers WHERE email = $1`,
        [email]
      );
      const resultStaff = await client.query(
        `SELECT * FROM staff WHERE email = $1`,
        [email]
      );
      const user = resultCustomer.rows[0] || resultStaff.rows[0];

      return {
        exists: user ? true : false,
        user,
      };
    } catch (err) {
      console.error("Failed to get user by email:", err);
      throw err;
    }
  }

  /**
   * Checks if phone number exists.
   * @param {string} phone The phone of the user to check.
   * @returns {object} exists or user if found.
   */
  static async checkPhoneExists(phone) {
    try {
      const resultCustomer = await client.query(
        `SELECT * FROM customers WHERE phone = $1`,
        [phone]
      );
      const resultStaff = await client.query(
        `SELECT * FROM staff WHERE phone = $1`,
        [phone]
      );
      const user = resultCustomer.rows[0] || resultStaff.rows[0];

      return {
        exists: user ? true : false,
        user,
      };
    } catch (err) {
      console.error("Failed to get user by phone:", err);
      throw err;
    }
  }

  /**
   * Register new customer.
   * @param {object} customerDetails Contains user information.
   * @returns {number} Customer id.
   */
  static async register(customerDetails) {
    try {
      // Destructure user object
      const {
        firstName,
        lastName,
        phone,
        email,
        password,
        street,
        city,
        province,
        zipCode,
        country,
        licenseNumber,
        issueDate,
        expiryDate,
      } = customerDetails;

      const names = firstName + " " + lastName;
      const address =
        street + " " + city + " " + province + " " + zipCode + " " + country;
      const role = "customer";

      // Insert the customer into the `customers` table
      const query = `
      INSERT INTO customers (
        names, phone, email, password, address, role
      ) VALUES (
        $1, $2, $3, $4, $5, $6
      ) RETURNING customer_id;
    `;

      // Start a new transaction
      await client.query("BEGIN");

      // Run the query
      const result = await client.query(query, [
        names,
        phone,
        email,
        password,
        address,
        role,
      ]);

      await client.query(
        `INSERT INTO drivers_license (customer_id, license_number, issue_date, expiry_date) VALUES ($1, $2, $3, $4)`,
        [result.rows[0].customer_id, licenseNumber, issueDate, expiryDate]
      );

      // Commit the transaction if successful
      await client.query("COMMIT");

      // Return the new customer Id
      return result.rows[0].customer_id;
    } catch (error) {
      console.error("Failed to register customer:", error);
      throw error;
    }
  }

  /**
   * Get user by id.
   * @param {id} userId for user both customer and staff.
   * @param {role} role for the user (customer and staff).
   * @returns {object} user if found or null if not.
   */
  static async getUserById(id, role) {
    // Validate role input
    if (!["customer", "admin", "employee"].includes(role)) {
      throw new Error(
        `Invalid role provided: ${role}. Expected "customer" or "staff".`
      );
    }

    try {
      const query =
        role === "customer"
          ? "SELECT * FROM customers WHERE customer_id = $1;"
          : "SELECT * FROM staff WHERE staff_id = $1;";

      // Execute the query
      const result = await client.query(query, [id]);

      return result.rows[0] || null;
    } catch (error) {
      console.log("Error fetching user by id: ", error);
      throw error;
    }
  }
}
