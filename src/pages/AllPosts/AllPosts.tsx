import { Link } from "react-router-dom";
import Tabs, { type TabItem } from "../../components/common/Tabs";
import { PostCardWide, PostCardVertical, PostCardCompact, type Post } from "../../components/common";
import styles from "./AllPosts.module.css";
import { useEffect, useMemo, useState } from "react";
import { listArticles } from "../../api/spaceflight";
import { articleToPost } from "../mappers";

const items: TabItem[] = [
  { value: "all", label: "All" },
  { value: "fav", label: "My favorites" },
  { value: "pop", label: "Popular" },
];

// ★ сколько хотим слева/справа
const LEFT_COUNT = 6;
const RIGHT_COUNT = 7;

export default function AllPosts(){
  const [tab, setTab] = useState("all");
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    // ★ чуть больше элементов, чтобы обе колонки были плотными
    listArticles(LEFT_COUNT + RIGHT_COUNT + 2)
      .then(r => setPosts(r.results.map(articleToPost)))
      .catch(e => setErr(String(e)));
  }, []);

  const { featured, leftGrid, rightList } = useMemo(() => {
    const arr = (posts ?? []).filter(p => !!p.image); // ★ на всякий — без пустых картинок
    const f = arr[0];
    const left = arr.slice(1, 1 + LEFT_COUNT);                      // ★ 6 вертикальных
    const right = arr.slice(1 + LEFT_COUNT, 1 + LEFT_COUNT + RIGHT_COUNT); // ★ 12 компактных
    return { featured: f, leftGrid: left, rightList: right };
  }, [posts]);

  if (err) return <div className={styles.page}><p>Failed to load: {err}</p></div>;
  if (!posts) return <div className={styles.page}><p>Loading…</p></div>;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.pageTitle}>Blog</h1>
        <div className={styles.tabsWrap}>
          <Tabs items={items} value={tab} onChange={setTab}/>
        </div>
      </header>

      <div className={styles.layout}>
        {/* Левая колонка */}
        <section className={styles.colLeft}>
          {featured && (
            <Link to={`/posts/${featured.id}`} className={styles.cardLink}>
              <PostCardWide post={featured}/>
            </Link>
          )}

          <div className={styles.leftGrid}>
            {leftGrid.map(p => (
              <Link key={p.id} to={`/posts/${p.id}`} className={styles.cardLink}>
                <PostCardVertical post={p}/>
              </Link>
            ))}
          </div>
        </section>

        {/* Правая колонка */}
        <aside className={styles.colRight}>
          <ul className={styles.rightList}>
            {rightList.map(p => (
              <li key={p.id} className={styles.rightItem}>
                <Link to={`/posts/${p.id}`} className={`${styles.cardLink} ${styles.rightRow}`}>
                  <PostCardCompact post={p}/>
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </div>

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
