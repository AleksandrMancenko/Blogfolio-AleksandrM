import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { closeMenu, toggleTheme, selectTheme } from '../../../features/ui/uiSlice';
import { selectUser, selectIsAuthenticated, logout } from '../../../features/auth/authSlice';
import styles from './OverlayMenu.module.css';
import ProfilePopup from './ProfilePopup';

type Props = { open: boolean };

export default function OverlayMenu({ open }: Props) {
  const dispatch = useAppDispatch();
  const theme = useAppSelector(selectTheme);
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);

  const handleLogout = () => {
    dispatch(closeMenu());
    dispatch(logout({ showNotification: true }));
    navigate('/signin');
  };

  return (
    <>
      <div
        className={`${styles.backdrop} ${open ? styles.open : ''}`}
        onClick={() => dispatch(closeMenu())}
      >
        <aside className={styles.panel} onClick={(e) => e.stopPropagation()}>
          <div className={styles.panelHeader}>
            <button
              type="button"
              className={styles.closeBtn}
              aria-label="close menu"
              onClick={() => dispatch(closeMenu())}
            >
              <svg viewBox="0 0 24 24" className={styles.icon} aria-hidden="true">
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            <div className={styles.userBox}>
              {isAuthenticated && user ? (
                <>
                  <div className={styles.userBadge}>
                    {user.username ? user.username.substring(0, 2).toUpperCase() : 'AM'}
                  </div>
                  <div className={styles.userName}>
                    {user.first_name && user.last_name
                      ? `${user.first_name} ${user.last_name}`
                      : user.username}
                  </div>
                </>
              ) : (
                <div className={styles.userBadge} aria-hidden="true">
                  <svg
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          <nav className={styles.nav}>
            <Link className={styles.item} to="/" onClick={() => dispatch(closeMenu())}>
              Home
            </Link>

            {isAuthenticated && (
              <>
                <button
                  type="button"
                  className={styles.item}
                  onClick={() => {
                    dispatch(closeMenu());
                    // Открываем попап после небольшой задержки, чтобы меню успело закрыться
                    setTimeout(() => {
                      setShowProfile(true);
                    }, 200);
                  }}
                >
                  Profile
                </button>
                <Link className={styles.item} to="/create" onClick={() => dispatch(closeMenu())}>
                  Add post
                </Link>
              </>
            )}
          </nav>

          <div className={styles.sep} />

          <button type="button" className={styles.themeBtn} onClick={() => dispatch(toggleTheme())}>
            Toggle theme (now: {theme})
          </button>

          <div className={styles.bottom}>
            {isAuthenticated ? (
              <button type="button" className={styles.item} onClick={handleLogout}>
                Log Out
              </button>
            ) : (
              <Link className={styles.item} to="/signin" onClick={() => dispatch(closeMenu())}>
                Sign In
              </Link>
            )}
          </div>
        </aside>
      </div>

      {showProfile && <ProfilePopup onClose={() => setShowProfile(false)} />}
    </>
  );
}
