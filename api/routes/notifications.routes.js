import express from 'express';
import { verifyJwt } from '../middlewares/verifyJwt.middleware.js';
import { getUserNotificationsNotificationsController, markNotificationAsReadController } from '../controllers/notifications.controllers.js';

const notification_router = express.Router();

notification_router.use(verifyJwt)

notification_router.get('/:userId', getUserNotificationsNotificationsController);
notification_router.put('/:notificationId/read', markNotificationAsReadController);

export default notification_router;