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
import WrongURL from "./ExtraComponents.jsx/WrongURL.jsx";
import { Provider } from "react-redux";
import store from "../store/index.js";
import FoundSheet from "./components/FoundSheet.jsx";

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
  { path: "/home/sheets/:sheetName", element: <SingleSheet /> },
  { path: "/*", element: <WrongURL /> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <AuthContextProvider>
      <React.StrictMode>
        <RouterProvider router={router} />
      </React.StrictMode>
    </AuthContextProvider>
  </Provider>
);
