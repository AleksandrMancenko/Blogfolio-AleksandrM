export type Post = {
    id: number;
    image?: string | null;
    text: string;
    date: string;
    lesson_num: number;
    title: string;
    author: number | string;
};