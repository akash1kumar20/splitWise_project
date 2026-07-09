import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useFetchDataHook from "../customHooks/useFetchDataHook";
import Loading from "../ExtraComponents/Loading";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { EXPENSE_CATEGORIES } from "../config/constants";

const FavoursAndLendingUpdate = () => {
  const inviteCode = useSelector((state) => state.expenseSheet.inviteCode);
  const [comingData, isLoading] = useFetchDataHook(
    `https://splitwiseapp-82dbf-default-rtdb.firebaseio.com/${inviteCode}/usersList.json`,
    5000, // poll every 5s — other users' additions appear automatically
  );
  const navigate = useNavigate();
  const sheetCode = useSelector((state) => state.expenseSheet.sheetCode);
  const token = useSelector((state) => state.expenseSheet.token);
  const [dataToEdit, setDataToEdit] = useState([]);
  const data = useSelector((state) => state.expenseSheet.toEdit);

  useEffect(() => {
    if (!token) {
      navigate("/");
    } else if (data.length === 0) {
      navigate(`/home/sheets/${sheetCode}`);
    } else {
      setDataToEdit(data);
    }
  }, []);

  async function otherExpenseHandler(event, id) {
    event.preventDefault();
    const expenseRel = event.target.expenseRel.value;
    const relatedPayBy = event.target.relatedPayBy.value;
    if (relatedPayBy === expenseRel) {
      toast.warning("Both users cannot be the same!", {
        theme: "colored",
        autoClose: 2000,
        position: "top-center",
      });
      return;
    }

    const objToStore = {
      date: new Date().toLocaleDateString(),
      user: expenseRel !== relatedPayBy ? relatedPayBy : expenseRel,
      relatedTo: expenseRel !== relatedPayBy ? expenseRel : relatedPayBy,
      category: event.target.expenseCategory.value,
      relatedAmtVal: event.target.relatedAmount.value,
      amount: 0,
      subCategory: event.target.relatedNote.value || "NA",
      payBy: "NA",
      relatedAmount: true,
      isEdited: true,
      previousAmount: dataToEdit[0]?.relatedAmtVal,
    };

    try {
      const res = await axios.put(
        `https://splitwiseapp-82dbf-default-rtdb.firebaseio.com/${inviteCode}/expenseSheet/${id}.json`,
        objToStore,
      );
      if (res.status === 200) {
        toast.success("Updated Successfully", {
          theme: "colored",
          autoClose: 2000,
          position: "top-center",
        });
        setTimeout(() => navigate(`/home/sheets/${sheetCode}`), 2200);
      }
    } catch (err) {
      toast.error("Try Again!", {
        theme: "colored",
        autoClose: 2000,
        position: "top-center",
      });
    }
  }

  return (
    <>
      <ToastContainer autoClose={2000} />
      {isLoading ? (
        <Loading />
      ) : (
        <div className="min-h-screen bg-slate-900 text-white p-4 md:p-8 flex justify-center items-center">
          {dataToEdit.map((toEdit) => (
            <form
              onSubmit={(event) => otherExpenseHandler(event, toEdit.id)}
              key={toEdit.id}
              className="w-full max-w-2xl bg-slate-800 p-6 md:p-10 rounded-2xl shadow-2xl border border-slate-700"
            >
              <h1 className="text-2xl md:text-4xl font-bold mb-8 text-center text-blue-400">
                Favours & Lending
              </h1>
              <p className="text-center mb-6 text-slate-400">
                Update Entry Here
              </p>

              <div className="space-y-6">
                {[
                  {
                    label: "Expense related to (Beneficiary)",
                    name: "expenseRel",
                    val: toEdit.relatedTo,
                    type: "select",
                    options: comingData,
                  },
                  {
                    label: "Paid by",
                    name: "relatedPayBy",
                    val: toEdit.user,
                    type: "select",
                    options: comingData,
                  },
                  {
                    label: "Category",
                    name: "expenseCategory",
                    val: toEdit.category,
                    type: "select",
                    options: EXPENSE_CATEGORIES,
                  },
                  {
                    label: "Amount",
                    name: "relatedAmount",
                    val: toEdit.relatedAmtVal,
                    type: "number",
                  },
                  {
                    label: "Note",
                    name: "relatedNote",
                    val: toEdit.subCategory,
                    type: "text",
                  },
                ].map((field) => (
                  <div
                    key={field.name}
                    className="grid grid-cols-1 md:grid-cols-3 gap-2 items-center"
                  >
                    <label className="text-lg font-medium text-slate-300">
                      {field.label}
                    </label>
                    {field.type === "select" ? (
                      <select
                        name={field.name}
                        defaultValue={field.val}
                        className="col-span-2 w-full bg-slate-700 border border-slate-600 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      >
                        <option value={field.val} hidden>
                          {field.val}
                        </option>
                        {field.options.map((opt) => (
                          <option
                            key={opt.id || opt}
                            value={opt.userName || opt}
                          >
                            {opt.userName || opt}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        name={field.name}
                        defaultValue={field.val}
                        className="col-span-2 w-full bg-slate-700 border border-slate-600 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-4 mt-10 justify-center mb-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="flex-1 bg-red-600 hover:bg-red-700 transition py-3 rounded-xl font-bold text-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 transition py-3 rounded-xl font-bold text-lg"
                >
                  Save Changes
                </button>
              </div>
              <span className="  text-white text-xs">
                Note: Clicking Submit saves the status as{" "}
                <strong>Edited </strong> regardless of changes. Use Exit to
                discard without saving.
              </span>
            </form>
          ))}
        </div>
      )}
    </>
  );
};

export default FavoursAndLendingUpdate;
