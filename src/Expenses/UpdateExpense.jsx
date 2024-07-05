import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useFetchDataHook from "../customHooks/useFetchDataHook";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UpdateExpense = () => {
  const token = useSelector((state) => state.expenseSheet.token);
  const navigate = useNavigate();
  const [dataToEdit, setDataToEdit] = useState([]);
  const data = useSelector((state) => state.expenseSheet.toEdit);
  const sheetCode = useSelector((state) => state.expenseSheet.sheetCode);

  useEffect(() => {
    if (!token) {
      navigate("/");
    } else {
      if (data.length === 0) {
        navigate(`/home/sheets/${sheetCode}`);
      } else {
        setDataToEdit(data);
      }
    }
  }, []);

  let inviteCode = useSelector((state) => state.expenseSheet.inviteCode);
  let urlKey = "usersList" + inviteCode;
  const [comingData] = useFetchDataHook(
    `https://splitwiseapp-82dbf-default-rtdb.firebaseio.com/${urlKey}.json`
  );

  const updateExpenseHandler = async (event, id) => {
    event.preventDefault();
    const todayDate = new Date().toLocaleDateString();
    const expenseAdded = {
      amount: event.target.amount.value,
      category: event.target.expenseCategory.value,
      date: todayDate,
      subCategory: event.target.subCategory.value,
      user: event.target.user.value,
      payBy: event.target.payBy.value,
    };
    let updateUrlKey = "expenseSheet" + sheetCode;
    try {
      let res = await axios.put(
        `https://splitwiseapp-82dbf-default-rtdb.firebaseio.com/${updateUrlKey}/${id}.json`,
        expenseAdded
      );

      if (res.status === 200) {
        toast.success("Edited", {
          theme: "colored",
          autoClose: 1200,
          position: "top-center",
        });
        setTimeout(() => {
          navigate(`/home/sheets/:${sheetCode}/displayExpense`);
        }, 1000);
      }
    } catch (err) {
      toast.error("Try Again", {
        theme: "colored",
        autoClose: 1200,
        position: "top-center",
      });
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="min-h-[100vh] bg-slate-600  text-white ">
        {dataToEdit.map((toEdit) => (
          <form
            onSubmit={(event) => updateExpenseHandler(event, toEdit.id)}
            key={toEdit.id}
          >
            <div className="md:mx-[30%] py-[2%] md:w-[40%] mx-4">
              <h1 className="text-3xl font-bold pb-5 text-center">
                Edit Your Expense Here:
              </h1>
              <div className="flex mb-3 items-center justify-between ">
                <label htmlFor="amount" className="md:text-2xl text-xl">
                  Amount
                </label>
                <input
                  type="number"
                  defaultValue={toEdit.amount}
                  className="bg-slate-400 text-white font-bold md:text-2xl text-xl ps-2 py-3 rounded-lg focus:outline-none"
                  name="amount"
                />
              </div>
              <div className="flex  justify-between  mb-3 items-center">
                <label
                  htmlFor="expenseCategory"
                  className="md:text-2xl text-xl"
                >
                  Category
                </label>
                <select
                  className="bg-slate-400 text-white font-bold md:text-2xl text-xl ps-2 py-3 rounded-lg focus:outline-none md:w-[317px] w-[268px]"
                  name="expenseCategory"
                >
                  <option
                    defaultValue={toEdit.category}
                    hidden
                    name="expenseCategory"
                  >
                    {toEdit.category}
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
              </div>
              <div className="flex  justify-between mb-3 items-center">
                <label htmlFor="subCategory" className="md:text-2xl text-xl">
                  Note
                </label>
                <input
                  type="text"
                  defaultValue={toEdit.subCategory}
                  className="bg-slate-400 text-white font-bold md:text-2xl text-xl ps-2 py-3 rounded-lg focus:outline-none"
                  name="subCategory"
                />
              </div>
              <div className="flex justify-between  mb-3 items-center">
                <label htmlFor="user" className="md:text-2xl text-xl">
                  User
                </label>
                <select
                  className="bg-slate-400 text-white font-bold md:text-2xl text-xl
              ps-2 py-3 rounded-lg focus:outline-none md:w-[317px] w-[268px]"
                  name="user"
                >
                  <option defaultValue={toEdit.user} hidden name="user">
                    {toEdit.user}
                  </option>
                  {comingData.map((user) => (
                    <option value={user.userName} name="user" key={user.id}>
                      {user.userName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-between  mb-3 items-center">
                <label htmlFor="payBy" className="md:text-2xl text-xl">
                  Pay By
                </label>
                <select
                  name="payBy"
                  className="bg-slate-400 text-white font-bold md:text-2xl text-xl
              ps-2 py-3 rounded-lg focus:outline-none md:w-[317px] w-[268px]"
                >
                  <option defaultValue={toEdit.payBy} hidden>
                    {toEdit.payBy}
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
              </div>

              <div className="flex justify-center items-center gap-6 mt-6">
                <button
                  className="bg-yellow-600 text-white py-2 px-10 font-bold text-2xl rounded-xl"
                  type="submit"
                >
                  Edit
                </button>
                <span
                  className="bg-red-600 text-white py-2 px-10 font-bold text-2xl cursor-pointer
            rounded-xl"
                  onClick={() => navigate(-1)}
                >
                  Exit
                </span>
              </div>
            </div>
          </form>
        ))}
      </div>
    </>
  );
};

export default UpdateExpense;
