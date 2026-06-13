import { useDispatch, useSelector } from "react-redux";
import useFetchDataHook from "../customHooks/useFetchDataHook";
import Loading from "./../ExtraComponents/Loading";
import axios from "axios";
import { toast } from "react-toastify";
import { expenseSheetActions } from "../../store/expenseSheetSlice";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ForLargerScreen from "./ForLargerScreen";
import ForSmallerScreen from "./ForSmallerScreen";
import useAdminStatus from "../customHooks/useAdminStatus";

// ✅ Fix 8: Export expenses to CSV
const exportToCSV = (comingData) => {
  if (!comingData.length) return;
  const headers = ["S.No", "Date", "Category", "Note", "Amount", "Pay Method", "Spend By"];
  const rows = comingData.map((item, i) => [
    i + 1,
    item.date,
    item.category,
    item.subCategory || "NA",
    item.relatedAmount ? item.relatedAmtVal : item.amount,
    item.relatedAmount ? "F&L" : (item.payBy === "NA" ? "F&L" : item.payBy),
    item.user,
  ]);
  const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `expenses-${new Date().toLocaleDateString()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

const DisplayExpense = ({ expenseTrigger }) => {
  const inviteCode = useSelector((state) => state.expenseSheet.inviteCode);
  const url = `https://splitwiseapp-82dbf-default-rtdb.firebaseio.com/${inviteCode}/expenseSheet`;
  const [comingData, isLoading, , refetch] = useFetchDataHook(`${url}.json`, 5000);
  const length = comingData.length > 0;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.expenseSheet.token);
  const sheetCode = useSelector((state) => state.expenseSheet.sheetCode);
  const theme = useSelector((state) => state.theme.theme);
  const { isAdmin, userMail } = useAdminStatus();
  const [previousBilllength, setPreviousBilllength] = useState(0);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  useEffect(() => { if (expenseTrigger > 0) refetch(); }, [expenseTrigger]);
  useEffect(() => { if (!token) navigate("/"); }, [token, navigate]);

  function deleteExpenseHandler(id) {
    if (!isAdmin) {
      toast.warning("🔒 Only the sheet admin can delete expenses.", { theme: "dark", autoClose: 2000, position: "top-center" });
      return;
    }
    setPendingDeleteId(id);
  }

  async function confirmDeleteExpense() {
    const id = pendingDeleteId;
    setPendingDeleteId(null);
    try {
      const res = await axios.delete(`${url}/${id}.json`);
      if (res.status === 200) {
        toast.warning("Expense Deleted", { theme: "dark", autoClose: 1000, position: "top-right" });
        refetch();
      }
    } catch { toast.error("Try Again", { theme: "dark", autoClose: 1000, position: "top-right" }); }
  }

  function updateExpenseHandler(data) {
    if (data.relatedAmount) {
      navigate(`/home/sheets/${sheetCode}/otherExpenseUpdate`);
      dispatch(expenseSheetActions.setExpenseToEdit([data]));
    } else {
      navigate(`/home/sheets/${sheetCode}/updateExpense`);
      dispatch(expenseSheetActions.setExpenseToEdit([data]));
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`https://splitwiseapp-82dbf-default-rtdb.firebaseio.com/${inviteCode}/previousBills.json`);
        let resArr = [];
        for (let key in res.data) resArr.push({ ...res.data[key] });
        setPreviousBilllength(resArr.length);
      } catch {}
    };
    fetchData();
  }, [inviteCode]);

  return (
    <>
      {pendingDeleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white text-black rounded-2xl p-6 mx-4 max-w-sm w-full text-center shadow-2xl">
            <p className="text-2xl mb-2">🗑️</p>
            <h2 className="text-xl font-bold mb-2">Delete Expense?</h2>
            <p className="text-sm text-gray-600 mb-4">This action cannot be undone.</p>
            <div className="flex gap-3 justify-center">
              <button className="bg-red-600 text-white px-6 py-2 rounded-xl font-semibold" onClick={confirmDeleteExpense}>Delete</button>
              <button className="bg-gray-300 text-black px-6 py-2 rounded-xl font-semibold" onClick={() => setPendingDeleteId(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className={theme ? "min-h-[100vh] bg-white text-slate-600 pt-4 z-0" : "min-h-[100vh] bg-slate-600 text-white pt-4 z-0"}>
        {/* ✅ Fix 8: Export CSV button */}
        {length && !isLoading && (
          <div className="flex justify-end px-4 mb-2">
            <button
              className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded-lg"
              onClick={() => exportToCSV(comingData)}
            >
              ⬇ Export CSV
            </button>
          </div>
        )}
        {!length && !isLoading && <p className="text-center font-bold text-3xl">No expense to show</p>}
        {previousBilllength > 0 && !length && (
          <p className="mt-2 text-lg text-center">
            Check out the <span className="text-blue-500 cursor-pointer ms-2" onClick={() => navigate(`/home/sheets/${sheetCode}/previousBill`)}>Previous Bills</span>
          </p>
        )}
        {isLoading && <Loading />}
        {length && (
          <div className="pb-20">
            <ForSmallerScreen comingData={comingData} updateHandler={updateExpenseHandler} deleteHandler={deleteExpenseHandler} />
            <ForLargerScreen  comingData={comingData} updateHandler={updateExpenseHandler} deleteHandler={deleteExpenseHandler} />
          </div>
        )}
      </div>
    </>
  );
};

export default DisplayExpense;
