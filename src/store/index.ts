import { configureStore } from "@reduxjs/toolkit";
import ui     from "../features/ui/uiSlice";
import search from "../features/search/searchSlice";
import preview from "../features/preview/previewSlice";

export const store = configureStore({
  reducer: { ui, search, preview },
});

export type RootState  = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
