import { Link } from "react-router-dom";
import styles from "./Header.module.css";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { openMenu } from "../../../features/ui/uiSlice";
import { setQuery } from "../../../features/search/searchSlice";
import { FormEvent } from "react";

export default function Header() {
  const dispatch = useAppDispatch();
  const query = useAppSelector(s => s.search.query);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();              // не уходим со страницы
    // здесь ничего не делаем — AllPosts сам отфильтрует по Redux-значению
  };

  return (
    <header className={styles.header}>
      {/* бургер слева */}
      <button
        type="button"
        className={styles.iconBtn}
        aria-label="Open menu"
        onClick={() => dispatch(openMenu())}
      >
        <svg viewBox="0 0 24 24" className={styles.icon} aria-hidden="true">
          <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>

      {/* центр: форма поиска */}
      <form className={styles.search} role="search" onSubmit={onSubmit}>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Search…"
          value={query}
          onChange={(e) => dispatch(setQuery(e.target.value))}
          aria-label="Search"
        />
        <button type="submit" className={styles.searchBtn} aria-label="Search">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>        
          </button>
      </form>

      {/* справа: AM + имя */}
      <Link to="/" className={styles.user} aria-label="Profile">
        <span className={styles.userBadge}>AM</span>
        <span className={styles.userName}>Artem Malkin</span>
      </Link>
    </header>
  );
}
