import { configureStore } from "@reduxjs/toolkit";
import expenseSheetSlice from "./expenseSheetSlice";
import themeSlice from "./themeSlice";
import passwordSlice from "./passwordSlice";
const store = configureStore({
  reducer: {
    expenseSheet: expenseSheetSlice.reducer,
    theme: themeSlice.reducer,
    password: passwordSlice.reducer,
  },
});

export default store;
