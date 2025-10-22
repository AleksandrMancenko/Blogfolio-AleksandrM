import { Link } from "react-router-dom";
import Tabs, { type TabItem } from "../../components/common/Tabs";
import { PostCardWide, PostCardVertical, PostCardCompact, type Post } from "../../components/common";
import styles from "./AllPosts.module.css";
import { useEffect, useMemo, useState } from "react";
import { listArticles } from "../../api/spaceflight";
import { articleToPost } from "../mappers";
import { useAppSelector } from "../../store/hooks";

const items: TabItem[] = [
  { value: "all", label: "All" },
  { value: "fav", label: "My favorites" },
  { value: "pop", label: "Popular" },
];

export default function AllPosts(){
  const [tab, setTab] = useState("all");
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const query = useAppSelector((s) => s.search.query).trim().toLowerCase();

  useEffect(() => {
    listArticles(30)
      .then(r => setPosts(r.results.map(articleToPost)))
      .catch(e => setErr(String(e)));
  }, []);

const filtered = useMemo(() => {
    const arr = posts ?? [];
    if (!query) return arr;
    return arr.filter((p) =>
      `${p.title} ${p.text}`.toLowerCase().includes(query)
    );
  }, [posts, query]);

const [featured, leftGrid, rightList] = useMemo(() => {
    const arr = filtered;
    return [arr[0] ?? null, arr.slice(1, 7), arr.slice(7, 15)];
  }, [filtered]);

  if (err)
    return (
      <div className={styles.page}>
        <p>Failed to load: {err}</p>
      </div>
    );

  if (!posts)
    return (
      <div className={styles.page}>
        <p>Loading…</p>
      </div>
    );

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.pageTitle}>Blog</h1>
        <div className={styles.tabsWrap}>
          <Tabs items={items} value={tab} onChange={setTab}/>
        </div>
      </header>

      {filtered.length === 0 ? (
        <div style={{ padding: "24px 0" }}>
          <p>No results for “{query}”.</p>
        </div>
      ) : (
        <div className={styles.layout}>
          {/* Левая колонка */}
          <section className={styles.colLeft}>
            {featured && (
              <Link to={`/posts/${featured.id}`} className={styles.cardLink}>
                <PostCardWide post={featured} />
              </Link>
            )}

            <div className={styles.leftGrid}>
              {leftGrid.map((p) => (
                <Link key={p.id} to={`/posts/${p.id}`} className={styles.cardLink}>
                  <PostCardVertical post={p} />
                </Link>
              ))}
            </div>
          </section>

          {/* Правая колонка */}
          <aside className={styles.colRight}>
            <ul className={styles.rightList}>
              {rightList.map((p, i) => (
                <li key={`${p.id}-${i}`} className={styles.rightItem}>
                  <Link
                    to={`/posts/${p.id}`}
                    className={`${styles.cardLink} ${styles.rightRow}`}
                  >
                    <PostCardCompact post={p} />
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      )}

      <nav className={styles.pagination} aria-label="Pagination">
        <span className={styles.prev}>← Prev</span>
        <div className={styles.pages}>
          <a href="#" aria-current="page">1</a><a href="#">2</a><a href="#">3</a>
        </div>
        <span className={styles.next}>Next →</span>
      </nav>
    </div>
  );
}
