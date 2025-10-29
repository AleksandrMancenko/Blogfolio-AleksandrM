import { useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { get } from '../../api/student';
import PostCardBase from '../../components/common/PostCard/PostCardBase';
import LoadingOverlay from '../../components/common/LoadingOverlay/LoadingOverlay';
import { addQuery, selectSearchHistory } from '../../features/search/searchHistorySlice';
import {
  setQuery,
  setLoading,
  setResults,
  setError,
  clearResults,
  selectSearchResults,
  selectSearchLoading,
  selectSearchError,
} from '../../features/search/searchResultsSlice';
import styles from './Search.module.css';

export default function Search() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const query = searchParams.get('q') || '';
  const searchHistory = useAppSelector(selectSearchHistory);
  const posts = useAppSelector(selectSearchResults);
  const loading = useAppSelector(selectSearchLoading);
  const error = useAppSelector(selectSearchError);

  useEffect(() => {
    if (!query.trim()) {
      dispatch(clearResults());
      return;
    }

    // Добавляем запрос в историю
    dispatch(addQuery(query));
    dispatch(setQuery(query));

    const searchPosts = async () => {
      dispatch(setLoading(true));

      try {
        console.log('Searching for:', query);

        const response = await get<{
          count: number;
          results: Array<{
            id: number;
            image: string | null;
            text: string;
            date: string;
            lesson_num: number;
            title: string;
            description: string;
            author: number;
          }>;
        }>('/blog/posts/', {
          search: query,
          author__course_group: 18,
          ordering: '-date',
        });

        console.log('Search results:', response);

        // Преобразуем DTO в Post
        const searchResults = response.results.map((dto) => ({
          id: dto.id,
          title: dto.title,
          text: dto.description || dto.text,
          date: dto.date,
          image: dto.image || undefined,
          lesson_num: dto.lesson_num,
          author: dto.author,
          likes: Math.floor(Math.random() * 200) + 10,
          dislikes: Math.floor(Math.random() * 20) + 1,
        }));

        dispatch(setResults(searchResults));
      } catch (err) {
        console.error('Search error:', err);
        dispatch(setError(err instanceof Error ? err.message : 'Search failed'));
      }
    };

    searchPosts();
  }, [query, dispatch]);

  if (!query.trim()) {
    return (
      <div className={styles.page}>
        <div className={styles.header}>
          <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
            <Link to="/" className={styles.breadcrumbLink}>
              Home
            </Link>
            <span className={styles.breadcrumbSeparator}>›</span>
            <span className={styles.breadcrumbCurrent}>Search</span>
          </nav>

          <Link to="/" className={styles.backLink}>
            ← Back to blog
          </Link>
        </div>
        <h1 className={styles.title}>Search</h1>
        <p className={styles.empty}>Enter a search query to find posts</p>

        {searchHistory.length > 0 && (
          <div className={styles.history}>
            <h3 className={styles.historyTitle}>Recent searches:</h3>
            <div className={styles.historyList}>
              {searchHistory.map((historyQuery, index) => (
                <button
                  key={index}
                  className={styles.historyItem}
                  onClick={() => navigate(`/search?q=${encodeURIComponent(historyQuery)}`)}
                >
                  {historyQuery}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <LoadingOverlay isLoading={loading} message="Searching...">
      <div className={styles.page}>
        <div className={styles.header}>
          <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
            <Link to="/" className={styles.breadcrumbLink}>
              Home
            </Link>
            <span className={styles.breadcrumbSeparator}>›</span>
            <span className={styles.breadcrumbCurrent}>Search</span>
          </nav>

          <Link to="/" className={styles.backLink}>
            ← Back to blog
          </Link>
        </div>

        <h1 className={styles.title}>Search results for "{query}"</h1>

        {error && (
          <div className={styles.error}>
            <p>Error: {error}</p>
          </div>
        )}

        {posts.length === 0 && !loading && !error && (
          <div className={styles.empty}>
            <p>No posts found for "{query}"</p>
            <p>Try different keywords or check your spelling</p>
          </div>
        )}

        {posts.length > 0 && (
          <div className={styles.results}>
            <p className={styles.count}>
              Found {posts.length} post{posts.length !== 1 ? 's' : ''}
            </p>

            <div className={styles.grid}>
              {posts.map((post) => (
                <Link key={post.id} to={`/posts/${post.id}`} className={styles.cardLink}>
                  <PostCardBase
                    post={post}
                    variant="vertical"
                    isBookmarked={false}
                    onBookmarkToggle={() => {}}
                    onLike={() => {}}
                    onDislike={() => {}}
                    onEdit={() => {}}
                    onDelete={() => {}}
                  />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </LoadingOverlay>
  );
}
