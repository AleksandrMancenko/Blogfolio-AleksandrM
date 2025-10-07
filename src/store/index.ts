import { configureStore } from "@reduxjs/toolkit";
import ui from "../features/ui/uiSlice";
import search from "../features/search/searchSlice";

export const store = configureStore({
  reducer: { ui, search },
});

export type RootState  = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
