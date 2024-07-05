import { useDispatch, useSelector } from "react-redux";
import useFetchDataHook from "../customHooks/useFetchDataHook";
import Loading from "./../ExtraComponents/Loading";
import { FaPenAlt, FaTrash } from "react-icons/fa";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { expenseSheetActions } from "../../store";
import { useNavigate } from "react-router-dom";

const DisplayExpense = () => {
  const sheetCode = useSelector((state) => state.expenseSheet.sheetCode);
  let urlKey = "expenseSheet" + sheetCode;
  let url = `https://splitwiseapp-82dbf-default-rtdb.firebaseio.com/${urlKey}`;
  const [comingData, isLoading] = useFetchDataHook(`${url}.json`);
  let length = comingData.length > 0;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function deleteExpenseHandler(id) {
    try {
      let res = await axios.delete(`${url}/${id}.json`);
      if (res.status === 200) {
        toast.warning("Expense Deleted", {
          theme: "dark",
          autoClose: 1000,
          position: "top-right",
        });
      }
    } catch (err) {
      toast.error("Try Again", {
        theme: "dark",
        autoClose: 1000,
        position: "top-right",
      });
    }
  }

  function updateExpenseHandler(data) {
    dispatch(expenseSheetActions.setExpenseToEdit([data]));
    navigate(`/home/sheets/:${sheetCode}/updateExpense`);
  }

  return (
    <>
      <ToastContainer />
      <div className="min-h-[100vh] bg-slate-600  pt-4">
        {!length && !isLoading && (
          <p className=" text-white text-center font-bold text-3xl ">
            No expense to show
          </p>
        )}
        {isLoading && <Loading />}
        {length && (
          <div>
            {comingData.map((data, i) => (
              <div
                className="lg:hidden grid grid-cols-2 text-white gap-x-1 text-lg font-semibold px-4 border-2 mb-1 mx-2 md:mx-6"
                key={data.id}
              >
                <p>S.No: {i + 1}</p>
                <p className="flex justify-between items-center">
                  <span className="ms-1">Date: {data.date}</span>
                  <span className="flex gap-x-2">
                    <FaPenAlt
                      className="text-yellow-400 text-lg cursor-pointer  hover:scale-x-125"
                      onClick={() => updateExpenseHandler(data)}
                    />
                    <FaTrash
                      className="text-red-500 text-lg cursor-pointer hover:scale-x-125"
                      onClick={() => deleteExpenseHandler(data.id)}
                    />
                  </span>
                </p>

                <p>Category: {data.category}</p>
                {data.subCategory.length > 0 && (
                  <p>
                    Note:
                    <span className="text-md ms-1">{data.subCategory}</span>
                  </p>
                )}
                {data.subCategory.length === 0 && (
                  <p>
                    Note:
                    <span className="text-md ms-1">___</span>
                  </p>
                )}
                <p>
                  Amount: {data.amount}
                  <span className="text-sm font-extrabold ms-1">
                    ( {data.payBy} )
                  </span>
                </p>
                <p>Spend By: {data.user}</p>
              </div>
            ))}

            <div className="hidden text-2xl text-white lg:flex flex-row justify-between mx-6 border-2 p-4 font-bold">
              <table>
                <thead>
                  <tr>
                    <th className="tableElementSide">S.No</th>
                    <th className="tableHeading">Date</th>
                    <th className="tableElementMain">Category</th>
                    <th className="tableElementMain">Note</th>
                    <th className="tableHeading">Amount</th>
                    <th className="tableHeading">Spend By</th>
                    <th className="tableElementSide">Actions</th>
                  </tr>
                </thead>
              </table>
            </div>
            {comingData.map((data, i) => (
              <div
                className="hidden text-2xl text-white lg:flex flex-row justify-between mx-6 border-2 p-4"
                key={data.id}
              >
                <table>
                  <tbody>
                    <tr>
                      <td className="tableElementSide">{i + 1}</td>
                      <td className="tableHeading">{data.date}</td>
                      <td className="tableElementMain">{data.category}</td>
                      {data.subCategory.length > 0 && (
                        <td className="tableElementMain">{data.subCategory}</td>
                      )}
                      {data.subCategory.length === 0 && (
                        <td className="tableElementMain">___</td>
                      )}
                      <td className="tableHeading">
                        {data.amount}
                        <p className="text-sm font-extrabold">
                          By - {data.payBy}
                        </p>
                      </td>
                      <td className="tableHeading ">{data.user}</td>
                      <td className="tableElementSide">
                        <span className="flex gap-x-6">
                          <FaPenAlt
                            className="text-yellow-400 text-lg cursor-pointer  hover:scale-x-125"
                            onClick={() => updateExpenseHandler(data)}
                          />
                          <FaTrash
                            className="text-red-500 text-lg cursor-pointer hover:scale-x-125"
                            onClick={() => deleteExpenseHandler(data.id)}
                          />
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default DisplayExpense;
