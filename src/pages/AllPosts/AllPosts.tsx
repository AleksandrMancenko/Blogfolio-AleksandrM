import { Link, useLocation, useNavigate } from "react-router-dom";
import Tabs, { type TabItem } from "../../components/common/Tabs";
import PostCardBase from "../../components/common/PostCard/PostCardBase";
import type { Post } from "../../components/common/PostCard/PostCard.types";
import styles from "./AllPosts.module.css";
import { useEffect, useMemo, useState } from "react";
import { get, getAbs } from "../../api/student";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { selectFavoriteIds, toggle as toggleFav } from "../../features/favorites/favoritesSlice";
import {
  selectPosts,
  selectPostsLoaded,
  selectPostsError,
  setAll as setAllPosts,
  setError as setPostsError,
} from "../../features/posts/postsSlice";
import { seedPosts } from "../../features/posts/seed";

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

type Paginated<T> = { count: number; next: string | null; previous: string | null; results: T[] };

function dtoToPost(dto: PostDto): Post {
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

export default function AllPosts() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isFavPage = /^\/favorites(\/|$)/.test(pathname);

  const dispatch = useAppDispatch();
  const favIds = useAppSelector(selectFavoriteIds);
  const favCount = favIds.length;

  const posts         = useAppSelector(selectPosts);
  const postsLoaded   = useAppSelector(selectPostsLoaded);
  const postsErr      = useAppSelector(selectPostsError);

  const items: TabItem[] = useMemo(
    () => [
      { value: "all", label: "All" },
      { value: "fav", label: favCount ? `My favorites (${favCount})` : "My favorites" },
      { value: "pop", label: "Popular" },
    ],
    [favCount]
  );

  const [tab, setTab] = useState<string>(isFavPage ? "fav" : "all");

  useEffect(() => {
    if (isFavPage) setTab("fav");
    else if (tab === "fav") setTab("all");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFavPage]);

  const query = useAppSelector((s) => s.search.query).trim().toLowerCase();

  // Загрузка постов в Redux: mock или API
  useEffect(() => {
    if (postsLoaded) return;

    const TAKE = 30;

    async function loadApi() {
      try {
        const first = await get<Paginated<PostDto>>("/blog/posts/", { limit: TAKE, ordering: "-date" });
        const acc: PostDto[] = [...first.results];
        let nextUrl = first.next;
        while (acc.length < TAKE && nextUrl) {
          const page = await getAbs<Paginated<PostDto>>(nextUrl);
          acc.push(...page.results);
          nextUrl = page.next;
        }
        const mapped = acc.slice(0, TAKE).map(dtoToPost);
        dispatch(setAllPosts(mapped));
      } catch (e) {
        dispatch(setPostsError(String(e)));
      }
    }

    if (USE_MOCK) {
      dispatch(setAllPosts(seedPosts));
    } else {
      loadApi();
    }
  }, [dispatch, postsLoaded]);

  const onTabChange = (v: string) => {
    if (v === "fav") {
      if (!isFavPage) navigate("/favorites");
      setTab("fav");
      return;
    }
    if (isFavPage) navigate("/");
    setTab(v);
  };

  const filteredByQuery = useMemo(() => {
    const arr = posts ?? [];
    if (!query) return arr;
    return arr.filter((p) => `${p.title} ${p.text}`.toLowerCase().includes(query));
  }, [posts, query]);

  const filtered = useMemo(() => {
    if (tab === "fav") return filteredByQuery.filter((p) => favIds.includes(p.id));
    return filteredByQuery;
  }, [filteredByQuery, favIds, tab]);

  const isFavView = isFavPage || tab === "fav";

  const isFav = (id: number) => favIds.includes(id);
  const onToggle = (id: number) => dispatch(toggleFav(id));

  const [featured, leftGrid, rightList] = useMemo(() => {
    const arr = filtered;
    return [arr[0] ?? null, arr.slice(1, 5), arr.slice(5, 13)];
  }, [filtered]);

  if (postsErr) return <div className={styles.page}><p>Failed to load: {postsErr}</p></div>;
  if (!postsLoaded) return <div className={styles.page}><p>Loading…</p></div>;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.pageTitle}>{isFavView ? "Favorites" : "Blog"}</h1>
        <div className={styles.tabsWrap}>
          <Tabs items={items} value={tab} onChange={onTabChange} />
        </div>
      </header>

      {filtered.length === 0 ? (
        <div style={{ padding: "24px 0" }}>
          <p>{isFavView ? "No favorites yet." : `No results${query ? ` for “${query}”` : ""}.`}</p>
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
        <div className={styles.layout}>
          <section className={styles.colLeft}>
            {featured && (
              <div className={styles.featured}>
                <Link to={`/posts/${featured.id}`} className={styles.cardLink}>
                  <PostCardBase
                    post={featured}
                    variant="featured"
                    isBookmarked={isFav(featured.id)}
                    onBookmarkToggle={() => onToggle(featured.id)}
                  />
                </Link>
              </div>
            )}
            <div className={styles.leftGrid}>
              {leftGrid.map((p) => (
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

          <aside className={styles.colRight}>
            <ul className={styles.rightList}>
              {rightList.map((p) => (
                <li key={p.id} className={styles.rightItem}>
                  <Link to={`/posts/${p.id}`} className={`${styles.cardLink} ${styles.rightRow}`}>
                    <PostCardBase
                      post={p}
                      variant="compact"
                      isBookmarked={isFav(p.id)}
                      onBookmarkToggle={() => onToggle(p.id)}
                      hideDivider
                    />
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
