import React, { useEffect } from 'react';
import { useAppDispatch } from '../../../store/hooks';
import { removeNotification } from '../../../features/notifications/notificationSlice';
import type { Notification } from '../../../features/notifications/notificationSlice';
import styles from './NotificationToast.module.css';

interface NotificationToastProps {
  notification: Notification;
}

export default function NotificationToast({ notification }: NotificationToastProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (notification.duration) {
      const timer = setTimeout(() => {
        dispatch(removeNotification(notification.id));
      }, notification.duration);

      return () => clearTimeout(timer);
    }
  }, [dispatch, notification.id, notification.duration]);

  const handleClose = () => {
    dispatch(removeNotification(notification.id));
  };

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      default:
        return 'ℹ';
    }
  };

  return (
    <div className={`${styles.toast} ${styles[notification.type]}`}>
      <div className={styles.icon}>{getIcon()}</div>
      <div className={styles.content}>
        <div className={styles.title}>{notification.title}</div>
        <div className={styles.message}>{notification.message}</div>
      </div>
      <button className={styles.close} onClick={handleClose} aria-label="Close notification">
        ×
      </button>
    </div>
  );
}
