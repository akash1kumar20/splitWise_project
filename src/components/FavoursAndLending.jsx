import axios from "axios";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { EXPENSE_CATEGORIES } from "../config/constants";
import useFetchDataHook from "../customHooks/useFetchDataHook";

const FavoursAndLending = () => {
  const code = useSelector((s) => s.expenseSheet.inviteCode);
  const navigate = useNavigate();
  const url = `https://splitwiseapp-82dbf-default-rtdb.firebaseio.com/${code}`;
  const [comingData] = useFetchDataHook(`${url}/usersList.json`);
  const [successStatus, setSuccessStatus] = useState(false);

  const relatedAmountRef = useRef();
  const categoryRef = useRef();
  const relatedNoteRef = useRef();

  const [expenseRelatedTo, setExpenseRelatedTo] = useState("");
  const [expensePayByUser, setExpensePayByUser] = useState("");

  const formSubmitHandler = async (e) => {
    e.preventDefault();
    const date = new Date().toLocaleDateString();
    const objToStore = {
      date,
      user: expenseRelatedTo,
      relatedTo: expensePayByUser,
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
        setTimeout(() => setSuccessStatus(false), 2000);
      }
    } catch {
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex flex-col bg-[rgb(233,237,201)] min-h-[100vh] items-center py-6 px-4">
      <div className="flex items-center justify-between w-full max-w-lg mb-4">
        <button
          className="text-sm bg-gray-800 text-white px-4 py-2 rounded-xl hover:bg-gray-700"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
        <h2 className="sm:text-2xl text-lg font-bold">Favours & Lending</h2>
        <div className="w-20" />
      </div>

      {successStatus && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-xl mb-4 text-sm font-semibold">
          ✅ Entry added successfully!
        </div>
      )}

      <form
        className="flex flex-col gap-4 w-full max-w-lg"
        onSubmit={formSubmitHandler}
      >
        {/* ✅ Fix 5: use EXPENSE_CATEGORIES from constants */}
        <select
          ref={categoryRef}
          required
          defaultValue=""
          className="bg-slate-400 text-black font-bold rounded-xl px-4 py-2"
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
          className="bg-slate-400 text-black font-bold py-2 ps-3 rounded-xl placeholder:text-black focus:outline-none"
        />

        <input
          type="text"
          ref={relatedNoteRef}
          placeholder="Note (optional)"
          className="bg-slate-400 text-black font-bold py-2 ps-3 rounded-xl placeholder:text-black focus:outline-none"
        />

        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold">
            Expense related to (Beneficiary):
          </label>
          <select
            value={expenseRelatedTo}
            onChange={(e) => setExpenseRelatedTo(e.target.value)}
            required
            className="bg-slate-400 text-black font-bold rounded-xl px-4 py-2"
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
          <label className="text-sm font-semibold">Paid by:</label>
          <select
            value={expensePayByUser}
            onChange={(e) => setExpensePayByUser(e.target.value)}
            required
            className="bg-slate-400 text-black font-bold rounded-xl px-4 py-2"
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
          className="bg-gradient-to-br from-purple-500 via-blue-600 to-blue-900 text-white font-bold py-3 rounded-2xl"
        >
          Save Entry
        </button>
      </form>
    </div>
  );
};

export default FavoursAndLending;
