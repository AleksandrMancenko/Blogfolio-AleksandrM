import { Link, Outlet, useLocation } from "react-router-dom";
import styles from "./MainLayout.module.css";

export default function MainLayout () {
    const { pathname } = useLocation();
    const isAuth = pathname === "/signin" || pathname === "/success";

    return (
        <div className={`${styles.app} ${isAuth ? styles.auth : ""}`}>
            <header className={styles.header}>
              <div className={styles.headerInner}>
                <Link to="/" className={styles.logo}>Blog</Link>
              </div>
            </header>

            <main className={styles.main}>
                <Outlet />
            </main>

            <footer className={styles.footer}>
                <div className={styles.footerRow}>
                    <small>© {new Date().getFullYear()} Blogfolio</small>
                    <small>All rights reserved</small>
                </div>            
            </footer>
        </div>
    );

}