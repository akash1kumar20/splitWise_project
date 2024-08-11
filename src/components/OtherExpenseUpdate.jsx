import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import useFetchDataHook from "../customHooks/useFetchDataHook";
import Loading from "../ExtraComponents/Loading";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OtherExpense = () => {
  const theme = useSelector((state) => state.theme.theme);
  const inviteCode = useSelector((state) => state.expenseSheet.inviteCode);
  const [comingData, isLoading] = useFetchDataHook(
    `https://splitwiseapp-82dbf-default-rtdb.firebaseio.com/${inviteCode}/usersList.json`
  );
  const navigate = useNavigate();
  const [successStatus, setSuccessStatus] = useState(false);
  const sheetCode = useSelector((state) => state.expenseSheet.sheetCode);
  const token = useSelector((state) => state.expenseSheet.token);
  const [dataToEdit, setDataToEdit] = useState([]);
  const data = useSelector((state) => state.expenseSheet.toEdit);

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

  async function otherExpenseHandler(event, id) {
    event.preventDefault();
    let url;
    let date = new Date().toLocaleDateString();
    let expenseRelatedTo;
    let expensePayByUser;
    if (event.target.expenseRel.value === event.target.relatedPayBy.value) {
      expenseRelatedTo = event.target.expenseRel.value;
      expensePayByUser = event.target.relatedPayBy.value;
    } else if (
      event.target.expenseRel.value !== event.target.relatedPayBy.value
    ) {
      expenseRelatedTo = event.target.relatedPayBy.value;
      expensePayByUser = event.target.expenseRel.value;
    }
    let objToStore = {
      date: date,
      user: expenseRelatedTo,
      relatedTo: expensePayByUser,
      category: event.target.expenseCategory.value,
      relatedAmtVal: event.target.relatedAmount.value,
      amount: 0,
      subCategory: event.target.relatedNote.value || "NA",
      payBy: "NA",
      relatedAmount: true,
    };
    url = `https://splitwiseapp-82dbf-default-rtdb.firebaseio.com/${inviteCode}/expenseSheet/${id}.json`;

    try {
      let res = await axios.put(url, objToStore);
      if (res.status === 200) {
        setSuccessStatus(true);
      }
      setTimeout(() => {
        setSuccessStatus(false);
        navigate(`/home/sheets/${sheetCode}`);
      }, 1500);
    } catch (err) {
      alert("Try Again!");
    }
  }

  return (
    <>
      {isLoading && <Loading />}
      {!isLoading && (
        <center
          className={
            theme
              ? "text-gray-900 bg-white h-[100vh] w-[100vw]"
              : "bg-gray-900 text-white h-[100vh] w-[100vw]"
          }
        >
          <h2 className="text-slate-500 text-3xl cursor-pointer font-bold pt-4">
            Other Expenses
          </h2>

          <div className="md:w-[80%] mx-auto">
            <p className="px-2 font-semibold mt-2">Update Other Expense Here</p>
          </div>

          <div className="mt-4 shadow-xl drop-shadow-xl border-2 px-4 py-2 md:w-[40%] mx-auto">
            {dataToEdit.map((toEdit) => (
              <form
                onSubmit={(event) => otherExpenseHandler(event, toEdit.id)}
                key={toEdit.id}
                className=""
              >
                <h4 className="text-blue-600 text-xl cursor-pointer font-semibold mb-4">
                  Add Related Expense/Loan:
                </h4>

                <div className="flex gap-3 justify-between items-center my-3">
                  <label htmlFor="expenseRel"> Expense Related To</label>
                  <select
                    className="text-black p-1 rounded-lg mx-1 placeholder:text-black"
                    name="expenseRel"
                    required
                  >
                    <option
                      name="expenseRel"
                      hidden
                      defaultValue
                      value={toEdit.relatedTo}
                    >
                      {toEdit.relatedTo}
                    </option>
                    {comingData.map((userData) => (
                      <option
                        name="expenseRel"
                        value={userData.userName}
                        key={userData.id}
                      >
                        {userData.userName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-3 justify-between items-center my-3">
                  <label htmlFor="relatedPayBy">Pay By</label>
                  <select
                    className="text-black p-1 rounded-lg mx-1 placeholder:text-black"
                    name="relatedPayBy"
                    required
                  >
                    <option
                      name="relatedPayBy"
                      hidden
                      defaultValue
                      value={toEdit.user}
                    >
                      {toEdit.user}
                    </option>
                    {comingData.map((userData) => (
                      <option
                        name="relatedPayBy"
                        value={userData.userName}
                        key={userData.id}
                      >
                        {userData.userName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-3 justify-between items-center my-3">
                  <label htmlFor="expenseCategory">Category</label>
                  <select
                    className="text-black p-1 rounded-lg mx-1 placeholder:text-black"
                    name="expenseCategory"
                    placeholder="Choose Category"
                    required
                  >
                    <option hidden defaultValue value={toEdit.category}>
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

                <div className="flex gap-3 justify-between items-center my-3">
                  <label htmlFor="relatedAmount">Amount</label>
                  <input
                    required
                    name="relatedAmount"
                    type="number"
                    defaultValue={toEdit.relatedAmtVal}
                    className="text-black p-1 rounded-lg mx-1 placeholder:text-black"
                  />
                </div>
                <div className="flex gap-3 justify-between items-center my-3">
                  <label htmlFor="relatedNote">Note</label>
                  <input
                    name="relatedNote"
                    type="text"
                    placeholder="Add Note Here..."
                    defaultValue={toEdit.subCategory}
                    className="text-black p-1 rounded-lg mx-1 placeholder:text-black"
                  />
                </div>
                <div className="flex gap-3 justify-between items-center my-3">
                  <button
                    className="bg-red-500 text-2xl text-white px-6 py-1 rounded-xl font-bold "
                    onClick={() => navigate(-1)}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-2xl text-white px-6 py-1 rounded-xl font-bold"
                  >
                    Edit
                  </button>
                </div>
              </form>
            ))}
          </div>

          {successStatus && (
            <p className="m-2 text-green-500 text-xl font-semibold">
              Details Successufully Added!
            </p>
          )}
        </center>
      )}
    </>
  );
};

export default OtherExpense;
