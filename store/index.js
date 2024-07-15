import { configureStore } from "@reduxjs/toolkit";
import expenseSheetSlice from "./expenseSheetSlice";
import themeSlice from "./themeSlice";
const store = configureStore({
  reducer: {
    expenseSheet: expenseSheetSlice.reducer,
    theme: themeSlice.reducer,
  },
});

export default store;
