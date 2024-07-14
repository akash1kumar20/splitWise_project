import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useFetchDataHook from "../customHooks/useFetchDataHook";
import Loading from "../ExtraComponents/Loading";
import { FaCircle } from "react-icons/fa";
import { useReactToPrint } from "react-to-print";
import TableHead from "../ExtraComponents/TableHead";
import TableBody from "../ExtraComponents/TableBody";
import axios from "axios";

const GeneratedBill = () => {
  const token = useSelector((state) => state.expenseSheet.token);
  const [data, setData] = useState([]);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const details = useRef();
  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, []);
  const sheetCode = useSelector((state) => state.expenseSheet.sheetCode);
  const code = useSelector((state) => state.expenseSheet.inviteCode);
  let urlKey = `https://splitwiseapp-82dbf-default-rtdb.firebaseio.com/${code}/`;
  const [comingData, isLoading] = useFetchDataHook(
    `${urlKey}/expenseSheet.json`
  );
  useEffect(() => {
    const fetchData = async () => {
      try {
        let res = await axios.get(`${urlKey}/usersList.json`);
        let resArr = [];
        for (let key in res.data) {
          resArr.push({ ...res.data[key], id: key });
        }
        setUsers(resArr);
      } catch (err) {}
    };
    fetchData();
  }, []);
  let dataArray = comingData.map((item) => item.date);
  let startingDate;
  let endingDate;
  for (let i = 0; i < dataArray.length; i++) {
    startingDate = dataArray[0];
    endingDate = dataArray[dataArray.length - 1];
  }
  let amountArray = comingData.map((item) => item.amount);
  let totalAmount = 0;
  for (let i = 0; i < amountArray.length; i++) {
    totalAmount = totalAmount + Number(amountArray[i]);
  }

  useEffect(() => {
    const dataObj = comingData.reduce((acc, data) => {
      const amount = parseFloat(data.amount);
      if (acc[data.user]) {
        acc[data.user].amount += amount;
        //if same type of value is coming
      } else {
        acc[data.user] = { ...data, amount };
        //adding for the first time.
      }
      return acc;
    }, {});
    setData(Object.values(dataObj));
  }, [comingData]);

  const newBillHandler = useReactToPrint({
    content: () => details.current,
    documentTitle: startingDate + "to" + endingDate,
    onAfterPrint: () => afterPDFPrint(),
  });

  const afterPDFPrint = async () => {
    try {
      let res = await axios.delete(`${urlKey}/expenseSheet.json`);
      if (res.status === 200) {
        navigate(`/home/sheets/${sheetCode}`);
      }
    } catch (err) {
      console.log(err);
      alert("please try again");
    }
  };

  return (
    <>
      {isLoading && <Loading />}
      {!isLoading && (
        <p
          className="text-3xl font-semibold  text-center cursor-pointer"
          onClick={() => navigate(-1)}
        >
          X
        </p>
      )}
      {!isLoading && comingData.length === 0 && (
        <p className="text-2xl font-bold text-center mt-6">
          Please add some expense first{" "}
        </p>
      )}
      {!isLoading && comingData.length > 0 && (
        <div className="bg-slate-500 text-white text-center md:px-6 px-2 rounded-lg py-6 drop-shadow-xl shadow-xl shadow-black">
          <div className="md:hidden">
            <p className="font-semibold">
              Note - You will see the enteries in the pdf, download PDF in
              Landscape Mode Only.
            </p>
          </div>
          <div className=" bg-slate-500 h-[100vh] text-white p-6" ref={details}>
            <div className="hidden md:block">
              <TableHead />
              <TableBody comingData={comingData} />
            </div>
            <div className="flex justify-center items-center mt-3 gap-3">
              <p>Bill From : {startingDate}</p>
              <p>To : {endingDate}</p>
            </div>
            <div className="flex flex-col justify-center items-center gap-2 mb-1 mt-3">
              <h2 className="text-xl font-semibold ">
                Total Expense : ₹ {totalAmount}
              </h2>
              <p className="font-bold text-lg ">
                Per Head Contribution is ₹{" "}
                <span>
                  {totalAmount} / {users.length} (users) is ₹{" "}
                  {totalAmount / users.length || 0}
                </span>
              </p>
            </div>
            <div className=" flex justify-center mt-1 w-[100%]">
              <table>
                <thead>
                  <tr className="text-2xl font-bold ">
                    <th className="px-6">User</th>
                    <th className="px-6">Amount</th>
                    <th className="px-6">Balance</th>
                  </tr>
                </thead>
                {data.map((item) => (
                  <tbody key={item.id}>
                    <tr className="md:text-xl">
                      <td className="md:px-6">
                        <p>{item.user}</p>
                      </td>
                      <td className="md:px-6">{item.amount}</td>
                      <td className="md:px-6">
                        {totalAmount / users.length > item.amount ? (
                          <span className="text-red-900 font-semibold">
                            {totalAmount / users.length - item.amount}
                          </span>
                        ) : (
                          <span className="text-green-900 font-semibold">
                            {(totalAmount / users.length - item.amount) * -1}
                          </span>
                        )}
                      </td>
                    </tr>
                  </tbody>
                ))}
              </table>
            </div>
            {users.length > data.length && (
              <p className="text-center mt-3 font-semibold">
                Others users amount is zero and balance is ₹{" "}
                <span className="text-red-900 font-semibold">
                  {totalAmount / users.length}
                </span>
              </p>
            )}
            {users.length > data.length && (
              <div className="flex justify-center items-center  gap-1">
                All users -[
                {users.map((user) => (
                  <p key={user.id}>{user.userName}, </p>
                ))}
                ]
              </div>
            )}
          </div>
          <p className="flex justify-center gap-4 text-sm mt-3 items-center">
            <span className="min-h-6 min-w-6 rounded-full text-green-900 flex items-center">
              <FaCircle />{" "}
              <span className="text-white ms-1">Amount To Recieve</span>
            </span>
            <span className="min-h-6 min-w-6 rounded-full text-red-900 flex items-center">
              <FaCircle />{" "}
              <span className="text-white ms-1">Amount To Give</span>
            </span>
          </p>
          <div className="flex gap-2 my-5 justify-center items-center">
            <button
              className="text-xl bg-gradient-to-br from-green-400 via-green-700 to-green-950 px-4 py-2 text-white font-semibold rounded-xl shadow-xl drop-shadow-xl shadow-green-700"
              onClick={newBillHandler}
            >
              New Bill
            </button>
            <button
              className="text-xl bg-gradient-to-br from-blue-400 via-purple-700 to-blue-950 px-4 py-2 text-white font-semibold rounded-xl shadow-xl drop-shadow-xl shadow-purple-700"
              onClick={() => navigate(-1)}
            >
              Add More
            </button>
          </div>

          <p className="text-md font-bold">
            Please download the pdf, if you want to go through your expenses in
            future. Otherwise it will be lost forever when you click on the new
            bill button.
          </p>
        </div>
      )}
    </>
  );
};

export default GeneratedBill;
