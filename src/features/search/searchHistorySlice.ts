import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../store';

type SearchHistoryState = {
  queries: string[];
  maxHistory: number;
};

const initialState: SearchHistoryState = {
  queries: [],
  maxHistory: 10, // Максимум 10 запросов в истории
};

const searchHistorySlice = createSlice({
  name: 'searchHistory',
  initialState,
  reducers: {
    addQuery(state, action: PayloadAction<string>) {
      const query = action.payload.trim();
      if (!query) return;

      // Удаляем дубликаты
      state.queries = state.queries.filter((q) => q !== query);

      // Добавляем в начало
      state.queries.unshift(query);

      // Ограничиваем количество
      if (state.queries.length > state.maxHistory) {
        state.queries = state.queries.slice(0, state.maxHistory);
      }
    },
    removeQuery(state, action: PayloadAction<string>) {
      state.queries = state.queries.filter((q) => q !== action.payload);
    },
    clearHistory(state) {
      state.queries = [];
    },
  },
});

export const { addQuery, removeQuery, clearHistory } = searchHistorySlice.actions;
export const selectSearchHistory = (state: RootState) => state.searchHistory.queries;
export default searchHistorySlice.reducer;
