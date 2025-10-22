import { useParams, Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { get } from "../../api/student";
import styles from "./SelectedPost.module.css";
import { useAppSelector } from "../../store/hooks";
import { selectPosts } from "../../features/posts/postsSlice";
import type { Post as CardPost } from "../../components/common/PostCard/PostCard.types";

type PostDto = {
  id: number;
  image: string | null;
  text: string;
  date: string;
  lesson_num: number;
  title: string;
  description: string;
  author: number; 
};

function dtoToPost(dto: PostDto): CardPost {
  return {
    id: dto.id,
    title: dto.title,
    text: dto.description || dto.text,
    date: dto.date,
    image: dto.image || undefined,
    lesson_num: dto.lesson_num,
    author: dto.author, 
  };
}

const USE_MOCK = process.env.REACT_APP_USE_MOCK === "1";

export default function SelectedPost() {
  const params = useParams<{ id: string }>();
  const id = useMemo(() => Number(params.id), [params.id]);

  const all = useAppSelector(selectPosts);

  const [post, setPost] = useState<CardPost | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!Number.isFinite(id)) {
        setErr("Invalid id");
        setLoading(false);
        return;
      }

      setLoading(true);
      setErr(null);

      // 1) быстрый рендер из Redux
      const fromStore = all.find((x) => x.id === id) || null;
      if (fromStore) {
        setPost(fromStore);
        if (USE_MOCK) {
          setLoading(false);
          return;
        }
      }

      // 2) в боевом режиме — дозагрузка по API
      if (!USE_MOCK) {
        try {
          const dto = await get<PostDto>(`/blog/posts/${id}/`);
          if (!cancelled) setPost(dtoToPost(dto));
        } catch (e) {
          if (!cancelled) setErr(String(e));
        } finally {
          if (!cancelled) setLoading(false);
        }
      } else {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id, all]);

  if (!Number.isFinite(id)) return <div style={{ padding: 24 }}>Invalid post id</div>;
  if (loading) return <div style={{ padding: 24 }}>Loading…</div>;
  if (err || !post) return <div style={{ padding: 24 }}>Failed to load: {err ?? "Not found"}</div>;

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
