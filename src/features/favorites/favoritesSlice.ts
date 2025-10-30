import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../store';

const STORAGE_KEY = 'favorites';

function load(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.filter((x) => Number.isFinite(x)) : [];
  } catch {
    return [];
  }
}

function save(ids: number[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {}
}

type State = { ids: number[] };
const initial: State = { ids: load() };

const slice = createSlice({
  name: 'favorites',
  initialState: initial,
  reducers: {
    add(s, a: PayloadAction<number>) {
      if (!s.ids.includes(a.payload)) {
        s.ids.push(a.payload);
        save(s.ids);
      }
    },
    remove(s, a: PayloadAction<number>) {
      s.ids = s.ids.filter((id) => id !== a.payload);
      save(s.ids);
    },
    toggle(s, a: PayloadAction<number>) {
      const id = a.payload;
      if (s.ids.includes(id)) {
        s.ids = s.ids.filter((x) => x !== id);
      } else {
        s.ids.push(id);
      }
      save(s.ids);
    },
    clear(s) {
      s.ids = [];
      save(s.ids);
    },
  },
});

export const { add, remove, toggle, clear } = slice.actions;
export const selectFavoriteIds = (s: RootState) => s.favorites.ids;
export const selectIsFavorite = (id: number) => (s: RootState) => s.favorites.ids.includes(id);
export default slice.reducer;
