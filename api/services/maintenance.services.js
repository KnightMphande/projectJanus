export class MaintenanceService {
    static async createMaintenance(data) {
        try {
            const { vehicleId, description, scheduledDate, completed  } = data;
          await client.query('BEGIN'); 
      
          const query = `
            INSERT INTO maintenance (vehicle_id, description, scheduled_date, completed)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
          `;
          const values = [vehicleId, description, scheduledDate, completed || false];
      
          const result = await client.query(query, values);
          await client.query('COMMIT'); 
      
          return result.rows[0];
        } catch (error) {
          await client.query('ROLLBACK'); 
          throw error; 
        } 
      };
      
      static async getAllMaintenance() {
        try {
            const query = `
                SELECT 
                    m.maintenance_id,
                    m.vehicle_id,
                    m.description,
                    m.scheduled_date,
                    m.completed,
                    m.created_at,
                    v.make,
                    v.model,
                    v.year,
                    vi.filename
                FROM 
                    maintenance m
                JOIN 
                    vehicles v ON m.vehicle_id = v.vehicle_id
                LEFT JOIN 
                    vehicle_images vi ON v.vehicle_id = vi.vehicle_id
                ORDER BY 
                    m.created_at DESC;
            `;
            
            const result = await client.query(query);
            return result.rows;
        } catch (error) {
            console.error('Error retrieving maintenance records:', error);
            throw error;
        }
    }
      
    static async getMaintenanceById(id) {
        try {
            const query = `
                SELECT 
                    m.maintenance_id,
                    m.vehicle_id,
                    m.description,
                    m.scheduled_date,
                    m.completed,
                    m.created_at,
                    v.make,
                    v.model,
                    v.year,
                    vi.filename
                FROM 
                    maintenance m
                JOIN 
                    vehicles v ON m.vehicle_id = v.vehicle_id
                LEFT JOIN 
                    vehicle_images vi ON v.vehicle_id = vi.vehicle_id
                WHERE 
                    m.maintenance_id = $1;
            `;
    
            const result = await client.query(query, [id]);
            return result.rows[0]; 
        } catch (error) {
            console.error('Error retrieving maintenance record:', error);
            throw error;
        }
    }
      
      static async updateMaintenance(id, data) {
        try {
            const { vehicleId, description, scheduledDate, completed } = data;
          await client.query('BEGIN'); 
      
          const query = `
            UPDATE maintenance
            SET vehicle_id = $1, description = $2, scheduled_date = $3, completed = $4
            WHERE maintenance_id = $5
            RETURNING *;
          `;
          const values = [vehicleId, description, scheduledDate, completed, id];
      
          const result = await client.query(query, values);
          await client.query('COMMIT'); 
      
          return result.rows[0];
        } catch (error) {
          await client.query('ROLLBACK');
          throw error; 
        } 
      };
      
      static async deleteMaintenance(id) {
        try {
            await client.query('BEGIN');
    
            const query = 'DELETE FROM maintenance WHERE maintenance_id = $1 RETURNING *;';
            const result = await client.query(query, [id]);
    
            await client.query('COMMIT');
    
            
            return result.rowCount > 0;
        } catch (error) {
            await client.query('ROLLBACK');
            console.error('Error deleting maintenance record:', error);
            return false; 
        }
    }
      
}

