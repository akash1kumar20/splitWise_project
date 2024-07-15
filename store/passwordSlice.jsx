import { createSlice } from "@reduxjs/toolkit";

const initalState = {
  submitPassword: false,
};

const passwordSlice = createSlice({
  name: "password",
  initialState: initalState,
  reducers: {
    submitPasswordToggle(state, action) {
      state.submitPassword = action.payload;
    },
  },
});

export const passwordSliceAction = passwordSlice.actions;
export default passwordSlice;
