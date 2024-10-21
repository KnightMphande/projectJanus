import client from "../configs/db.configs.js";

export class AdminService {
     // Create an employee
  static  async createEmployee( names, phone, email, password, role ) {
    try {
        const query = `
            INSERT INTO staff (names, phone, email, password, role)
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING *;
        `;
        const values = [names, phone, email, password, role];
        const result = await client.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error('Error creating employee:', error);
        throw new Error('Failed to create employee');
    }
}

// Get all employees
static async getAllEmployees() {
    try {
        const query = `SELECT * FROM staff WHERE role = 'employee';`;
        const result = await client.query(query);
        return result.rows;
    } catch (error) {
        console.error('Error fetching employees:', error);
        throw new Error('Failed to get employees');
    }
}

// Get a single employee by ID
async getEmployeeById(staff_id) {
    try {
        const query = `SELECT * FROM staff WHERE staff_id = $1;`;
        const values = [staff_id];
        const result = await client.query(query, values);
        if (result.rows.length === 0) {
            throw new Error('Employee not found');
        }
        return result.rows[0];
    } catch (error) {
        console.error('Error fetching employee by ID:', error);
        throw new Error('Failed to get employee');
    }
}

// Update an employee
async updateEmployee(staff_id, { names, phone, email, role, logo_url }) {
    try {
        const query = `
            UPDATE staff
            SET names = $1, phone = $2, email = $3, role = $4, logo_url = $5
            WHERE staff_id = $6
            RETURNING *;
        `;
        const values = [names, phone, email, role, logo_url, staff_id];
        const result = await client.query(query, values);
        if (result.rows.length === 0) {
            throw new Error('Employee not found');
        }
        return result.rows[0];
    } catch (error) {
        console.error('Error updating employee:', error);
        throw new Error('Failed to update employee');
    }
}

// Delete an employee
async deleteEmployee(staff_id) {
    try {
        const query = `DELETE FROM staff WHERE staff_id = $1 RETURNING *;`;
        const values = [staff_id];
        const result = await client.query(query, values);
        if (result.rows.length === 0) {
            throw new Error('Employee not found');
        }
        return result.rows[0];
    } catch (error) {
        console.error('Error deleting employee:', error);
        throw new Error('Failed to delete employee');
    }
}
}