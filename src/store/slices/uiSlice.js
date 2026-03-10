import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  searchText: "",
  showSuggestions: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setSearchText(state, action) {
      state.searchText = action.payload;
    },
    setShowSuggestions(state, action) {
      state.showSuggestions = action.payload;
    },
  },
});

export const { setSearchText, setShowSuggestions } = uiSlice.actions;
export default uiSlice.reducer;
