import styles from './PostCard.module.css';
import type { Post } from '../../../api/posts.types';
import { LikeIcon, DislikeIcon, BookmarkIcon, BookmarkFilledIcon } from './icons';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { selectIsAuthenticated } from '../../../features/auth/authSlice';
import { openSingle } from '../../../features/preview/previewSlice';
import { initializePost, toggleLike, toggleDislike } from '../../../features/likes/likesSlice';
import MoreMenu from './MoreMenu';
import React, { useEffect } from 'react';

type Variant = 'wide' | 'vertical' | 'compact' | 'featured';

type Props = {
  post: Post;
  variant: Variant;
  href?: string;
  onBookmarkToggle?: () => void;
  isBookmarked?: boolean;
  hideDivider?: boolean;
  onLike?: () => void;
  onDislike?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

export default function PostCardBase({
  post,
  variant,
  href,
  onBookmarkToggle,
  isBookmarked,
  hideDivider,
  onLike,
  onDislike,
  onEdit,
  onDelete,
}: Props) {
  const dispatch = useAppDispatch();
  const isCompact = variant === 'compact';
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  // Получаем состояние лайков для этого поста
  const likesState = useAppSelector((state) => state.likes[post.id]);

  // Инициализируем пост в Redux при первом рендере
  useEffect(() => {
    if (!likesState) {
      dispatch(
        initializePost({
          postId: post.id,
          likes: post.likes,
          dislikes: post.dislikes,
        }),
      );
    }
  }, [dispatch, post.id, post.likes, post.dislikes, likesState]);

  const openPreview = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!post.image) return;
    dispatch(openSingle({ src: post.image, href }));
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onBookmarkToggle?.();
  };

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleLike(post.id));
    onLike?.();
  };

  const handleDislike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleDislike(post.id));
    onDislike?.();
  };

  const Media = post.image ? (
    <button
      type="button"
      className={`${styles.media} ${styles.mediaBtn}`}
      onClick={openPreview}
      aria-label="Open image preview"
    >
      <img src={post.image} alt={post.title} loading="lazy" />
    </button>
  ) : (
    <div className={`${styles.media} ${styles.placeholder}`} aria-hidden="true" />
  );

  const Title = href ? (
    <a className={styles.titleLink} href={href}>
      {post.title}
    </a>
  ) : (
    <h3 className={styles.title}>{post.title}</h3>
  );

  return (
    <article className={`${styles.card} ${styles[variant]}`}>
      {variant === 'wide' || variant === 'compact' ? (
        <>
          <div className={styles.content}>
            <div className={styles.meta}>
              <span className={styles.date}>{post.date}</span>
            </div>
            {Title}
            {!isCompact && <p className={styles.text}>{post.text}</p>}
          </div>
          {Media}
        </>
      ) : (
        <>
          {Media}
          <div className={styles.content}>
            <div className={styles.meta}>
              <span className={styles.date}>{post.date}</span>
            </div>
            {Title}
            <p className={styles.text}>{post.text}</p>
          </div>
        </>
      )}

      <div className={styles.actions} aria-label="Post actions">
        <div className={styles.actionsLeft}>
          <button
            className={`${styles.iconBtn} ${likesState?.userLiked ? styles.iconBtnActive : ''}`}
            type="button"
            aria-label="Like"
            onClick={handleLike}
          >
            <LikeIcon className={styles.icon} />
            <span className={styles.counter}>{likesState?.likes ?? post.likes}</span>
          </button>
          <button
            className={`${styles.iconBtn} ${likesState?.userDisliked ? styles.iconBtnActive : ''}`}
            type="button"
            aria-label="Dislike"
            onClick={handleDislike}
          >
            <DislikeIcon className={styles.icon} />
            <span className={styles.counter}>{likesState?.dislikes ?? post.dislikes}</span>
          </button>
        </div>
        <div className={styles.actionsRight}>
          {isAuthenticated && (
            <button
              className={`${styles.iconBtn} ${isBookmarked ? styles.iconBtnActive : ''}`}
              type="button"
              aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
              aria-pressed={isBookmarked ? true : false}
              onClick={handleBookmark}
            >
              {isBookmarked ? (
                <BookmarkFilledIcon className={styles.icon} />
              ) : (
                <BookmarkIcon className={styles.icon} />
              )}
            </button>
          )}
          <MoreMenu onEdit={onEdit || (() => {})} onDelete={onDelete || (() => {})} />
        </div>
      </div>

      {!hideDivider && <div className={styles.divider} />}
    </article>
  );
}
