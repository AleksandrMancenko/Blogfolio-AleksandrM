import { get } from './client';

export type Article = {
  id: number;
  title: string;
  summary: string;
  image_url: string | null;
  published_at: string;
  url: string;
};

type Page<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export async function listArticles(limit = 16) {
  return get<Page<Article>>('/articles/', { limit, ordering: '-published_at' });
}

export async function getArticle(id: number) {
  return get<Article>(`/articles/${id}`);
}
