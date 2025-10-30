import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { logout, selectUser } from '../../../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import styles from './ProfilePopup.module.css';

type Props = {
  onClose: () => void;
};

export default function ProfilePopup({ onClose }: Props) {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout({ showNotification: true }));
    navigate('/signin');
    onClose();
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Profile</h2>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <svg viewBox="0 0 24 24" className={styles.icon} aria-hidden="true">
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className={styles.content}>
          {user ? (
            <>
              <div className={styles.userInfo}>
                <div className={styles.userBadge}>
                  {user.username ? user.username.substring(0, 2).toUpperCase() : 'AM'}
                </div>
                <div className={styles.userDetails}>
                  <div className={styles.field}>
                    <span className={styles.label}>Username:</span>
                    <span className={styles.value}>{user.username}</span>
                  </div>
                  <div className={styles.field}>
                    <span className={styles.label}>Email:</span>
                    <span className={styles.value}>{user.email}</span>
                  </div>
                  {user.first_name && (
                    <div className={styles.field}>
                      <span className={styles.label}>First Name:</span>
                      <span className={styles.value}>{user.first_name}</span>
                    </div>
                  )}
                  {user.last_name && (
                    <div className={styles.field}>
                      <span className={styles.label}>Last Name:</span>
                      <span className={styles.value}>{user.last_name}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.actions}>
                <button type="button" className={styles.logoutBtn} onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className={styles.empty}>
              <p>No user information available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
