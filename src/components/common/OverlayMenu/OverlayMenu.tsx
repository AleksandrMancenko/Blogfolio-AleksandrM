import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { closeMenu, toggleTheme, selectTheme } from "../../../features/ui/uiSlice";
import styles from "./OverlayMenu.module.css";

type Props = { open: boolean };

export default function OverlayMenu({ open }: Props) {
  const dispatch = useAppDispatch();
  const theme = useAppSelector(selectTheme);

  return (
    <div className={`${styles.backdrop} ${open ? styles.open : ""}`} onClick={() => dispatch(closeMenu())}>
      <aside className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <div className={styles.panelHeader}>
          <button type="button" className={styles.closeBtn} aria-label="close menu" onClick={() => dispatch(closeMenu())}>
            <svg viewBox="0 0 24 24" className={styles.icon} aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>

          <div className={styles.userBox}>
            <div className={styles.userBadge}>AM</div>
            <div className={styles.userName}>Artem Malkin</div>
          </div>
        </div>

        <nav className={styles.nav}>
          <Link className={styles.item} to="/" onClick={() => dispatch(closeMenu())}>Home</Link>
          <a className={styles.item} href="#" onClick={(e)=>e.preventDefault()}>Add post</a>
        </nav>

        <div className={styles.sep} />

        <button type="button" className={styles.themeBtn} onClick={() => dispatch(toggleTheme())}>
          Toggle theme (now: {theme})
        </button>
      </aside>
    </div>
  );
}
