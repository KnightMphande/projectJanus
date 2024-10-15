import client from "../configs/db.configs.js";

export class InvoiceService {
  // Function to check if an invoice exists
  static async checkInvoiceExists(bookingId) {
    const query = 'SELECT * FROM invoices WHERE booking_id = $1';
    const values = [bookingId];

    try {
      const result = await client.query(query, values);
      return result.rows[0]; 
    } catch (error) {
      throw new Error('Error checking invoice existence: ', error);
    }
  }

  // Function to update the invoice
  static async updateInvoice(bookingId, userId, amount, additionalCharges) {
    const query = `
      UPDATE invoices 
      SET amount = $1, additional_charges = $2 
      WHERE booking_id = $3 AND customer_id = $4
    `;
    const values = [amount, additionalCharges, bookingId, userId];

    try {
      await client.query(query, values);
    } catch (error) {
      throw new Error('Error updating invoice: ' + error.message);
    }
  }

  // Function to save a new invoice
  static async saveInvoice(bookingId, userId, amount, additionalCharges) {
    const query = `
      INSERT INTO invoices (booking_id, customer_id, amount, additional_charges)
      VALUES ($1, $2, $3, $4)
    `;
    const values = [bookingId, userId, amount, additionalCharges];

    try {
      await client.query(query, values);
    } catch (error) {
        console.log(error);
      throw new Error('Error saving invoice: ', error);
     
      
    }
  }
}