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

// Наш UI-тип (можно оставить твой текущий Post)
export type Post = {
  id: number;
  image: string | null;
  title: string;
  text: string; // по месту используешь как надо
  date: string;
  description: string;
  lesson: number;
  authorId: number;
};

export function fromDto(dto: PostDto): Post {
  return {
    id: dto.id,
    image: dto.image,
    title: dto.title,
    text: dto.text,
    date: dto.date,
    description: dto.description,
    lesson: dto.lesson_num,
    authorId: dto.author,
  };
}
