// Серверный DTO
export type PostDto = {
  id: number;
  image: string | null; // на всякий случай допускаем null
  text: string;
  date: string; // ISO date
  lesson_num: number;
  title: string;
  description: string;
  author: number;
};

// Основной тип Post (определяем здесь, чтобы избежать циклических импортов)
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

export function fromDto(dto: PostDto): Post {
  return {
    id: dto.id,
    image: dto.image || undefined,
    title: dto.title,
    text: dto.description || dto.text,
    date: dto.date,
    lesson_num: dto.lesson_num,
    author: dto.author,
    likes: Math.floor(Math.random() * 200) + 10, // Генерируем случайные лайки для демо
    dislikes: Math.floor(Math.random() * 20) + 1, // Генерируем случайные дизлайки для демо
  };
}
