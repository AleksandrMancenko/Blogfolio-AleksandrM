import { configureStore } from '@reduxjs/toolkit';
import ui from '../features/ui/uiSlice';
import search from '../features/search/searchSlice';
import searchHistory from '../features/search/searchHistorySlice';
import searchResults from '../features/search/searchResultsSlice';
import preview from '../features/preview/previewSlice';
import posts from '../features/posts/postsSlice';
import favorites from '../features/favorites/favoritesSlice';
import likes from '../features/likes/likesSlice';
import auth from '../features/auth/authSlice';
import notifications from '../features/notifications/notificationSlice';

export const store = configureStore({
  reducer: {
    ui,
    search,
    searchHistory,
    searchResults,
    preview,
    posts,
    favorites,
    likes,
    auth,
    notifications,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
