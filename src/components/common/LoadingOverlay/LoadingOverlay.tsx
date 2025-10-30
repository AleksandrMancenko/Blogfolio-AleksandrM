import React from 'react';
import LoadingSpinner from '../LoadingSpinner';
import styles from './LoadingOverlay.module.css';

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
  children: React.ReactNode;
}

export default function LoadingOverlay({
  isLoading,
  message = 'Loading...',
  children,
}: LoadingOverlayProps) {
  return (
    <div className={styles.container}>
      {children}
      {isLoading && (
        <div className={styles.overlay}>
          <div className={styles.content}>
            <LoadingSpinner size="large" />
            {message && <p className={styles.message}>{message}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
