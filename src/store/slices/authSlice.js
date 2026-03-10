import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isReady: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    setReady(state, action) {
      state.isReady = action.payload;
    },
    logout(state) {
      state.user = null;
    },
  },
});

export const { setUser, setReady, logout } = authSlice.actions;
export default authSlice.reducer;
