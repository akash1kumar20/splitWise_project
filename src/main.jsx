import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthContextProvider } from "../store/auth-context.jsx";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import ChangePassword from "./accountAccess/ChangePassword.jsx";

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  {
    path: "/changePassword",
    element: <ChangePassword />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthContextProvider>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </AuthContextProvider>
);
