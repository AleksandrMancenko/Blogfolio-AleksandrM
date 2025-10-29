import styles from "./PostCard.module.css";
import type { Post } from "./PostCard.types";
import { LikeIcon, DislikeIcon, BookmarkIcon, BookmarkFilledIcon, MoreIcon } from "./icons";
import { useAppDispatch } from "../../../store/hooks";
import { openSingle } from "../../../features/preview/previewSlice";
import React from "react";

type Variant = "wide" | "vertical" | "compact" | "featured";

type Props = {
  post: Post;
  variant: Variant;
  href?: string;
  onBookmarkToggle?: () => void;
  isBookmarked?: boolean;
  hideDivider?: boolean;          // ← добавили
};

export default function PostCardBase({ post, variant, href, onBookmarkToggle, isBookmarked, hideDivider }: Props) {
  const dispatch = useAppDispatch();
  const isCompact = variant === "compact";

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
    <a className={styles.titleLink} href={href}>{post.title}</a>
  ) : (
    <h3 className={styles.title}>{post.title}</h3>
  );

  return (
    <article className={`${styles.card} ${styles[variant]}`}>
      {variant === "wide" || variant === "compact" ? (
        <>
          <div className={styles.content}>
            <div className={styles.meta}><span className={styles.date}>{post.date}</span></div>
            {Title}
            {!isCompact && <p className={styles.text}>{post.text}</p>}
          </div>
          {Media}
        </>
      ) : (
        <>
          {Media}
          <div className={styles.content}>
            <div className={styles.meta}><span className={styles.date}>{post.date}</span></div>
            {Title}
            <p className={styles.text}>{post.text}</p>
          </div>
        </>
      )}

      <div className={styles.actions} aria-label="Post actions">
        <div className={styles.actionsLeft}>
          <button className={styles.iconBtn} type="button" aria-label="Like"><LikeIcon className={styles.icon} /></button>
          <button className={styles.iconBtn} type="button" aria-label="Dislike"><DislikeIcon className={styles.icon} /></button>
        </div>
        <div className={styles.actionsRight}>
          <button
            className={`${styles.iconBtn} ${isBookmarked ? styles.iconBtnActive : ""}`}
            type="button"
            aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
            aria-pressed={isBookmarked ? true : false}
            onClick={handleBookmark}
          >
            {isBookmarked ? <BookmarkFilledIcon className={styles.icon} /> : <BookmarkIcon className={styles.icon} />}
          </button>
          <button className={styles.iconBtn} type="button" aria-label="More"><MoreIcon className={styles.icon} /></button>
        </div>
      </div>

      {!hideDivider && <div className={styles.divider} />}
    </article>
  );
}
