import client from "../configs/db.configs.js";

export class NotificationService {
    async createNotification(userId, bookingId, message) {
        const query = `
            INSERT INTO notifications (customer_id, booking_id, message)
            VALUES ($1, $2, $3) RETURNING notification_id;
        `;
        const values = [userId, bookingId, message];
        const result = await client.query(query, values);
        return result.rows[0].notification_id;
    }

    async getNotifications(userId) {
        const query = `
            SELECT * FROM notifications
            WHERE customer_id = $1 AND is_read = false
            ORDER BY created_at DESC;
        `;
        const values = [userId];
        const result = await client.query(query, values);
        return result.rows;
    }

    async markNotificationAsRead(notificationId) {
        const query = `
            UPDATE notifications
            SET is_read = TRUE
            WHERE notification_id = $1;
        `;
        const values = [notificationId];
        await client.query(query, values);
    }

    async notifyBookingConfirmed(updatedBooking) {
        const message = `Your booking for vehicle ${updatedBooking.vehicle.make} ${updatedBooking.vehicle.model} - ${updatedBooking.vehicle.year} has been confirmed!`;
        return this.createNotification(updatedBooking.customer_id, updatedBooking.booking_id, message);
    }

    async notifyBookingCompleted(updatedBooking) {
        const message = `Thank you! Your booking for ${updatedBooking.vehicle.make} ${updatedBooking.vehicle.model} - ${updatedBooking.vehicle.year} is now complete.`;
        return this.createNotification(updatedBooking.customer_id, updatedBooking.booking_id, message);
    }

    async notifyStatusChange(updatedBooking) {
        const message = `The status of your booking for vehicle  ${updatedBooking.vehicle.make} ${updatedBooking.vehicle.model} - ${updatedBooking.vehicle.year} has been updated to '${updatedBooking.status}'.`;
        return this.createNotification(updatedBooking.customer_id, updatedBooking.booking_id, message);
    }
}