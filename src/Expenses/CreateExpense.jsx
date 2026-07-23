import axios from "axios";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { EXPENSE_CATEGORIES } from "../config/constants";
import { FIREBASE_DB_URL } from "../config/firebase";

const CreateExpense = ({ users, onExpenseAdded }) => {
  const [formKey, setFormKey]   = useState(0);
  const [aiText, setAiText]     = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  // Holds AI-parsed values — used as defaultValue when form remounts
  const [prefilled, setPrefilled] = useState(null);

  // Refs read values at submit time — always accurate regardless of render
  const noteRef     = useRef();
  const categoryRef = useRef();
  const amountRef   = useRef();
  const userRef     = useRef();
  const payByRef    = useRef();

  const inviteCode = useSelector((state) => state.expenseSheet.inviteCode);

  // ── AI parse ─────────────────────────────────────────────────────────────
  const handleAIParse = async () => {
    if (!aiText.trim()) return;
    setAiLoading(true);
    try {
      const res = await fetch("/.netlify/functions/parseExpense", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: aiText, users, categories: EXPENSE_CATEGORIES }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      // ✅ Key approach: set prefilled data THEN increment formKey.
      // The form remounts with defaultValue from prefilled — always visible.
      // Controlled state (useState per field) can silently fail to re-render;
      // defaultValue + key remount is the most reliable pre-fill pattern.
      setPrefilled(data);
      setFormKey((k) => k + 1);
      setAiText("");
      toast.success("Form filled! Review and click Add.", {
        position: "top-center", theme: "colored", autoClose: 2000,
      });
    } catch {
      toast.error("Could not parse. Try again or fill manually.", {
        position: "top-center", theme: "colored", autoClose: 2000,
      });
    } finally {
      setAiLoading(false);
    }
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  async function expenseCreateHandler(event) {
    event.preventDefault();
    const user = userRef.current?.value;
    const expenseAdded = {
      date:          new Date().toLocaleDateString(),
      subCategory:   noteRef.current?.value     || "NA",
      category:      categoryRef.current?.value || "",
      amount:        amountRef.current?.value   || 0,
      relatedAmtVal: 0,
      user,
      payBy:         payByRef.current?.value    || "Cash",
      relatedAmount: false,
      relatedTo:     user,
    };

    try {
      const res = await axios.post(
        `${FIREBASE_DB_URL}/${inviteCode}/expenseSheet.json`,
        expenseAdded,
      );
      if (res.status === 200) {
        toast.success("Expense Added!", {
          position: "top-center", theme: "colored", autoClose: 1000,
        });
        setPrefilled(null);
        setFormKey((k) => k + 1); // reset form to empty
        if (onExpenseAdded) onExpenseAdded();
      }
    } catch {
      toast.error("Please try again!", {
        position: "top-center", theme: "colored", autoClose: 1000,
      });
    }
  }

  const defaultUser =
    prefilled?.user ||
    (users.length === 1 ? users[0]?.userName : "");

  return (
    <div>
      {/* ── AI Quick Entry — NOT inside the keyed form ─────────────────── */}
      <div className="w-[94%] sm:max-w-[80%] mx-auto mb-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={aiText}
            onChange={(e) => setAiText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !aiLoading && handleAIParse()}
            placeholder='✨ Try "Raj paid 500 for dinner via UPI"'
            className="flex-1 py-2.5 ps-3 rounded-xl bg-slate-700 text-white text-sm focus:outline-none placeholder:text-slate-400"
          />
          <button
            type="button"
            onClick={handleAIParse}
            disabled={aiLoading || !aiText.trim()}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white text-sm font-semibold disabled:opacity-50 whitespace-nowrap active:scale-95 transition-transform"
          >
            {aiLoading ? "..." : "✨ Fill"}
          </button>
        </div>
        <p className="text-xs text-slate-400 mt-1 ps-1">
          Type in plain English — AI fills the form. Review and click Add.
        </p>
      </div>

      {/* ── Expense Form — key causes remount on AI fill & after submit ─── */}
      <form key={formKey} onSubmit={expenseCreateHandler}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pe-0 sm:pe-1 w-[94%] sm:max-w-[80%] mx-auto border-b-2 pb-3 md:border-b-0">

          <input
            type="text"
            ref={noteRef}
            defaultValue={prefilled?.note !== "NA" ? (prefilled?.note ?? "") : ""}
            placeholder="Note"
            className="py-2.5 sm:py-2 ps-3 rounded-xl bg-slate-400 text-black font-bold text-sm sm:text-base focus:outline-none placeholder:text-black w-full"
          />

          <select
            ref={categoryRef}
            defaultValue={prefilled?.category || ""}
            name="expenseCategory"
            required
            className="bg-slate-400 text-black font-bold rounded-xl px-3 py-2.5 sm:py-2 w-full text-sm sm:text-base"
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
            defaultValue={prefilled?.amount ?? ""}
            placeholder="Amount in ₹"
            className="py-2.5 sm:py-2 ps-3 rounded-xl bg-slate-400 text-black font-bold text-sm sm:text-base focus:outline-none placeholder:text-black w-full"
          />

          <select
            ref={userRef}
            defaultValue={defaultUser}
            name="expenseAdder"
            required
            className="py-2.5 sm:py-2 px-3 rounded-xl bg-slate-400 text-black font-bold w-full text-sm sm:text-base"
          >
            {users.length > 1 && (
              <option value="" disabled hidden>Spend By</option>
            )}
            {users.map((u) => (
              <option value={u.userName} key={u.id}>{u.userName}</option>
            ))}
          </select>

          <select
            ref={payByRef}
            defaultValue={prefilled?.payBy || "Cash"}
            name="payBy"
            className="py-2.5 sm:py-2 px-3 rounded-xl bg-slate-400 text-black font-bold w-full text-sm sm:text-base"
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
