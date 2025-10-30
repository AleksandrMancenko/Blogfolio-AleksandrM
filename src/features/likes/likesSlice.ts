import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type LikesState = {
  [postId: number]: {
    likes: number;
    dislikes: number;
    userLiked: boolean;
    userDisliked: boolean;
  };
};

const initialState: LikesState = {};

const likesSlice = createSlice({
  name: 'likes',
  initialState,
  reducers: {
    initializePost: (
      state,
      action: PayloadAction<{ postId: number; likes: number; dislikes: number }>,
    ) => {
      const { postId, likes, dislikes } = action.payload;
      if (!state[postId]) {
        state[postId] = {
          likes,
          dislikes,
          userLiked: false,
          userDisliked: false,
        };
      }
    },
    toggleLike: (state, action: PayloadAction<number>) => {
      const postId = action.payload;
      const post = state[postId];

      if (!post) return;

      if (post.userLiked) {
        // Убираем лайк
        post.likes -= 1;
        post.userLiked = false;
      } else {
        // Добавляем лайк
        post.likes += 1;
        post.userLiked = true;

        // Если был дизлайк, убираем его
        if (post.userDisliked) {
          post.dislikes -= 1;
          post.userDisliked = false;
        }
      }
    },
    toggleDislike: (state, action: PayloadAction<number>) => {
      const postId = action.payload;
      const post = state[postId];

      if (!post) return;

      if (post.userDisliked) {
        // Убираем дизлайк
        post.dislikes -= 1;
        post.userDisliked = false;
      } else {
        // Добавляем дизлайк
        post.dislikes += 1;
        post.userDisliked = true;

        // Если был лайк, убираем его
        if (post.userLiked) {
          post.likes -= 1;
          post.userLiked = false;
        }
      }
    },
  },
});

export const { initializePost, toggleLike, toggleDislike } = likesSlice.actions;
export default likesSlice.reducer;
