import { useEffect, useRef, useState } from "react";

const CreateExpense = ({ users }) => {
  const [userList, setUserList] = useState([]);
  const subCategoryRef = useRef();
  const categoryRef = useRef();
  const amountRef = useRef();
  const userRef = useRef();
  useEffect(() => {
    setUserList(users);
  });
  async function expenseCreateHandler(event) {
    event.preventDefault();
    const expenseAdded = {
      date: document.querySelector("#date").value,
      subCategory: subCategoryRef.current.value,
      category: categoryRef.current.value,
      amount: amountRef.current.value,
      user: userRef.current.value,
    };
    console.log(expenseAdded);
  }
  return (
    <form onSubmit={(event) => expenseCreateHandler(event)}>
      <div className="grid md:grid-cols-3 grid-cols-2 gap-3 pe-3">
        <input
          id="date"
          type="date"
          required
          className="text-black font-bold bg-slate-400 py-2 px-3 rounded-xl focus:outline-none"
        />
        <input
          type="text"
          ref={subCategoryRef}
          placeholder="Amount Spend On"
          required
          className="py-2 ps-3 rounded-xl bg-slate-400 text-black font-bold focus:outline-none placeholder:text-black "
        />
        <select
          className="bg-slate-400 text-black font-bold rounded-xl px-4 py-2"
          ref={categoryRef}
          name="expenseCategory"
        >
          <option hidden>Choose Category</option>
          <option value="Food & Drinks" name="expenseCategory">
            Food & Drinks
          </option>
          <option value="Household Items" name="expenseCategory">
            Household Items
          </option>
          <option value="Transport & Vehicle" name="expenseCategory">
            Transport & Vehicle
          </option>
          <option value="Shopping" name="expenseCategory">
            Shopping
          </option>
          <option value="Life & Entertainment" name="expenseCategory">
            Life & Entertainment
          </option>
          <option value="Housing" name="expenseCategory">
            Housing
          </option>
        </select>
        <input
          type="text"
          required
          ref={amountRef}
          placeholder="Amount in ₹"
          className="py-2 ps-3 rounded-xl bg-slate-400 text-black font-bold focus:outline-none placeholder:text-black"
        />

        <select
          className="py-2 px-3 rounded-xl bg-slate-400 text-black font-bold"
          name="expenseAdder"
          ref={userRef}
        >
          <option hidden>Spend By:</option>
          {userList.map((userData) => (
            <option
              name="expenseAdder"
              value={userData.userName}
              key={userData.id}
            >
              {userData.userName}
            </option>
          ))}
        </select>

        <button
          className="text-white bg-gradient-to-br from-purple-500 via-blue-600 to-blue-900 px-10 py-2 rounded-2xl md:w-fit"
          type="submit"
        >
          Add
        </button>
      </div>
    </form>
  );
};

export default CreateExpense;
