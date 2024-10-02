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
        user
      }
    } catch (err) {
      console.error("Failed to get user by email:", err);
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

      // Run the query
      const result = await client.query(query, [
        names,
        phone,
        email,
        password,
        address,
        role,
      ]);

      // Return the new customer Id
      return result.rows[0].customer_id;
    } catch (error) {
      console.error("Failed to register customer:", error);
      throw error;
    }
  }
}
