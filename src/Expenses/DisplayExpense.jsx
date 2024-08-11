import { useDispatch, useSelector } from "react-redux";
import useFetchDataHook from "../customHooks/useFetchDataHook";
import Loading from "./../ExtraComponents/Loading";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { expenseSheetActions } from "../../store/expenseSheetSlice";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ForLargerScreen from "./ForLargerScreen";
import ForSmallerScreen from "./ForSmallerScreen";

const DisplayExpense = () => {
  const inviteCode = useSelector((state) => state.expenseSheet.inviteCode);
  let url = `https://splitwiseapp-82dbf-default-rtdb.firebaseio.com/${inviteCode}/expenseSheet`;
  const [comingData, isLoading] = useFetchDataHook(`${url}.json`);
  let length = comingData.length > 0;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.expenseSheet.token);
  const sheetCode = useSelector((state) => state.expenseSheet.sheetCode);
  const theme = useSelector((state) => state.theme.theme);
  const [previousBilllength, setPreviousBilllength] = useState(0);

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
    if (data.relatedAmount) {
      navigate(`/home/sheets/${sheetCode}/otherExpenseUpdate`);
      dispatch(expenseSheetActions.setExpenseToEdit([data]));
    } else if (!data.relatedAmount) {
      navigate(`/home/sheets/${sheetCode}/updateExpense`);
      dispatch(expenseSheetActions.setExpenseToEdit([data]));
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        let res = await axios.get(
          `https://splitwiseapp-82dbf-default-rtdb.firebaseio.com/${inviteCode}/previousBills.json`
        );
        let resArr = [];
        for (let key in res.data) {
          resArr.push({ ...res.data[key] });
        }
        setPreviousBilllength(resArr.length);
      } catch (err) {
        alert("No data found");
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <ToastContainer />
      <div
        className={
          theme
            ? "min-h-[100vh] bg-white text-slate-600  pt-4 z-0"
            : "min-h-[100vh] bg-slate-600 text-white pt-4 z-0"
        }
      >
        {!length && !isLoading && (
          <p className="  text-center font-bold text-3xl ">
            No expense to show
          </p>
        )}
        {previousBilllength > 0 && !length && (
          <p className="mt-2 text-lg text-center">
            Check out the
            <span
              className="text-blue-500 cursor-pointer ms-2"
              onClick={() => navigate(`/home/sheets/${sheetCode}/previousBill`)}
            >
              Previous Bills
            </span>
          </p>
        )}
        {isLoading && <Loading />}
        {length && (
          <div className="pb-20">
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
