import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useFetchDataHook from "../customHooks/useFetchDataHook";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FIREBASE_DB_URL } from "../config/firebase";

const UpdateExpense = () => {
  const token = useSelector((state) => state.expenseSheet.token);
  const navigate = useNavigate();
  const [dataToEdit, setDataToEdit] = useState([]);
  const data = useSelector((state) => state.expenseSheet.toEdit);
  const sheetCode = useSelector((state) => state.expenseSheet.sheetCode);

  useEffect(() => {
    if (!token) {
      navigate("/");
    } else if (data.length === 0) {
      navigate(`/home/sheets/${sheetCode}`);
    } else {
      setDataToEdit(data);
    }
  }, [token, data, navigate, sheetCode]);

  let inviteCode = useSelector((state) => state.expenseSheet.inviteCode);
  let urlKey = `${FIREBASE_DB_URL}/${inviteCode}`;
  const [comingData] = useFetchDataHook(`${urlKey}/usersList.json`);

  const updateExpenseHandler = async (event, id) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const expenseAdded = {
      amount: formData.get("amount"),
      category: formData.get("expenseCategory"),
      date: new Date().toLocaleDateString(),
      subCategory: formData.get("subCategory"),
      user: formData.get("user"),
      payBy: formData.get("payBy"),
      relatedAmtVal: 0,
      relatedAmount: false,
      relatedTo: formData.get("user"),
      isEdited: true,
      previousAmount: dataToEdit[0]?.amount,
    };

    try {
      let res = await axios.put(
        `${urlKey}/expenseSheet/${id}.json`,
        expenseAdded,
      );
      if (res.status === 200) {
        toast.success("Expense updated successfully!", { theme: "colored", autoClose: 2000, position: "top-center" });
        setTimeout(() => navigate(`/home/sheets/${sheetCode}`), 1100);
      }
    } catch (err) {
      toast.error("Update failed. Please try again.", { theme: "colored", autoClose: 2000, position: "top-center" });
    }
  };

  const inputClass =
    "w-full md:w-2/3 bg-slate-700 border border-slate-500 text-white p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all";
  const labelClass = "text-slate-300 font-medium md:text-lg";

  return (
    <>
      <ToastContainer position="top-center" autoClose={1200} />
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        {dataToEdit.map((toEdit) => (
          <form
            onSubmit={(event) => updateExpenseHandler(event, toEdit.id)}
            key={toEdit.id}
            className="bg-slate-800 p-6 md:p-10 rounded-3xl shadow-2xl w-full max-w-2xl border border-slate-700"
          >
            <h1 className="text-3xl font-bold text-white mb-8 text-center">
              Edit Expense
            </h1>

            <div className="space-y-6">
              {/* Amount */}
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                <label className={`${labelClass} md:w-1/3`}>Amount</label>
                <input
                  type="number"
                  defaultValue={toEdit.amount}
                  name="amount"
                  className={inputClass}
                  required
                />
              </div>

              {/* Category */}
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                <label className={`${labelClass} md:w-1/3`}>Category</label>
                <select
                  name="expenseCategory"
                  className={inputClass}
                  defaultValue={toEdit.category}
                >
                  {[
                    "Food & Drinks",
                    "Household Items",
                    "Transport & Vehicle",
                    "Shopping",
                    "Life & Entertainment",
                    "Housing",
                  ].map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Note */}
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                <label className={`${labelClass} md:w-1/3`}>Note</label>
                <input
                  type="text"
                  defaultValue={toEdit.subCategory}
                  name="subCategory"
                  className={inputClass}
                />
              </div>

              {/* User */}
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                <label className={`${labelClass} md:w-1/3`}>User</label>
                <select
                  name="user"
                  className={inputClass}
                  defaultValue={toEdit.user}
                >
                  {comingData.map((user) => (
                    <option key={user.id} value={user.userName}>
                      {user.userName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Pay By */}
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                <label className={`${labelClass} md:w-1/3`}>Pay By</label>
                <select
                  name="payBy"
                  className={inputClass}
                  defaultValue={toEdit.payBy}
                >
                  <option value="Cash">Cash</option>
                  <option value="Upi">UPI</option>
                  <option value="Card">Card</option>
                </select>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 mt-10 mb-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 bg-red-600 hover:bg-slate-500 text-white py-3 rounded-xl font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold transition-colors"
              >
                Save Changes
              </button>
            </div>
            <span className="  text-white text-xs">
              Note: Clicking Submit saves the status as <strong>Edited </strong>
              regardless of changes. Use Exit to discard without saving.
            </span>
          </form>
        ))}
      </div>
    </>
  );
};

export default UpdateExpense;
