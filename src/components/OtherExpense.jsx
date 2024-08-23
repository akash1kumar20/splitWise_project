import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import useFetchDataHook from "../customHooks/useFetchDataHook";
import Loading from "../ExtraComponents/Loading";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OtherExpense = () => {
  const [particularAmount, setParticualrAmount] = useState(false);
  const theme = useSelector((state) => state.theme.theme);
  const inviteCode = useSelector((state) => state.expenseSheet.inviteCode);
  const [comingData, isLoading] = useFetchDataHook(
    `https://splitwiseapp-82dbf-default-rtdb.firebaseio.com/${inviteCode}/usersList.json`
  );
  const navigate = useNavigate();
  const [successStatus, setSuccessStatus] = useState(false);

  const expenseRel = useRef();
  const expenseVal = useRef();
  const expenseNote = useRef();
  const categoryRef = useRef();
  const relatedPayBy = useRef();

  async function otherExpenseHandler(event) {
    event.preventDefault();
    let url;
    let date = new Date().toLocaleDateString();
    let expenseRelatedTo;
    let expensePayByUser;
    if (expenseRel.current.value === relatedPayBy.current.value) {
      expenseRelatedTo = expenseRel.current.value;
      expensePayByUser = relatedPayBy.current.value;
    } else if (expenseRel.current.value !== relatedPayBy.current.value) {
      expenseRelatedTo = relatedPayBy.current.value;
      expensePayByUser = expenseRel.current.value;
    }
    let objToStore = {
      date: date,
      user: expenseRelatedTo,
      relatedTo: expensePayByUser,
      category: categoryRef.current.value,
      relatedAmtVal: expenseVal.current.value,
      amount: 0,
      subCategory: expenseNote.current.value || "NA",
      payBy: "NA",
      relatedAmount: true,
    };
    url = `https://splitwiseapp-82dbf-default-rtdb.firebaseio.com/${inviteCode}/expenseSheet.json`;

    try {
      let res = await axios.post(url, objToStore);
      if (res.status === 200) {
        setSuccessStatus(true);
      }
      setTimeout(() => {
        setSuccessStatus(false);
        setParticualrAmount(false);
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
            <p className="px-2 font-semibold mt-2">
              Here Add Amount Like - The expense which is only related to single
              user and will not split in b/w other users. You can also add here,
              if you give loan to someone or somone give loan to you. In the
              first field just add the name of the user who is taking loan and
              in the second field add the name of the user who's giving the
              loan.
            </p>
          </div>
          <div className="mt-4 shadow-xl drop-shadow-xl border-2 px-4 py-2">
            <form onSubmit={(event) => otherExpenseHandler(event)}>
              <h4
                className="text-blue-600 text-xl cursor-pointer font-semibold"
                onClick={() => setParticualrAmount(true)}
              >
                Add Related Expense/Loan
                <u className="text-white ms-1">Here</u>
              </h4>
              {particularAmount && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-1">
                  <select
                    className="text-black p-1 rounded-lg mx-1 placeholder:text-black"
                    name="related"
                    ref={expenseRel}
                    required
                  >
                    <option name="related" hidden defaultValue value="">
                      Expense Related To
                    </option>
                    {comingData.map((userData) => (
                      <option
                        name="related"
                        value={userData.userName}
                        key={userData.id}
                      >
                        {userData.userName}
                      </option>
                    ))}
                  </select>
                  <select
                    className="text-black p-1 rounded-lg mx-1 placeholder:text-black"
                    name="relatedPayBy"
                    ref={relatedPayBy}
                    required
                  >
                    <option name="relatedPayBy" hidden defaultValue value="">
                      Pay By
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
                  <select
                    className="text-black p-1 rounded-lg mx-1 placeholder:text-black"
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
                    required
                    ref={expenseVal}
                    name="relatedAmount"
                    type="number"
                    placeholder="Amount in ₹"
                    className="text-black p-1 rounded-lg mx-1 placeholder:text-black"
                  />
                  <input
                    ref={expenseNote}
                    name="relatedNote"
                    type="text"
                    placeholder="Add Note Here..."
                    className="text-black p-1 rounded-lg mx-1 placeholder:text-black"
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-1 rounded-xl"
                  >
                    Add
                  </button>
                  <button
                    className="bg-red-500 text-2xl text-white px-6 py-1 rounded-xl font-bold "
                    onClick={() => setParticualrAmount(false)}
                  >
                    X
                  </button>
                </div>
              )}
            </form>
          </div>
          {successStatus && (
            <p className="m-2 text-green-500 text-xl font-semibold">
              Details Successufully Added!
            </p>
          )}
          <button
            className="bg-red-500 text-2xl text-white px-6 py-1 rounded-xl font-bold mt-3"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
        </center>
      )}
    </>
  );
};

export default OtherExpense;
