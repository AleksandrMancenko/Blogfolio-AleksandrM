import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import styles from './Header.module.css';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { openMenu } from '../../../features/ui/uiSlice';
import { setQuery } from '../../../features/search/searchSlice';
import { addQuery } from '../../../features/search/searchHistorySlice';
import { fetchUserProfile, selectUser } from '../../../features/auth/authSlice';
import SearchAutocomplete from '../SearchAutocomplete';
import { FormEvent } from 'react';

export default function Header() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const query = useAppSelector((s) => s.search.query);
  const user = useAppSelector(selectUser);

  // Загружаем профиль пользователя при монтировании компонента
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken && !user) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, user]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // Добавляем запрос в историю
      dispatch(addQuery(query.trim()));
      // Переходим на страницу поиска с запросом
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      // Очищаем поле поиска после перехода
      dispatch(setQuery(''));
    }
  };

  const handleSearchSubmit = () => {
    if (query.trim()) {
      // Добавляем запрос в историю
      dispatch(addQuery(query.trim()));
      // Переходим на страницу поиска с запросом
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      // Очищаем поле поиска после перехода
      dispatch(setQuery(''));
    }
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
          <path
            d="M4 6h16M4 12h16M4 18h16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {/* центр: форма поиска */}
      <form className={styles.search} role="search" onSubmit={onSubmit}>
        <SearchAutocomplete
          value={query}
          onChange={(value) => dispatch(setQuery(value))}
          onSubmit={handleSearchSubmit}
          placeholder="Search…"
          className={styles.searchInput}
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

      {/* справа: аватар и имя (имя только для авторизованных) */}
      <Link to="/" className={styles.user} aria-label="Profile">
        <span className={styles.userBadge}>
          {user?.username ? (
            user.username.substring(0, 2).toUpperCase()
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          )}
        </span>
        {user && (
          <span className={styles.userName}>
            {user.first_name && user.last_name
              ? `${user.first_name} ${user.last_name}`
              : user.username}
          </span>
        )}
      </Link>
    </header>
  );
}
