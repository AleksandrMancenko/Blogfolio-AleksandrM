import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Post } from '../../api/posts.types';

type SearchResultsState = {
  results: Post[];
  loading: boolean;
  error: string | null;
  query: string;
};

const initialState: SearchResultsState = {
  results: [],
  loading: false,
  error: null,
  query: '',
};

const searchResultsSlice = createSlice({
  name: 'searchResults',
  initialState,
  reducers: {
    setQuery(state, action: PayloadAction<string>) {
      state.query = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setResults(state, action: PayloadAction<Post[]>) {
      state.results = action.payload;
      state.loading = false;
      state.error = null;
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
    clearResults(state) {
      state.results = [];
      state.loading = false;
      state.error = null;
      state.query = '';
    },
  },
});

export const { setQuery, setLoading, setResults, setError, clearResults } = searchResultsSlice.actions;
export const selectSearchResults = (state: { searchResults: SearchResultsState }) => state.searchResults.results;
export const selectSearchLoading = (state: { searchResults: SearchResultsState }) => state.searchResults.loading;
export const selectSearchError = (state: { searchResults: SearchResultsState }) => state.searchResults.error;
export const selectSearchQuery = (state: { searchResults: SearchResultsState }) => state.searchResults.query;
export default searchResultsSlice.reducer;

