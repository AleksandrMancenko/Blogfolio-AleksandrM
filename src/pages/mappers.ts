import type { Article } from "../api/spaceflight";
import type { Post } from "../components/common";

const fallbackImg = (seed: number | string) =>
  `https://picsum.photos/seed/space-${seed}/1200/675`;

export function articleToPost(a: Article): Post {
  return {
    id: a.id,
    image: a.image_url ?? fallbackImg(a.id),
    text: a.summary ?? "",
    date: new Date(a.published_at).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
    lesson_num: 0,
    title: a.title,
    author: 1,
  };
}
