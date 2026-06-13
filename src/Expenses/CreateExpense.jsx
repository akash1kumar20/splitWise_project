import axios from "axios";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { EXPENSE_CATEGORIES } from "../config/constants";

const CreateExpense = ({ users, onExpenseAdded }) => {
  const [formKey, setFormKey] = useState(0);
  const subCategoryRef = useRef();
  const categoryRef = useRef();
  const amountRef = useRef();
  const userRef = useRef();
  const payBy = useRef();
  const inviteCode = useSelector((state) => state.expenseSheet.inviteCode);

  async function expenseCreateHandler(event) {
    event.preventDefault();
    const date = new Date().toLocaleDateString();
    const expenseAdded = {
      date,
      subCategory: subCategoryRef.current.value || "NA",
      category: categoryRef.current.value,
      amount: amountRef.current.value,
      relatedAmtVal: 0,
      user: userRef.current.value,
      payBy: payBy.current.value,
      relatedAmount: false,
      relatedTo: userRef.current.value,
    };
    try {
      const res = await axios.post(
        `https://splitwiseapp-82dbf-default-rtdb.firebaseio.com/${inviteCode}/expenseSheet.json`,
        expenseAdded,
      );
      if (res.status === 200) {
        toast.success("Expense Added!", {
          position: "top-center",
          theme: "colored",
          autoClose: 1000,
        });
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
    <form key={formKey} onSubmit={expenseCreateHandler}>
      {/* Mobile: single column. sm: 2 cols. md: 3 cols */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pe-1 max-w-[80%] mx-auto border-b-2 pb-2 md:border-b-0">
        <input
          type="text"
          ref={subCategoryRef}
          placeholder="Note"
          className="py-2 ps-3 rounded-xl bg-slate-400 text-black font-bold focus:outline-none placeholder:text-black w-full"
        />
        <select
          className="bg-slate-400 text-black font-bold rounded-xl px-3 py-2 w-full"
          ref={categoryRef}
          name="expenseCategory"
          required
          defaultValue=""
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
          ref={amountRef}
          placeholder="Amount in ₹"
          className="py-2 ps-3 rounded-xl bg-slate-400 text-black font-bold focus:outline-none placeholder:text-black w-full"
        />
        <select
          className="py-2 px-3 rounded-xl bg-slate-400 text-black font-bold w-full"
          name="expenseAdder"
          ref={userRef}
          required
          defaultValue=""
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
          ref={payBy}
          name="payBy"
          className="py-2 px-3 rounded-xl bg-slate-400 text-black font-bold w-full"
          defaultValue="Cash"
        >
          <option value="Cash">Cash</option>
          <option value="Upi">UPI</option>
          <option value="Card">Card</option>
        </select>
        <button
          className="text-white bg-gradient-to-br from-purple-500 via-blue-600 to-blue-900 px-10 py-2 rounded-2xl w-full"
          type="submit"
        >
          Add
        </button>
      </div>
    </form>
  );
};

export default CreateExpense;
