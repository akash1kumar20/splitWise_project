import axios from "axios";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { EXPENSE_CATEGORIES } from "../config/constants";
import { FIREBASE_DB_URL } from "../config/firebase";

const CreateExpense = ({ users, onExpenseAdded }) => {
  const [formKey, setFormKey]     = useState(0);
  const [aiText, setAiText]       = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult]   = useState(null); // parsed AI result for preview

  const subCategoryRef = useRef();
  const categoryRef    = useRef();
  const amountRef      = useRef();
  const userRef        = useRef();
  const payBy          = useRef();

  const inviteCode = useSelector((state) => state.expenseSheet.inviteCode);

  // ── Save expense to Firebase ──────────────────────────────────────────────
  const saveExpense = async (expenseData) => {
    try {
      const res = await axios.post(
        `${FIREBASE_DB_URL}/${inviteCode}/expenseSheet.json`,
        expenseData,
      );
      if (res.status === 200) {
        toast.success("Expense Added!", {
          position: "top-center", theme: "colored", autoClose: 1000,
        });
        if (onExpenseAdded) onExpenseAdded();
        return true;
      }
    } catch {
      toast.error("Please try again!", {
        position: "top-center", theme: "colored", autoClose: 1000,
      });
    }
    return false;
  };

  // ── AI parse — shows a preview card, user confirms to add ────────────────
  const handleAIParse = async () => {
    if (!aiText.trim()) return;
    setAiLoading(true);
    setAiResult(null);
    try {
      const res = await fetch("/.netlify/functions/parseExpense", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: aiText,
          users,
          categories: EXPENSE_CATEGORIES,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      // Match user case-insensitively
      const match = users.find(
        (u) => u.userName.toLowerCase() === (data.user || "").toLowerCase()
      );
      setAiResult({
        ...data,
        user: match?.userName || (users[0]?.userName ?? ""),
      });
      setAiText("");
    } catch {
      toast.error("Could not parse. Try again or fill manually.", {
        position: "top-center", theme: "colored", autoClose: 2000,
      });
    } finally {
      setAiLoading(false);
    }
  };

  // ── Confirm AI result — adds directly to Firebase ────────────────────────
  const handleAIConfirm = async () => {
    if (!aiResult) return;
    const ok = await saveExpense({
      date:          new Date().toLocaleDateString(),
      subCategory:   aiResult.note !== "NA" ? aiResult.note : "NA",
      category:      aiResult.category,
      amount:        aiResult.amount,
      relatedAmtVal: 0,
      user:          aiResult.user,
      payBy:         aiResult.payBy,
      relatedAmount: false,
      relatedTo:     aiResult.user,
    });
    if (ok) setAiResult(null);
  };

  // ── Manual form submit ────────────────────────────────────────────────────
  async function expenseCreateHandler(event) {
    event.preventDefault();
    const user = userRef.current?.value;
    const ok = await saveExpense({
      date:          new Date().toLocaleDateString(),
      subCategory:   subCategoryRef.current?.value || "NA",
      category:      categoryRef.current?.value    || "",
      amount:        amountRef.current?.value      || 0,
      relatedAmtVal: 0,
      user,
      payBy:         payBy.current?.value          || "Cash",
      relatedAmount: false,
      relatedTo:     user,
    });
    if (ok) setFormKey((k) => k + 1);
  }

  return (
    <div>
      {/* ── AI Quick Entry ─────────────────────────────────────────────── */}
      <div className="w-[94%] sm:max-w-[80%] mx-auto mb-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={aiText}
            onChange={(e) => setAiText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !aiLoading && handleAIParse()}
            placeholder='✨ e.g. "Akash paid 500 for dinner via UPI"'
            className="flex-1 py-2.5 ps-3 rounded-xl bg-slate-700 text-white text-sm focus:outline-none placeholder:text-slate-400"
          />
          <button
            type="button"
            onClick={handleAIParse}
            disabled={aiLoading || !aiText.trim()}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white text-sm font-semibold disabled:opacity-50 whitespace-nowrap active:scale-95 transition-transform"
          >
            {aiLoading ? "Thinking..." : "✨ Fill"}
          </button>
        </div>
        <p className="text-xs text-slate-400 mt-1 ps-1">
          Describe the expense — AI parses it. Confirm or fill manually below.
        </p>

        {/* AI Result Preview Card */}
        {aiResult && (
          <div className="mt-2 bg-slate-800 border border-violet-500 rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex-1 text-sm text-white space-y-1">
              <p>
                <span className="text-slate-400">By:</span>{" "}
                <strong>{aiResult.user}</strong>
                <span className="mx-2 text-slate-500">·</span>
                <span className="text-slate-400">₹</span>
                <strong>{aiResult.amount}</strong>
                <span className="mx-2 text-slate-500">·</span>
                <strong>{aiResult.category}</strong>
                <span className="mx-2 text-slate-500">·</span>
                <span className="text-slate-400">{aiResult.payBy}</span>
              </p>
              {aiResult.note && aiResult.note !== "NA" && (
                <p className="text-slate-400 text-xs">Note: {aiResult.note}</p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAIConfirm}
                className="bg-green-600 hover:bg-green-500 text-white text-sm font-semibold px-4 py-2 rounded-lg active:scale-95 transition-transform"
              >
                ✓ Confirm
              </button>
              <button
                onClick={() => setAiResult(null)}
                className="bg-slate-600 hover:bg-slate-500 text-white text-sm px-3 py-2 rounded-lg"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Manual Form ─────────────────────────────────────────────────── */}
      <form key={formKey} onSubmit={expenseCreateHandler}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pe-0 sm:pe-1 w-[94%] sm:max-w-[80%] mx-auto border-b-2 pb-3 md:border-b-0">
          <input
            type="text"
            ref={subCategoryRef}
            placeholder="Note"
            className="py-2.5 sm:py-2 ps-3 rounded-xl bg-slate-400 text-black font-bold text-sm sm:text-base focus:outline-none placeholder:text-black w-full"
          />
          <select
            className="bg-slate-400 text-black font-bold rounded-xl px-3 py-2.5 sm:py-2 w-full text-sm sm:text-base"
            ref={categoryRef}
            name="expenseCategory"
            required
            defaultValue=""
          >
            <option value="" disabled hidden>Category</option>
            {EXPENSE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <input
            type="number"
            required
            ref={amountRef}
            placeholder="Amount in ₹"
            className="py-2.5 sm:py-2 ps-3 rounded-xl bg-slate-400 text-black font-bold text-sm sm:text-base focus:outline-none placeholder:text-black w-full"
          />
          <select
            className="py-2.5 sm:py-2 px-3 rounded-xl bg-slate-400 text-black font-bold w-full text-sm sm:text-base"
            name="expenseAdder"
            ref={userRef}
            required
            defaultValue={users.length === 1 ? users[0]?.userName : ""}
          >
            {users.length > 1 && (
              <option value="" disabled hidden>Spend By</option>
            )}
            {users.map((userData) => (
              <option value={userData.userName} key={userData.id}>
                {userData.userName}
              </option>
            ))}
          </select>
          <select
            ref={payBy}
            name="payBy"
            className="py-2.5 sm:py-2 px-3 rounded-xl bg-slate-400 text-black font-bold w-full text-sm sm:text-base"
            defaultValue="Cash"
          >
            <option value="Cash">Cash</option>
            <option value="Upi">UPI</option>
            <option value="Card">Card</option>
          </select>
          <button
            className="text-white bg-gradient-to-br from-purple-500 via-blue-600 to-blue-900 px-6 sm:px-10 py-2.5 sm:py-2 rounded-2xl w-full text-sm sm:text-base font-semibold active:scale-[0.99] transition-transform"
            type="submit"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateExpense;
