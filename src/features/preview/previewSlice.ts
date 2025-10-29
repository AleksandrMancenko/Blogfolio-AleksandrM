import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../store';

type PreviewState = {
  open: boolean;
  images: string[];
  index: number;
  href?: string;
};

const initialState: PreviewState = { open: false, images: [], index: 0, href: undefined };

const previewSlice = createSlice({
  name: 'preview',
  initialState,
  reducers: {
    open(state, action: PayloadAction<{ images: string[]; index?: number; href?: string }>) {
      state.images = (action.payload.images || []).filter(Boolean);
      state.index = Math.min(action.payload.index ?? 0, Math.max(state.images.length - 1, 0));
      state.open = state.images.length > 0;
      state.href = action.payload.href;
    },
    openSingle(state, action: PayloadAction<{ src: string; href?: string }>) {
      state.images = [action.payload.src].filter(Boolean);
      state.index = 0;
      state.open = state.images.length > 0;
      state.href = action.payload.href;
    },
    close(state) {
      state.open = false;
      state.images = [];
      state.index = 0;
      state.href = undefined;
    },
    next(state) {
      if (state.images.length) {
        state.index = (state.index + 1) % state.images.length;
      }
    },
    prev(state) {
      if (state.images.length) {
        state.index = (state.index - 1 + state.images.length) % state.images.length;
      }
    },
  },
});

export const { open, openSingle, close, next, prev } = previewSlice.actions;

export const selectPreview = (s: RootState) => s.preview;
export const selectPreviewOpen = (s: RootState) => s.preview.open;
export const selectPreviewImages = (s: RootState) => s.preview.images;
export const selectPreviewIndex = (s: RootState) => s.preview.index;
export const selectPreviewHref = (s: RootState) => s.preview.href;

export default previewSlice.reducer;
