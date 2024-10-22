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
static async getEmployeeById(staff_id) {
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
static async updateEmployee(staff_id, { names, phone, email, role, logo_url }) {
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
static async deleteEmployee(staff_id) {
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

// Get list of damages
static async getAllDamages() {
    try {
        const result = await client.query('SELECT * FROM damages ORDER BY created_at DESC');
        return result.rows;
    } catch (error) {
        throw new Error('Failed to retrieve damages');
    }
};

// Get a damage by ID
static async getDamageById(id) {
    try {
        const result = await client.query('SELECT * FROM damages WHERE damage_id = $1', [id]);
        return result.rows[0];
    } catch (error) {
        throw new Error('Failed to retrieve damage');
    }
};

// Create a new damage
static async createDamage(damageData) {
    const { damage, price } = damageData;
    try {
        const result = await client.query(
            'INSERT INTO damages (name, price) VALUES ($1, $2) RETURNING *',
            [damage, price]
        );
        return result.rows[0];
    } catch (error) {
        throw new Error('Failed to create damage');
    }
};

// Update an existing damage by ID
static async updateDamage(id, damageData) {
    const { name, price } = damageData;
    try {
        const result = await client.query(
            'UPDATE damages SET name = $1, price = $2 WHERE damage_id = $3 RETURNING *',
            [name, price, id]
        );
        return result.rows[0];
    } catch (error) {
        throw new Error('Failed to update damage');
    }
};

// Delete a damage by ID
static async deleteDamage(id) {
    try {
        const result = await client.query('DELETE FROM damages WHERE damage_id = $1 RETURNING *', [id]);
        return result.rows[0];
    } catch (error) {
        throw new Error('Failed to delete damage');
    }
};
}