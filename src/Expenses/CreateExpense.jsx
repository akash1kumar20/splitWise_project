import { useEffect, useState } from "react";

const CreateExpense = ({ users }) => {
  const [userList, setUserList] = useState([]);
  useEffect(() => {
    setUserList(users);
  }, []);
  async function expenseCreateHandler() {}
  return (
    <form>
      <div className="grid md:grid-cols-3 grid-cols-2 gap-3 pe-3">
        <input
          type="date"
          required
          className="text-white bg-slate-400 py-2 px-3 rounded-xl focus:outline-none"
        />
        <input
          type="text"
          placeholder="Amount Spend On"
          required
          className="py-2 ps-3 rounded-xl bg-slate-400 text-white focus:outline-none placeholder:text-black "
        />
        <select
          className="bg-slate-400 text-white rounded-xl px-4 py-2"
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
          placeholder="Amount in ₹"
          className="py-2 ps-3 rounded-xl bg-slate-400 text-white focus:outline-none placeholder:text-black"
        />
        {userList.map((userData) => (
          <select
            className="py-2 px-3 rounded-xl bg-slate-400 text-white"
            name="expenseAdder"
            key={userData.id}
          >
            <option hidden>Spend By:</option>
            <option name="expenseAdder" value={userData.userName}>
              {userData.userName}
            </option>
          </select>
        ))}
        <button className="text-white bg-gradient-to-br from-purple-500 via-blue-600 to-blue-900 px-10 py-2 rounded-2xl md:w-fit">
          Add
        </button>
      </div>
    </form>
  );
};

export default CreateExpense;
