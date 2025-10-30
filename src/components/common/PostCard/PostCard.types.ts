export type Post = {
  id: number;
  image?: string;
  text: string;
  date: string;
  lesson_num: number;
  title: string;
  author: number | string;
  likes: number;
  dislikes: number;
};
