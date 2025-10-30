import { Outlet, useLocation } from 'react-router-dom';
import styles from './MainLayout.module.css';
import Header from '../components/common/Header/Header';
import OverlayMenu from '../components/common/OverlayMenu/OverlayMenu';
import ImagePreview from '../components/common/ImagePreview/ImagePreview';
import { useEffect } from 'react';
import { useAppSelector } from '../store/hooks';
import { selectMenuOpen, selectTheme } from '../features/ui/uiSlice';

export default function MainLayout() {
  const { pathname } = useLocation();
  const isAuth = /^\/(signin|signup|success)(\/|$)/.test(pathname);
  const menuOpen = useAppSelector(selectMenuOpen);
  const theme = useAppSelector(selectTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className={`${styles.app} ${isAuth ? styles.isAuth : ''}`}>
      <Header />

      <main className={styles.main}>
        <Outlet />
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerRow}>
          <small>© {new Date().getFullYear()} Blogfolio</small>
          <small>All rights reserved</small>
        </div>
      </footer>

      <OverlayMenu open={menuOpen} />
      <ImagePreview />
    </div>
  );
}
