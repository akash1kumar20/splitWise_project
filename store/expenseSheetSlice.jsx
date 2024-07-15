import { createSlice } from "@reduxjs/toolkit";

const sheeetInitialState = {
  token: localStorage.getItem("split-token") || null,
  userMail: localStorage.getItem("user-mail") || null,
  convertedMail: localStorage.getItem("changed-mail") || null,
  inviteCode: localStorage.getItem("inviteCode") || null,
  sheetCode: localStorage.getItem("sheetCode") || null,
  toEdit: [],
  sheetFoundData: [],
};

const expenseSheetSlice = createSlice({
  name: "expenseSheet",
  initialState: sheeetInitialState,
  reducers: {
    setToken(state, action) {
      state.token = action.payload;
      localStorage.setItem("split-token", action.payload);
    },
    setUserMail(state, action) {
      state.userMail = action.payload;
      localStorage.setItem("user-mail", action.payload);
    },
    setChangedMail(state, action) {
      state.convertedMail = action.payload;
      state.convertedMail = state.convertedMail
        .replace("@", "")
        .replace(".", "");

      localStorage.setItem("changed-mail", state.convertedMail);
    },
    setCodes(state, action) {
      state.sheetCode = action.payload.sheetCode;
      state.inviteCode = action.payload.inviteCode;
      localStorage.setItem("inviteCode", action.payload.inviteCode);
      localStorage.setItem("sheetCode", action.payload.sheetCode);
    },
    setExpenseToEdit(state, action) {
      state.toEdit = action.payload;
    },
    setSheetFoundData(state, action) {
      state.sheetFoundData = action.payload;
    },
  },
});
export const expenseSheetActions = expenseSheetSlice.actions;
export default expenseSheetSlice;
