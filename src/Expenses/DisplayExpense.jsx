import { useDispatch, useSelector } from "react-redux";
import useFetchDataHook from "../customHooks/useFetchDataHook";
import Loading from "./../ExtraComponents/Loading";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { expenseSheetActions } from "../../store";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import ForLargerScreen from "./ForLargerScreen";
import ForSmallerScreen from "./ForSmallerScreen";

const DisplayExpense = () => {
  const sheetCode = useSelector((state) => state.expenseSheet.sheetCode);
  let urlKey = "expenseSheet" + sheetCode;
  let url = `https://splitwiseapp-82dbf-default-rtdb.firebaseio.com/${urlKey}`;
  const [comingData, isLoading] = useFetchDataHook(`${url}.json`);
  let length = comingData.length > 0;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.expenseSheet.token);

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, []);

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
    navigate(`/home/sheets/${sheetCode}/updateExpense`);
  }

  return (
    <>
      <ToastContainer />
      <div className="min-h-[100vh] bg-slate-600  pt-4 z-0">
        {!length && !isLoading && (
          <p className=" text-white text-center font-bold text-3xl ">
            No expense to show
          </p>
        )}
        {isLoading && <Loading />}
        {length && (
          <div>
            <ForSmallerScreen
              comingData={comingData}
              updateHandler={updateExpenseHandler}
              deleteHandler={deleteExpenseHandler}
            />
            <ForLargerScreen
              comingData={comingData}
              updateHandler={updateExpenseHandler}
              deleteHandler={deleteExpenseHandler}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default DisplayExpense;
