import { useParams, Link } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
import styles from './SelectedPost.module.css';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  fetchPostById,
  selectCurrentPost,
  selectCurrentPostLoading,
  selectCurrentPostError,
  selectPosts,
} from '../../features/posts/postsSlice';
import LoadingOverlay from '../../components/common/LoadingOverlay';
import type { Post } from '../../api/posts.types';

const USE_MOCK = process.env.REACT_APP_USE_MOCK === '1';

export default function SelectedPost() {
  const params = useParams<{ id: string }>();
  const id = useMemo(() => Number(params.id), [params.id]);
  const dispatch = useAppDispatch();

  // Получаем данные из Redux store
  const currentPost = useAppSelector(selectCurrentPost);
  const loading = useAppSelector(selectCurrentPostLoading);
  const error = useAppSelector(selectCurrentPostError);
  const allPosts = useAppSelector(selectPosts);

  useEffect(() => {
    if (!Number.isFinite(id)) {
      return;
    }

    // Сначала проверяем, есть ли пост в списке всех постов
    const postFromList = allPosts.find((post) => post.id === id);

    if (postFromList && USE_MOCK) {
      // В mock режиме используем данные из списка
      return;
    }

    // Загружаем пост по API (публичный запрос, не требует авторизации)
    dispatch(fetchPostById(id));
  }, [id, dispatch, allPosts]);

  if (!Number.isFinite(id)) {
    return (
      <div className={styles.page}>
        <div style={{ padding: 24 }}>Invalid post id</div>
      </div>
    );
  }

  // В mock режиме используем пост из списка
  const post = USE_MOCK ? allPosts.find((p) => p.id === id) : currentPost;

  if (loading) {
    return (
      <div className={styles.page}>
        <LoadingOverlay isLoading={true} message="Loading post...">
          <div style={{ padding: 24 }}>Loading...</div>
        </LoadingOverlay>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className={styles.page}>
        <div style={{ padding: 24 }}>Failed to load: {error ?? 'Post not found'}</div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <nav className={styles.breadcrumbs}>
        <Link to="/">← Back to blog</Link>
      </nav>

      <article className={styles.article}>
        <header className={styles.header}>
          <h1 className={styles.title}>{post.title}</h1>
          <div className={styles.meta}>
            <time dateTime={post.date}>{new Date(post.date).toLocaleDateString()}</time>
            <span className={styles.lesson}>Lesson {post.lesson_num}</span>
          </div>
        </header>

        {post.image && (
          <div className={styles.media}>
            <img src={post.image} alt={post.title} />
          </div>
        )}

        <section className={styles.content}>
          <p>{post.text}</p>
        </section>
      </article>
    </div>
  );
}
