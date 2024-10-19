import { NotificationService } from "../services/notifications.services.js";

const notificationService = new NotificationService();

// Get all notifications for a specific user
export const getUserNotificationsNotificationsController = async (req, res) => {

    const { userId } = req.params;
    

  try {
    const notifications = await notificationService.getNotifications(
      userId
    );

    return res.status(200).json({ success: true, notifications });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: true, message: "Error fetching notifications." });
  }
};

// Mark a specific notification as read
export const markNotificationAsReadController = async (req, res) => {
  const { notificationId } = req.params;
//   console.log(req.params);
  
  try {
    await notificationService.markNotificationAsRead(notificationId);
    return res.status(200).json({ success: true, message: "Notification marked as read." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Error marking notification as read." });
  }
};
