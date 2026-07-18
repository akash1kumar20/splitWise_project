import { useEffect, useState, useCallback } from "react";
import Navbar from "../ExtraComponents/Navbar";
import Footer from "../ExtraComponents/Footer";
import Profile from "../ExtraComponents/Profile";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import OtherOptions from "../ExtraComponents/OtherOptions";
import DisplayExpense from "../Expenses/DisplayExpense";
import SheetDetails from "./SheetDetails";
import CreateExpenseParent from "./CreateExpenseParent";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { expenseSheetActions } from "../../store/expenseSheetSlice";

import { FIREBASE_DB_URL as DB } from "../config/firebase";

const SingleSheet = () => {
  const navigate  = useNavigate();
  const dispatch  = useDispatch();
  const token     = useSelector((s) => s.expenseSheet.token)
                    || localStorage.getItem("sp_token");
  const inviteCode = useSelector((s) => s.expenseSheet.inviteCode)
                    || localStorage.getItem("sp_inviteCode") || "";
  const sheetAdminRedux = useSelector((s) => s.expenseSheet.sheetAdmin);

  useEffect(() => {
    if (!token) navigate("/");
  }, [token]);

  // ── Firebase fetch fallback ────────────────────────────────────────
  // If sheetAdmin is not in Redux AND not in localStorage (fresh browser,
  // direct URL navigation, cleared storage), fetch it from Firebase using
  // the inviteCode which is always derivable from the stored codes.
  useEffect(() => {
    const localAdmin = localStorage.getItem("sp_sheetAdmin");

    // Already have it — nothing to do
    if (sheetAdminRedux || localAdmin) {
      if (!sheetAdminRedux && localAdmin) {
        dispatch(expenseSheetActions.setSheetAdmin(localAdmin));
      }
      return;
    }

    // Fetch from Firebase
    if (!inviteCode) return;

    axios
      .get(`${DB}/${inviteCode}/sheetDetails.json`)
      .then((res) => {
        if (!res.data) return;
        const firstKey = Object.keys(res.data)[0];
        const admin = res.data[firstKey]?.userMail;
        if (admin) {
          dispatch(expenseSheetActions.setSheetAdmin(admin));
          localStorage.setItem("sp_sheetAdmin", admin);
        }
      })
      .catch(() => {});
  }, [inviteCode, sheetAdminRedux]);

  const [openProfile,   setOpenProfile]   = useState(false);
  const [showCylinder,  setShowCylinder]  = useState(false);
  const [expenseTrigger, setExpenseTrigger] = useState(0);
  const onExpenseAdded = useCallback(() => setExpenseTrigger((n) => n + 1), []);

  return (
    <div>
      <ToastContainer autoClose={2000} />
      <Navbar openProfile={() => setOpenProfile((p) => !p)} />
      {openProfile && <Profile />}
      {showCylinder && <OtherOptions />}
      <div className="md:flex">
        <SheetDetails />
        <CreateExpenseParent onExpenseAdded={onExpenseAdded} />
      </div>
      <DisplayExpense expenseTrigger={expenseTrigger} />
      <Footer
        openCylinder={() => setShowCylinder((s) => !s)}
        isOpen={showCylinder}
      />
    </div>
  );
};

export default SingleSheet;
