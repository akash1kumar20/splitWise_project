import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  theme: JSON.parse(localStorage.getItem("theme")) || null,
};

const themeSlice = createSlice({
  name: "theme",
  initialState: initialState,
  reducers: {
    setTheme(state, action) {
      state.theme = !!action.payload;
      localStorage.setItem("theme", action.payload);
    },
  },
});

export const themeSliceActions = themeSlice.actions;
export default themeSlice;
