import { createSlice } from '@reduxjs/toolkit';

export type Theme = 'light' | 'dark';

type UiState = {
  menuOpen: boolean;
  theme: Theme;
};

const initialState: UiState = {
  menuOpen: false,
  theme: 'light',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openMenu(state) {
      state.menuOpen = true;
    },
    closeMenu(state) {
      state.menuOpen = false;
    },
    toggleTheme(state) {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
  },
});

export const { openMenu, closeMenu, toggleTheme } = uiSlice.actions;
export default uiSlice.reducer;

// селекторы
export const selectMenuOpen = (s: { ui: UiState }) => s.ui.menuOpen;
export const selectTheme = (s: { ui: UiState }) => s.ui.theme;
