import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const CreateExpense = ({ users }) => {
  const [userList, setUserList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  useEffect(() => {
    setShowForm(true);
    return;
  }, [showForm]);
  const subCategoryRef = useRef();
  const categoryRef = useRef();
  const amountRef = useRef();
  const userRef = useRef();
  const payBy = useRef();
  const inviteCode = useSelector((state) => state.expenseSheet.inviteCode);
  useEffect(() => {
    setUserList(users);
  });
  async function expenseCreateHandler(event) {
    event.preventDefault();
    let date = new Date().toLocaleDateString();
    const expenseAdded = {
      date: date,
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
      let res = await axios.post(
        `https://splitwiseapp-82dbf-default-rtdb.firebaseio.com/${inviteCode}/expenseSheet.json`,
        expenseAdded
      );

      if (res.status === 200) {
        toast.success("Expense Added!", {
          position: "top-center",
          theme: "colored",
          autoClose: 1000,
        });
      }
    } catch (err) {
      toast.error("Please try again!", {
        position: "top-center",
        theme: "colored",
        autoClose: 1000,
      });
    }
    setShowForm(false);
  }
  return (
    <>
      <ToastContainer />
      <form onSubmit={(event) => expenseCreateHandler(event)}>
        {showForm && (
          <div className="grid md:grid-cols-3 grid-cols-2 gap-3 pe-3">
            <input
              type="text"
              ref={subCategoryRef}
              placeholder="Note"
              className="py-2 ps-3 rounded-xl bg-slate-400 text-black font-bold focus:outline-none placeholder:text-black "
            />
            <select
              className="bg-slate-400 text-black font-bold rounded-xl px-4 py-2"
              ref={categoryRef}
              name="expenseCategory"
              placeholder="Choose Category"
              required
            >
              <option hidden defaultValue value="">
                Category
              </option>
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
              type="number"
              required
              ref={amountRef}
              placeholder="Amount in ₹"
              className="py-2 ps-3 rounded-xl bg-slate-400 text-black font-bold focus:outline-none placeholder:text-black "
            />
            {userList.length === 1 && (
              <select
                className="py-2 px-3 rounded-xl bg-slate-400 text-black font-bold"
                name="expenseAdder"
                ref={userRef}
                required
              >
                {userList.map((userData) => (
                  <option
                    name="expenseAdder"
                    value={userData.userName}
                    key={userData.id}
                    defaultValue
                  >
                    {userData.userName}
                  </option>
                ))}
              </select>
            )}
            {userList.length > 1 && (
              <select
                className="py-2 px-3 rounded-xl bg-slate-400 text-black font-bold"
                name="expenseAdder"
                ref={userRef}
                required
              >
                <option hidden defaultValue value="">
                  Spend By
                </option>
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
            )}
            <select
              ref={payBy}
              name="payBy"
              className="py-2 px-3 rounded-xl bg-slate-400 text-black font-bold"
            >
              <option hidden value="Cash">
                Pay By
              </option>
              <option name="payBy" value="Cash" defaultValue>
                Cash
              </option>
              <option name="payBy" valye="Upi">
                Upi
              </option>
              <option name="payBy" value="Card">
                Card
              </option>
            </select>
            <button
              className="text-white bg-gradient-to-br from-purple-500 via-blue-600 to-blue-900 px-10 py-2 rounded-2xl md:w-fit"
              type="submit"
            >
              Add
            </button>
          </div>
        )}
      </form>
    </>
  );
};

export default CreateExpense;
