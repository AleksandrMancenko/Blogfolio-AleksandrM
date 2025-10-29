import React from 'react';
import { useAppSelector } from '../../store/hooks';
import { selectNotifications } from '../../features/notifications/notificationSlice';
import NotificationToast from './NotificationToast';
import styles from './NotificationContainer.module.css';

export default function NotificationContainer() {
  const notifications = useAppSelector(selectNotifications);

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className={styles.container}>
      {notifications.map((notification) => (
        <NotificationToast key={notification.id} notification={notification} />
      ))}
    </div>
  );
}
