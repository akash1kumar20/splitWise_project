import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthContextProvider } from "../store/auth-context.jsx";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "../store/index.js";
const Home = lazy(() => import("./components/Home.jsx"));
const CreateSheet = lazy(() => import("./components/CreateSheet.jsx"));
const Sheets = lazy(() => import("./components/Sheets.jsx"));
const FindSheet = lazy(() => import("./components/FindSheet.jsx"));
const SingleSheet = lazy(() => import("./components/SingleSheet.jsx"));
const WrongURL = lazy(() => import("./ExtraComponents/WrongURL.jsx"));
const FoundSheet = lazy(() => import("./components/FoundSheet.jsx"));
const UpdateExpense = lazy(() => import("./Expenses/UpdateExpense.jsx"));
const DeleteUser = lazy(() => import("./OthersOptions/DeleteUser.jsx"));
const FilterData = lazy(() => import("./OthersOptions/FilterData.jsx"));
const GeneratedBill = lazy(() => import("./OthersOptions/GeneratedBill.jsx"));
const ChangePassword = lazy(() => import("./accountAccess/ChangePassword.jsx"));
const PreviousBill = lazy(() => import("./OthersOptions/PreviousBill.jsx"));
const OtherExpense = lazy(() => import("./components/OtherExpense.jsx"));
const OtherExpenseUpdate = lazy(() =>
  import("./components/OtherExpenseUpdate.jsx")
);
import Loading from "./ExtraComponents/Loading.jsx";

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  {
    path: "/changePassword",
    element: (
      <Suspense fallback={<Loading />}>
        <ChangePassword />
      </Suspense>
    ),
  },
  {
    path: "/home",
    element: (
      <Suspense fallback={<Loading />}>
        <Home />
      </Suspense>
    ),
    children: [
      {
        path: "/home/sheets",
        element: (
          <Suspense fallback={<Loading />}>
            <Sheets />
          </Suspense>
        ),

        children: [
          {
            path: "/home/sheets/addSheet",
            element: (
              <Suspense fallback={<Loading />}>
                <CreateSheet />
              </Suspense>
            ),
          },
          {
            path: "/home/sheets/findSheet",
            element: (
              <Suspense fallback={<Loading />}>
                <FindSheet />
              </Suspense>
            ),
          },
          {
            path: "/home/sheets/foundSheet",
            element: (
              <Suspense fallback={<Loading />}>
                <FoundSheet />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
  {
    path: "/home/sheets/:sheetName",
    element: (
      <Suspense fallback={<Loading />}>
        <SingleSheet />
      </Suspense>
    ),
  },
  {
    path: "/home/sheets/:sheetName/updateExpense",
    element: (
      <Suspense fallback={<Loading />}>
        <UpdateExpense />
      </Suspense>
    ),
  },
  {
    path: "/home/sheets/:sheetName/otherExpenseUpdate",
    element: (
      <Suspense fallback={<Loading />}>
        <OtherExpenseUpdate />
      </Suspense>
    ),
  },
  {
    path: "/home/sheets/:sheetName/otherExpense",
    element: (
      <Suspense fallback={<Loading />}>
        <OtherExpense />
      </Suspense>
    ),
  },
  {
    path: "/home/sheets/:sheetName/deleteUser",
    element: (
      <Suspense fallback={<Loading />}>
        <DeleteUser />
      </Suspense>
    ),
  },
  {
    path: "/home/sheets/:sheetName/filterData",
    element: (
      <Suspense fallback={<Loading />}>
        <FilterData />
      </Suspense>
    ),
  },
  {
    path: "/home/sheets/:sheetName/generateBill",
    element: (
      <Suspense fallback={<Loading />}>
        <GeneratedBill />
      </Suspense>
    ),
  },
  {
    path: "/home/sheets/:sheetName/previousBill",
    element: (
      <Suspense fallback={<Loading />}>
        <PreviousBill />
      </Suspense>
    ),
  },
  {
    path: "/*",
    element: (
      <Suspense fallback={<Loading />}>
        <WrongURL />
      </Suspense>
    ),
  },
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
