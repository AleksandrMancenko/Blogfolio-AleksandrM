import { httpGet, httpPost, httpPut, httpDel } from './http';
import { PostDto, Post, fromDto } from './posts.types';

// GET /blog/posts/
export async function fetchPosts(): Promise<Post[]> {
  const list = await httpGet<PostDto[]>('/blog/posts/');
  return list.map(fromDto);
}

// GET /blog/posts/{id}/
export async function fetchPost(id: number): Promise<Post> {
  const dto = await httpGet<PostDto>(`/blog/posts/${id}/`);
  return fromDto(dto);
}

// POST /blog/posts/  (image: binary)
export type CreatePostReq = {
  image?: File | null;
  text: string;
  lesson_num: number;
  title: string;
  description: string;
};

export async function createPost(data: CreatePostReq): Promise<Post> {
  const fd = new FormData();
  if (data.image) fd.append('image', data.image);
  fd.append('text', data.text);
  fd.append('lesson_num', String(data.lesson_num));
  fd.append('title', data.title);
  fd.append('description', data.description);

  const dto = await httpPost<PostDto>('/blog/posts/', fd);
  return fromDto(dto);
}

// PUT /blog/posts/{id}/  (тоже multipart)
export async function updatePost(
  id: number,
  data: Partial<CreatePostReq> & { date?: string; author?: number },
) {
  const fd = new FormData();
  if (data.image) fd.append('image', data.image);
  if (data.text) fd.append('text', data.text);
  if (data.title) fd.append('title', data.title);
  if (data.description) fd.append('description', data.description);
  if (data.lesson_num != null) fd.append('lesson_num', String(data.lesson_num));
  if (data.date) fd.append('date', data.date);
  if (data.author != null) fd.append('author', String(data.author));

  const dto = await httpPut<PostDto>(`/blog/posts/${id}/`, fd);
  return fromDto(dto);
}

// DELETE /blog/posts/{id}/
export async function deletePost(id: number): Promise<void> {
  await httpDel<void>(`/blog/posts/${id}/`);
}
