import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import type { Post } from '../../api/posts.types';
import type { RootState, AppDispatch } from '../../store';
import { get } from '../../api/student';
import { createPost, updatePost, deletePost } from '../../api/postsService';
import { addNotification } from '../notifications/notificationSlice';

type PostsState = {
  items: Post[];
  loaded: boolean;
  loading: boolean;
  error?: string | null;
  currentPost: Post | null;
  currentPostLoading: boolean;
  currentPostError?: string | null;
  // Пагинация
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

const initialState: PostsState = {
  items: [],
  loaded: false,
  loading: false,
  error: null,
  currentPost: null,
  currentPostLoading: false,
  currentPostError: null,
  currentPage: 1,
  totalPages: 1,
  hasNextPage: false,
  hasPrevPage: false,
};

// Async thunk для загрузки постов с фильтром по группе курса
export const fetchPostsByCourseGroup = createAsyncThunk(
  'posts/fetchByCourseGroup',
  async ({ courseGroupId = 18, page = 1 }: { courseGroupId?: number; page?: number } = {}) => {
    console.log('Fetching posts with params:', { courseGroupId, page });
    
    try {
      const response = await get<{
        count: number;
        next: string | null;
        previous: string | null;
        results: Array<{
          id: number;
          image: string | null;
          text: string;
          date: string;
          lesson_num: number;
          title: string;
          description: string;
          author: number;
        }>;
      }>('/blog/posts/', {
        author__course_group: courseGroupId,
        limit: 12, // Оптимальный лимит для продакшена
        offset: (page - 1) * 12,
        ordering: '-date',
      });

      console.log('API Response:', response);
      console.log('API Response details:', {
        count: response.count,
        next: response.next,
        previous: response.previous,
        resultsLength: response.results.length
      });

      // Преобразуем DTO в Post
      const posts = response.results.map((dto) => ({
        id: dto.id,
        title: dto.title,
        text: dto.description || dto.text,
        date: dto.date,
        image: dto.image || undefined,
        lesson_num: dto.lesson_num,
        author: dto.author,
        likes: Math.floor(Math.random() * 200) + 10, // Генерируем случайные лайки для демо
        dislikes: Math.floor(Math.random() * 20) + 1, // Генерируем случайные дизлайки для демо
      }));

      // Вычисляем информацию о пагинации
      const totalPages = Math.ceil(response.count / 12);
      const hasNextPage = !!response.next;
      const hasPrevPage = !!response.previous;

      console.log('Processed posts:', posts.length, 'Total pages:', totalPages);

      return {
        posts,
        pagination: {
          currentPage: page,
          totalPages,
          hasNextPage,
          hasPrevPage,
          totalCount: response.count,
        },
      };
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  },
);

// Async thunk для создания поста
export const createNewPost = createAsyncThunk(
  'posts/create',
  async (postData: Parameters<typeof createPost>[0], { dispatch }) => {
    try {
      const newPost = await createPost(postData);
      dispatch(addNotification({
        type: 'success',
        title: 'Success!',
        message: 'Post created successfully',
        duration: 3000,
      }));
      return newPost;
    } catch (error: any) {
      dispatch(addNotification({
        type: 'error',
        title: 'Error',
        message: error.message || 'Failed to create post',
        duration: 5000,
      }));
      throw error;
    }
  },
);

// Async thunk для обновления поста
export const updateExistingPost = createAsyncThunk(
  'posts/update',
  async ({ id, data }: { id: number; data: Parameters<typeof updatePost>[1] }, { dispatch }) => {
    try {
      const updatedPost = await updatePost(id, data);
      dispatch(addNotification({
        type: 'success',
        title: 'Success!',
        message: 'Post updated successfully',
        duration: 3000,
      }));
      return updatedPost;
    } catch (error: any) {
      dispatch(addNotification({
        type: 'error',
        title: 'Error',
        message: error.message || 'Failed to update post',
        duration: 5000,
      }));
      throw error;
    }
  },
);

// Async thunk для удаления поста
export const deleteExistingPost = createAsyncThunk(
  'posts/delete',
  async (id: number, { dispatch }) => {
    try {
      await deletePost(id);
      dispatch(addNotification({
        type: 'success',
        title: 'Success!',
        message: 'Post deleted successfully',
        duration: 3000,
      }));
      return id;
    } catch (error: any) {
      dispatch(addNotification({
        type: 'error',
        title: 'Error',
        message: error.message || 'Failed to delete post',
        duration: 5000,
      }));
      throw error;
    }
  },
);

// Async thunk для загрузки отдельного поста (публичный запрос)
export const fetchPostById = createAsyncThunk(
  'posts/fetchById',
  async (id: number) => {
    const dto = await get<{
      id: number;
      image: string | null;
      text: string;
      date: string;
      lesson_num: number;
      title: string;
      description: string;
      author: number;
    }>(`/blog/posts/${id}/`);

    // Преобразуем DTO в Post
    return {
      id: dto.id,
      title: dto.title,
      text: dto.description || dto.text,
      date: dto.date,
      image: dto.image || undefined,
      lesson_num: dto.lesson_num,
      author: dto.author,
      likes: Math.floor(Math.random() * 200) + 10, // Генерируем случайные лайки для демо
      dislikes: Math.floor(Math.random() * 20) + 1, // Генерируем случайные дизлайки для демо
    };
  },
);

const slice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setAll(state, action: PayloadAction<Post[]>) {
      state.items = action.payload;
      state.loaded = true;
      state.loading = false;
      state.error = null;
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loaded = true;
      state.loading = false;
    },
    clear(state) {
      state.items = [];
      state.loaded = false;
      state.loading = false;
      state.error = null;
      state.currentPost = null;
      state.currentPostLoading = false;
      state.currentPostError = null;
      state.currentPage = 1;
      state.totalPages = 1;
      state.hasNextPage = false;
      state.hasPrevPage = false;
    },
    setPagination(state, action: PayloadAction<{
      currentPage: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    }>) {
      state.currentPage = action.payload.currentPage;
      state.totalPages = action.payload.totalPages;
      state.hasNextPage = action.payload.hasNextPage;
      state.hasPrevPage = action.payload.hasPrevPage;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPostsByCourseGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPostsByCourseGroup.fulfilled, (state, action) => {
        state.loading = false;
        state.loaded = true;
        state.items = action.payload.posts;
        state.currentPage = action.payload.pagination.currentPage;
        state.totalPages = action.payload.pagination.totalPages;
        state.hasNextPage = action.payload.pagination.hasNextPage;
        state.hasPrevPage = action.payload.pagination.hasPrevPage;
        state.error = null;
      })
      .addCase(fetchPostsByCourseGroup.rejected, (state, action) => {
        state.loading = false;
        state.loaded = true;
        state.error = action.error.message || 'Failed to fetch posts';
      })
      // Create post cases
      .addCase(createNewPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNewPost.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload); // Добавляем новый пост в начало списка
        state.error = null;
      })
      .addCase(createNewPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create post';
      })
      // Update post cases
      .addCase(updateExistingPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateExistingPost.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(post => post.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateExistingPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update post';
      })
      // Delete post cases
      .addCase(deleteExistingPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteExistingPost.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(post => post.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteExistingPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete post';
      })
      // Fetch post by ID cases
      .addCase(fetchPostById.pending, (state) => {
        state.currentPostLoading = true;
        state.currentPostError = null;
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        state.currentPostLoading = false;
        state.currentPost = action.payload;
        state.currentPostError = null;
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        state.currentPostLoading = false;
        state.currentPost = null;
        state.currentPostError = action.error.message || 'Failed to fetch post';
      });
  },
});

export const { setAll, setError, clear, setPagination } = slice.actions;
export const selectPosts = (s: RootState) => s.posts.items;
export const selectPostsLoaded = (s: RootState) => s.posts.loaded;
export const selectPostsLoading = (s: RootState) => s.posts.loading;
export const selectPostsError = (s: RootState) => s.posts.error;
export const selectCurrentPost = (s: RootState) => s.posts.currentPost;
export const selectCurrentPostLoading = (s: RootState) => s.posts.currentPostLoading;
export const selectCurrentPostError = (s: RootState) => s.posts.currentPostError;
export const selectCurrentPage = (s: RootState) => s.posts.currentPage;
export const selectTotalPages = (s: RootState) => s.posts.totalPages;
export const selectHasNextPage = (s: RootState) => s.posts.hasNextPage;
export const selectHasPrevPage = (s: RootState) => s.posts.hasPrevPage;
export default slice.reducer;
