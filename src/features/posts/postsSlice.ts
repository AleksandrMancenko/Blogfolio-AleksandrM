import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Post } from '../../components/common/PostCard/PostCard.types';
import type { RootState } from '../../store';

type PostsState = {
  items: Post[];
  loaded: boolean;
  error?: string | null;
};

const initialState: PostsState = { items: [], loaded: false, error: null };

const slice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setAll(state, action: PayloadAction<Post[]>) {
      state.items = action.payload;
      state.loaded = true;
      state.error = null;
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loaded = true;
    },
    clear(state) {
      state.items = [];
      state.loaded = false;
      state.error = null;
    },
  },
});

export const { setAll, setError, clear } = slice.actions;
export const selectPosts = (s: RootState) => s.posts.items;
export const selectPostsLoaded = (s: RootState) => s.posts.loaded;
export const selectPostsError = (s: RootState) => s.posts.error;
export default slice.reducer;
