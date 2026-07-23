import axios from "axios";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { EXPENSE_CATEGORIES } from "../config/constants";
import { FIREBASE_DB_URL } from "../config/firebase";

const CreateExpense = ({ users, onExpenseAdded }) => {
  const [formKey, setFormKey] = useState(0);
  const [aiText, setAiText] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  // Controlled state for AI pre-fill — refs still used for manual entry
  const [note, setNote] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [spendBy, setSpendBy] = useState("");
  const [payByVal, setPayByVal] = useState("Cash");

  const inviteCode = useSelector((state) => state.expenseSheet.inviteCode);

  // ── AI parse handler ──────────────────────────────────────────────────────
  const handleAIParse = async () => {
    if (!aiText.trim()) return;
    setAiLoading(true);
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

      // Pre-fill the form fields
      if (data.note && data.note !== "NA") setNote(data.note);
      if (data.category) setCategory(data.category);
      if (data.amount) setAmount(String(data.amount));
      if (data.user) setSpendBy(data.user);
      if (data.payBy) setPayByVal(data.payBy);

      setAiText("");
      toast.success("Form filled! Review and click Add.", {
        position: "top-center",
        theme: "colored",
        autoClose: 2000,
      });
    } catch {
      toast.error("Could not parse. Try again or fill manually.", {
        position: "top-center",
        theme: "colored",
        autoClose: 2000,
      });
    } finally {
      setAiLoading(false);
    }
  };

  // ── Expense submit handler ────────────────────────────────────────────────
  async function expenseCreateHandler(event) {
    event.preventDefault();
    const date = new Date().toLocaleDateString();
    const expenseAdded = {
      date,
      subCategory: note || "NA",
      category,
      amount,
      relatedAmtVal: 0,
      user: spendBy,
      payBy: payByVal,
      relatedAmount: false,
      relatedTo: spendBy,
    };

    try {
      const res = await axios.post(
        `${FIREBASE_DB_URL}/${inviteCode}/expenseSheet.json`,
        expenseAdded,
      );
      if (res.status === 200) {
        toast.success("Expense Added!", {
          position: "top-center",
          theme: "colored",
          autoClose: 1000,
        });
        // Reset all fields
        setNote("");
        setCategory("");
        setAmount("");
        setSpendBy(users.length === 1 ? users[0].userName : "");
        setPayByVal("Cash");
        setFormKey((k) => k + 1);
        if (onExpenseAdded) onExpenseAdded();
      }
    } catch {
      toast.error("Please try again!", {
        position: "top-center",
        theme: "colored",
        autoClose: 1000,
      });
    }
  }

  return (
    <div key={formKey}>
      {/* ── AI Quick Entry ──────────────────────────────────────────────── */}
      <div className="w-[94%] sm:max-w-[80%] mx-auto mb-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={aiText}
            onChange={(e) => setAiText(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && !aiLoading && handleAIParse()
            }
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

      {/* ── Manual Form ─────────────────────────────────────────────────── */}
      <form onSubmit={expenseCreateHandler}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pe-0 sm:pe-1 w-[94%] sm:max-w-[80%] mx-auto border-b-2 pb-3 md:border-b-0">
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Note"
            className="py-2.5 sm:py-2 ps-3 rounded-xl bg-slate-400 text-black font-bold text-sm sm:text-base focus:outline-none placeholder:text-black w-full"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            name="expenseCategory"
            required
            className="bg-slate-400 text-black font-bold rounded-xl px-3 py-2.5 sm:py-2 w-full text-sm sm:text-base"
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
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount in ₹"
            className="py-2.5 sm:py-2 ps-3 rounded-xl bg-slate-400 text-black font-bold text-sm sm:text-base focus:outline-none placeholder:text-black w-full"
          />

          <select
            value={spendBy}
            onChange={(e) => setSpendBy(e.target.value)}
            name="expenseAdder"
            required
            className="py-2.5 sm:py-2 px-3 rounded-xl bg-slate-400 text-black font-bold w-full text-sm sm:text-base"
          >
            {users.length > 1 && (
              <option value="" disabled hidden>
                Spend By
              </option>
            )}
            {users.map((userData) => (
              <option value={userData.userName} key={userData.id}>
                {userData.userName}
              </option>
            ))}
          </select>

          <select
            value={payByVal}
            onChange={(e) => setPayByVal(e.target.value)}
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
