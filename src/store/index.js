import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import notesReducer from "./slices/notesSlice";
import uiReducer from "./slices/uiSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    notes: notesReducer,
    ui: uiReducer,
  },
});
