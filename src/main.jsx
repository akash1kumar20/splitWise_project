import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthContextProvider } from "../store/auth-context.jsx";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import ChangePassword from "./accountAccess/ChangePassword.jsx";
import Home from "./components/Home.jsx";
import CreateSheet from "./components/CreateSheet.jsx";
import Sheets from "./components/Sheets.jsx";
import FindSheet from "./components/FindSheet.jsx";
import SingleSheet from "./components/SingleSheet.jsx";
import WrongURL from "./ExtraComponents/WrongURL.jsx";
import { Provider } from "react-redux";
import store from "../store/index.js";
import FoundSheet from "./components/FoundSheet.jsx";
import UpdateExpense from "./Expenses/UpdateExpense.jsx";
import DisplayExpense from "./Expenses/DisplayExpense.jsx";

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  {
    path: "/changePassword",
    element: <ChangePassword />,
  },
  {
    path: "/home",
    element: <Home />,
    children: [
      {
        path: "/home/sheets",
        element: <Sheets />,
        children: [
          {
            path: "/home/sheets/addSheet",
            element: <CreateSheet />,
          },
          {
            path: "/home/sheets/findSheet",
            element: <FindSheet />,
          },
          {
            path: "/home/sheets/foundSheet",
            element: <FoundSheet />,
          },
        ],
      },
    ],
  },
  {
    path: "/home/sheets/:sheetName",
    element: <SingleSheet />,
    children: [
      {
        path: "/home/sheets/:sheetName/displayExpense",
        element: <DisplayExpense />,
      },
      {
        path: "/home/sheets/:sheetName/updateExpense",
        element: <UpdateExpense />,
      },
    ],
  },
  { path: "/*", element: <WrongURL /> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthContextProvider>
    <Provider store={store}>
      <React.StrictMode>
        <RouterProvider router={router} />
      </React.StrictMode>
    </Provider>
  </AuthContextProvider>
);
