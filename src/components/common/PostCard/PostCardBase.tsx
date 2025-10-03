import React from "react";
import styles from "./PostCard.module.css";
import type { Post } from "./PostCard.types";
import { LikeIcon, DislikeIcon, BookmarkIcon, MoreIcon } from "./icons";

type Variant = "wide" | "vertical" | "compact";

type Props = {
  post: Post;
  variant: Variant;
  href?: string;
  onBookmarkToggle?: () => void;
};

export default function PostCardBase({ post, variant, href, onBookmarkToggle }: Props) {
  const hasImage = !!post.image;

  const Media = hasImage ? (
    <div className={styles.media}>
      <img src={post.image as string} alt={post.title} loading="lazy" />
    </div>
  ) : (
    <div className={`${styles.media} ${styles.placeholder}`} aria-hidden="true" />
  );

  const Content = (
    <div className={styles.content}>
      <div className={styles.meta}>
        <span className={styles.date}>{post.date}</span>
      </div>

      {href ? (
        <a className={styles.titleLink} href={href}>
          {post.title}
        </a>
      ) : (
        <h3 className={styles.title}>{post.title}</h3>
      )}

      {variant !== "compact" && <p className={styles.text}>{post.text}</p>}
    </div>
  );

const Actions = (
  <div className={styles.actions} aria-label="Post actions">
    <div className={styles.actionsLeft}>
      <button className={styles.iconBtn} type="button" aria-label="Like">
        <LikeIcon className={styles.icon} />
      </button>
      <button className={styles.iconBtn} type="button" aria-label="Dislike">
        <DislikeIcon className={styles.icon} />
      </button>
    </div>

    <div className={styles.actionsRight}>
      <button
        className={styles.iconBtn}
        type="button"
        aria-label="Bookmark"
        onClick={onBookmarkToggle}
      >
        <BookmarkIcon className={styles.icon} />
      </button>
      <button className={styles.iconBtn} type="button" aria-label="More">
        <MoreIcon className={styles.icon} />
      </button>
    </div>
  </div>
);

  const rightSided = variant === "wide" || variant === "compact";

  return (
    <article className={`${styles.card} ${styles[variant]}`}>
        {rightSided ? (<>{Content}{Media}</>) : (<>{Media}{Content}</>)} 

        <div className={styles.actions}>
        <div className={styles.actionsLeft}>
        <button className={styles.iconBtn} aria-label="Like"><LikeIcon className={styles.icon}/></button>
        <button className={styles.iconBtn} aria-label="Dislike"><DislikeIcon className={styles.icon}/></button>
        </div>
        <div className={styles.actionsRight}>
        <button className={styles.iconBtn} aria-label="Bookmark"><BookmarkIcon className={styles.icon}/></button>
        <button className={styles.iconBtn} aria-label="More"><MoreIcon className={styles.icon}/></button>
        </div>
    </div>

    <div className={styles.divider}/>    
  </article>
  );
}
