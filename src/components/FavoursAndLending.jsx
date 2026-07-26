import axios from "axios";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { EXPENSE_CATEGORIES } from "../config/constants";
import useFetchDataHook from "../customHooks/useFetchDataHook";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FIREBASE_DB_URL } from "../config/firebase";

const FavoursAndLending = () => {
  const code = useSelector((s) => s.expenseSheet.inviteCode);
  const navigate = useNavigate();
  const url = `${FIREBASE_DB_URL}/${code}`;
  const [comingData] = useFetchDataHook(`${url}/usersList.json`, 5000);
  const [successStatus, setSuccessStatus] = useState(false);

  const relatedAmountRef = useRef();
  const categoryRef = useRef();
  const relatedNoteRef = useRef();

  const [expenseRelatedTo, setExpenseRelatedTo] = useState("");
  const [expensePayByUser, setExpensePayByUser] = useState("");

  const formSubmitHandler = async (e) => {
    e.preventDefault();
    const date = new Date().toLocaleDateString();
    if (expenseRelatedTo === expensePayByUser) {
      // ✅ FIX: Replaced alert() with toast — consistent with rest of app
      toast.warning("Both users cannot be the same!", {
        position: "top-center",
        theme: "colored",
        autoClose: 2000,
      });
      return;
    }
    const objToStore = {
      date,
      user: expensePayByUser, // ✅ who paid
      relatedTo: expenseRelatedTo, // ✅ beneficiary
      category: categoryRef.current.value,
      relatedAmtVal: relatedAmountRef.current.value,
      amount: 0,
      subCategory: relatedNoteRef.current.value || "NA",
      payBy: "NA",
      relatedAmount: true,
    };
    try {
      const res = await axios.post(`${url}/expenseSheet.json`, objToStore);
      if (res.status === 200) {
        setSuccessStatus(true);
        e.target.reset();
        setExpenseRelatedTo("");
        setExpensePayByUser("");
        setTimeout(() => {
          setSuccessStatus(false);
        }, 2000);
      }
    } catch {
      toast.error("Something went wrong. Please try again.", {
        position: "top-center",
        theme: "colored",
        autoClose: 2000,
      });
    }
  };

  return (
    <div className=" bg-[rgb(241,245,249)] min-h-[100vh]  ">
      <ToastContainer autoClose={2000} />
      <div className="bg-[rgb(241,245,249)]flex flex-col items-center py-6 md:px-4 min-h-[100vh]">
        <div
          className="flex items-center justify-between w-[96%] max-w-lg mb-4 bg-[rgb(255,255,255)]
           border border-[rgb(203,213,225)] py-2 px-4 shadow-lg drop-shadow-xl mx-auto rounded-md"
        >
          <button
            className="text-sm bg-[rgb(30,41,59)] text-white px-4 py-2 rounded-xl hover:bg-[rgb(15,23,42)]"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>
          <h2 className="sm:text-2xl text-lg font-bold text-[rgb(15,23,42)]">
            Favours & Lending
          </h2>
          <div className="w-20" />
        </div>

        <form
          className="flex flex-col gap-4 w-[96%] mx-auto max-w-lg bg-[rgb(255,255,255)] border border-[rgb(203,213,225)] rounded-xl p-4 shadow-lg drop-shadow-xl"
          onSubmit={formSubmitHandler}
        >
          {/* ✅ Fix 5: use EXPENSE_CATEGORIES from constants */}
          <select
            ref={categoryRef}
            required
            defaultValue=""
            className="bg-[rgb(248,250,252)] text-[rgb(30,41,59)] border border-[rgb(203,213,225)]k font-bold rounded-xl px-4 py-2"
          >
            <option value="" disabled hidden>
              Category
            </option>
            {EXPENSE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <input
            type="number"
            ref={relatedAmountRef}
            required
            placeholder="Amount in ₹"
            className=" font-bold py-2 ps-3 rounded-xl focus:outline-none bg-[rgb(248,250,252)] text-[rgb(30,41,59)] placeholder:text-[rgb(100,116,139)] border border-[rgb(203,213,225)] focus:border-[rgb(59,130,246)] focus:ring-2 focus:ring-[rgb(191,219,254)] transition-all"
          />

          <input
            type="text"
            ref={relatedNoteRef}
            placeholder="Note (optional)"
            className=" bg-[rgb(248,250,252)] text-[rgb(30,41,59)] placeholder:text-[rgb(100,116,139)] border border-[rgb(203,213,225)] font-bold py-2 ps-3 rounded-xl focus:outline-none focus:border-[rgb(59,130,246)] focus:ring-2 focus:ring-[rgb(191,219,254)] transition-all"
          />

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-[rgb(51,65,85)]">
              Expense related to (Beneficiary):
            </label>
            <select
              value={expenseRelatedTo}
              onChange={(e) => setExpenseRelatedTo(e.target.value)}
              required
              className="bg-[rgb(248,250,252)] text-[rgb(30,41,59)] border border-[rgb(203,213,225)] font-bold rounded-xl px-4 py-2 focus:outline-none focus:border-[rgb(59,130,246)] focus:ring-2 focus:ring-[rgb(191,219,254)] transition-all"
            >
              <option value="" disabled>
                Select User
              </option>
              {comingData.map((u) => (
                <option key={u.id} value={u.userName}>
                  {u.userName}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-[rgb(51,65,85)]">
              Paid by:
            </label>
            <select
              value={expensePayByUser}
              onChange={(e) => setExpensePayByUser(e.target.value)}
              required
              className="bg-[rgb(248,250,252)] text-[rgb(30,41,59)] border border-[rgb(203,213,225)] font-bold rounded-xl px-4 py-2 focus:outline-none focus:border-[rgb(59,130,246)] focus:ring-2 focus:ring-[rgb(191,219,254)] transition-all"
            >
              <option value="" disabled>
                Select User
              </option>
              {comingData.map((u) => (
                <option key={u.id} value={u.userName}>
                  {u.userName}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="bg-gradient-to-r from-[rgb(139,92,246)] via-[rgb(59,130,246)] to-[rgb(37,99,235)] text-white font-bold py-3 rounded-2xl"
          >
            Save Entry
          </button>
        </form>
        {successStatus && (
          <div className="bg-[rgb(220,252,231)] border-[rgb(74,222,128)] text-[rgb(21,128,61)] px-4 py-2 rounded-xl m-4 text-sm font-semibold text-center">
            ✅ Entry added successfully!
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoursAndLending;
