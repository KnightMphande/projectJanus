import React from "react";
import styles from "./Notification.module.scss";

const NotificationDropdown = ({ closeNotification, notifications, markAsRead }) => {
    return (
        <div className={styles.dropdown}>
            <div className={styles.header}>
                <h3 className={styles.title}>Notifications</h3>
                <button className={styles.closeBtn} onClick={() => closeNotification()}>×</button>
            </div>
            <div className={styles.notifications}>
                {notifications?.length === 0 ? (
                    <p className={styles.noNotifications}>No new notifications</p>
                ) : (
                    notifications?.map((notification) => (
                        <div
                            key={notification.id}
                            className={`${styles.notificationItem} ${notification.is_read ? styles.read : ''}`}
                            onClick={() => markAsRead(notification.notification_id)}
                        >
                            <p className={styles.message}>{notification.message}</p>
                            <span className={styles.timestamp}>{notification.timestamp}</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default NotificationDropdown;
