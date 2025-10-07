import { useParams, Link } from "react-router-dom";
import styles from "./SelectedPost.module.css";
import { LikeIcon, DislikeIcon, BookmarkIcon } from "../../components/common/PostCard/icons";
import { useEffect, useState } from "react";
import { getArticle } from "../../api/spaceflight";
import { articleToPost } from "../mappers";
import type { Post } from "../../components/common";

export default function SelectedPost() {
  const { id } = useParams<{ id?: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    getArticle(Number(id))
      .then(a => setPost(articleToPost(a)))
      .catch(e => setErr(String(e)));
  }, [id]);

  if (err) return <article className={styles.page}><p>Failed to load: {err}</p></article>;
  if (!post) return <article className={styles.page}><p>Loading…</p></article>;

  return (
    <article className={styles.page}>
      <div className={styles.breadcrumbs}>
        <Link to="/" className={styles.breadcrumbLink}>Home</Link> / <span>Post {post.id}</span>
      </div>

      <h1 className={styles.title}>{post.title}</h1>

      <img src={post.image} alt="" className={styles.image} loading="lazy" />

      <div className={styles.content}>
        <p>{post.text}</p>
      </div>

      <div className={styles.actions}>
        <div className={styles.left}>
          <button type="button" className={styles.iconBtn} aria-label="Like">
            <LikeIcon className={styles.icon} />
          </button>
          <button type="button" className={styles.iconBtn} aria-label="Dislike">
            <DislikeIcon className={styles.icon} />
          </button>
        </div>

        <button type="button" className={styles.addBtn}>
          <BookmarkIcon className={styles.icon} />
          <span>Add to favorites</span>
        </button>
      </div>

      <nav className={styles.postNav}>
        <a href="#" className={styles.navLink}>← Prev</a>
        <a href="#" className={styles.navLink}>Next →</a>
      </nav>
    </article>
  );
}
