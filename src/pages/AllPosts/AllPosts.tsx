import { Link, useLocation, useNavigate } from 'react-router-dom';
import Tabs, { type TabItem } from '../../components/common/Tabs';
import PostCardBase from '../../components/common/PostCard/PostCardBase';
import LoadingOverlay from '../../components/common/LoadingOverlay';
import type { Post } from '../../api/posts.types';
import styles from './AllPosts.module.css';
import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectFavoriteIds, toggle as toggleFav } from '../../features/favorites/favoritesSlice';
import {
  selectPosts,
  selectPostsLoaded,
  selectPostsLoading,
  selectPostsError,
  fetchPostsByCourseGroup,
  deleteExistingPost,
  selectCurrentPage,
  selectTotalPages,
  selectHasNextPage,
  selectHasPrevPage,
  setPagination,
  clear,
} from '../../features/posts/postsSlice';
import { clearResults } from '../../features/search/searchResultsSlice';
import { clearQuery } from '../../features/search/searchSlice';
import { seedPosts } from '../../features/posts/seed';
import { initializePost } from '../../features/likes/likesSlice';

const USE_MOCK = false; // Используем реальный API

export default function AllPosts() {
  console.log('AllPosts component rendered');
  
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isFavPage = /^\/favorites(\/|$)/.test(pathname);

  const dispatch = useAppDispatch();
  const favIds = useAppSelector(selectFavoriteIds);
  const favCount = favIds.length;

  const posts = useAppSelector(selectPosts);
  const postsLoaded = useAppSelector(selectPostsLoaded);
  const postsLoading = useAppSelector(selectPostsLoading);
  const postsErr = useAppSelector(selectPostsError);
  
  // Пагинация
  const currentPage = useAppSelector(selectCurrentPage);
  const totalPages = useAppSelector(selectTotalPages);
  const hasNextPage = useAppSelector(selectHasNextPage);
  const hasPrevPage = useAppSelector(selectHasPrevPage);

  console.log('Component state:', { 
    postsLength: posts.length, 
    postsLoaded, 
    postsLoading, 
    postsErr,
    currentPage, 
    totalPages, 
    hasNextPage, 
    hasPrevPage 
  });

  const items: TabItem[] = useMemo(
    () => [
      { value: 'all', label: 'All' },
      { value: 'fav', label: favCount ? `My favorites (${favCount})` : 'My favorites' },
      { value: 'pop', label: 'Popular' },
    ],
    [favCount],
  );

  const [tab, setTab] = useState<string>(isFavPage ? 'fav' : 'all');

  useEffect(() => {
    if (isFavPage) setTab('fav');
    else if (tab === 'fav') setTab('all');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFavPage]);

  // Очищаем состояние при монтировании компонента (возврат на главную)
  useEffect(() => {
    // Очищаем результаты поиска при возврате на главную
    dispatch(clearResults());
    // Очищаем поле поиска в хедере
    dispatch(clearQuery());
  }, [dispatch]);

  // Загрузка постов с использованием redux-thunk
  useEffect(() => {
    console.log('useEffect triggered:', { postsLoaded, postsLoading, USE_MOCK });
    
    if (postsLoaded || postsLoading) return;

    if (USE_MOCK) {
      console.log('Using mock data');
      // Используем mock данные для разработки
      // Симулируем пагинацию для mock данных
      const mockPosts = seedPosts;
      const totalPages = Math.ceil(mockPosts.length / 12);
      
      console.log('Mock data:', { mockPostsLength: mockPosts.length, totalPages });
      
      dispatch({ 
        type: 'posts/setAll', 
        payload: mockPosts.slice(0, 12) // Показываем только первые 12 постов
      });
      
      // Устанавливаем информацию о пагинации
      dispatch(setPagination({
        currentPage: 1,
        totalPages,
        hasNextPage: totalPages > 1,
        hasPrevPage: false,
      }));
    } else {
      console.log('Using real API');
      // Загружаем посты с фильтром по группе курса (course_group = 18)
      dispatch(fetchPostsByCourseGroup({ courseGroupId: 18, page: 1 }));
    }
  }, [dispatch, postsLoaded, postsLoading]);

  // Инициализируем лайки для всех постов
  useEffect(() => {
    if (posts && posts.length > 0) {
      posts.forEach(post => {
        dispatch(initializePost({
          postId: post.id,
          likes: post.likes,
          dislikes: post.dislikes,
        }));
      });
    }
  }, [dispatch, posts]);

  const onTabChange = (v: string) => {
    if (v === 'fav') {
      if (!isFavPage) navigate('/favorites');
      setTab('fav');
      return;
    }
    if (isFavPage) navigate('/');
    setTab(v);
  };

  const filteredByQuery = useMemo(() => {
    const arr = posts ?? [];
    // Убираем фильтрацию по query - показываем все посты
    return arr;
  }, [posts]);

  const filtered = useMemo(() => {
    if (tab === 'fav') return filteredByQuery.filter((p) => favIds.includes(p.id));
    return filteredByQuery;
  }, [filteredByQuery, favIds, tab]);

  const isFavView = isFavPage || tab === 'fav';

  const isFav = (id: number) => favIds.includes(id);
  const onToggle = (id: number) => dispatch(toggleFav(id));

  const handleLike = (postId: number) => {
    // Лайк обрабатывается в PostCardBase через Redux
    console.log('Like post:', postId);
  };

  const handleDislike = (postId: number) => {
    // Дизлайк обрабатывается в PostCardBase через Redux
    console.log('Dislike post:', postId);
  };

  const handleEdit = (postId: number) => {
    // TODO: Navigate to edit page or open edit modal
    console.log('Edit post:', postId);
  };

  const handleDelete = async (postId: number) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await dispatch(deleteExistingPost(postId)).unwrap();
      } catch (error) {
        console.error('Failed to delete post:', error);
      }
    }
  };

  // Функции пагинации
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      if (USE_MOCK) {
        // В mock режиме симулируем пагинацию
        const startIndex = (page - 1) * 12;
        const endIndex = startIndex + 12;
        const pagePosts = seedPosts.slice(startIndex, endIndex);
        
        dispatch({ 
          type: 'posts/setAll', 
          payload: pagePosts 
        });
        
        dispatch(setPagination({
          currentPage: page,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        }));
      } else {
        dispatch(fetchPostsByCourseGroup({ courseGroupId: 18, page }));
      }
    }
  };

  const handlePrevPage = () => {
    if (hasPrevPage) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (hasNextPage) {
      handlePageChange(currentPage + 1);
    }
  };

  // Логика отображения постов согласно дизайну
  const [featured, leftGrid, rightList] = useMemo(() => {
    const arr = filtered;
    
    console.log('Current page:', currentPage, 'Total pages:', totalPages, 'Has next:', hasNextPage, 'Has prev:', hasPrevPage);
    
    if (currentPage === 1 && !isFavView) {
      // Первая страница: featured пост + сетка
      return [arr[0] ?? null, arr.slice(1, 5), arr.slice(5, 13)];
    } else {
      // Остальные страницы: тот же layout, но без featured поста
      // Левая колонка: 4 средних поста, правая колонка: 8 маленьких постов
      return [null, arr.slice(0, 4), arr.slice(4, 12)];
    }
  }, [filtered, currentPage, isFavView]);

  if (postsErr)
    return (
      <div className={styles.page}>
        <p>Failed to load: {postsErr}</p>
      </div>
    );

  // Отладочная информация
  console.log('Rendering pagination:', { totalPages, currentPage, hasNextPage, hasPrevPage });

  return (
    <LoadingOverlay isLoading={postsLoading} message="Loading posts...">
      <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.pageTitle}>{isFavView ? 'Favorites' : 'Blog'}</h1>
        <div className={styles.tabsWrap}>
          <Tabs items={items} value={tab} onChange={onTabChange} />
        </div>
      </header>

      {filtered.length === 0 ? (
        <div style={{ padding: '24px 0' }}>
          <p>{isFavView ? 'No favorites yet.' : 'No results.'}</p>
        </div>
      ) : isFavView ? (
        <section className={styles.colLeft}>
          <div className={styles.leftGrid}>
            {filtered.map((p) => (
              <Link key={p.id} to={`/posts/${p.id}`} className={styles.cardLink}>
                <PostCardBase
                  post={p}
                  variant="vertical"
                  isBookmarked={isFav(p.id)}
                  onBookmarkToggle={() => onToggle(p.id)}
                />
              </Link>
            ))}
          </div>
        </section>
      ) : (
        // Все страницы используют одинаковый layout (с featured постом или без)
        <div className={styles.layout}>
          <section className={styles.colLeft}>
            {/* Заглавный пост (только на первой странице) */}
            {featured && (
              <div className={styles.featured}>
                <Link to={`/posts/${featured.id}`} className={styles.cardLink}>
                  <PostCardBase
                    post={featured}
                    variant="featured"
                    isBookmarked={isFav(featured.id)}
                    onBookmarkToggle={() => onToggle(featured.id)}
                    onLike={() => handleLike(featured.id)}
                    onDislike={() => handleDislike(featured.id)}
                    onEdit={() => handleEdit(featured.id)}
                    onDelete={() => handleDelete(featured.id)}
                  />
                </Link>
              </div>
            )}

            {/* Левая сетка - средние посты */}
            <div className={styles.leftGrid}>
              {leftGrid.map((p) => (
                <Link key={p.id} to={`/posts/${p.id}`} className={styles.cardLink}>
                  <PostCardBase
                    post={p}
                    variant="vertical"
                    isBookmarked={isFav(p.id)}
                    onBookmarkToggle={() => onToggle(p.id)}
                    onLike={() => handleLike(p.id)}
                    onDislike={() => handleDislike(p.id)}
                    onEdit={() => handleEdit(p.id)}
                    onDelete={() => handleDelete(p.id)}
                  />
                </Link>
              ))}
            </div>
          </section>

          <section className={styles.colRight}>
            {/* Правая колонка - малые посты */}
            <div className={styles.rightList}>
              {rightList.map((p) => (
                <Link key={p.id} to={`/posts/${p.id}`} className={styles.cardLink}>
                  <PostCardBase
                    post={p}
                    variant="compact"
                    isBookmarked={isFav(p.id)}
                    onBookmarkToggle={() => onToggle(p.id)}
                    onLike={() => handleLike(p.id)}
                    onDislike={() => handleDislike(p.id)}
                    onEdit={() => handleEdit(p.id)}
                    onDelete={() => handleDelete(p.id)}
                  />
                </Link>
              ))}
            </div>
          </section>
        </div>
      )}

      <nav className={styles.pagination} aria-label="Pagination">
        <button 
          className={styles.prev} 
          disabled={!hasPrevPage}
          onClick={handlePrevPage}
        >
          ← Prev
        </button>
        <div className={styles.pages}>
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            const pageNum = i + 1;
            const isActive = pageNum === currentPage;
            return (
              <button
                key={pageNum}
                className={isActive ? styles.active : ''}
                onClick={() => handlePageChange(pageNum)}
                aria-current={isActive ? 'page' : undefined}
              >
                {pageNum}
              </button>
            );
          })}
          {totalPages > 5 && (
            <>
              <span>...</span>
              <button onClick={() => handlePageChange(totalPages)}>
                {totalPages}
              </button>
            </>
          )}
        </div>
        <button 
          className={styles.next} 
          disabled={!hasNextPage}
          onClick={handleNextPage}
        >
          Next →
        </button>
      </nav>
      </div>
    </LoadingOverlay>
  );
}
