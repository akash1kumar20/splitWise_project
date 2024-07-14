import { useState } from "react";
import OthersComponentCard from "../Card/OthersComponentCard";
import useFetchDataHook from "../customHooks/useFetchDataHook";
import { useSelector } from "react-redux";
import PieChart from "./PieChart";

const FilterData = () => {
  const [data, setData] = useState([]);
  const [fetchKey, setFetchKey] = useState("");
  const code = useSelector((state) => state.expenseSheet.inviteCode);
  const [comingData, isLoading] = useFetchDataHook(
    `https://splitwiseapp-82dbf-default-rtdb.firebaseio.com/${code}/expenseSheet.json`
  );

  let totalAmount = 0;
  comingData.map((data) => (totalAmount = totalAmount + Number(data.amount)));

  let dynamicKey;
  function displayCategoryFilter() {
    dynamicKey = "category";
    filterDataHandler();
  }

  function displayUserFilter() {
    dynamicKey = "user";
    filterDataHandler();
  }

  function displayPayByFilter() {
    dynamicKey = "payBy";
    filterDataHandler();
  }

  const filterDataHandler = () => {
    let dataArr = comingData.reduce((acc, data) => {
      //initial acc is an empty object

      const amount = parseFloat(data.amount);
      //because we are getting value as a string.

      let key;
      if (dynamicKey === "category") {
        key = data.category;
      } else if (dynamicKey === "user") {
        key = data.user;
      } else if (dynamicKey === "payBy") {
        key = data.payBy;
      }

      if (acc[key]) {
        acc[key].amount += amount;
        //if same type of value is coming
      } else {
        acc[key] = { ...data, amount };
        //adding for the first time.
      }
      setFetchKey(dynamicKey);
      return acc;
    }, {});

    setData(Object.values(dataArr));
    //converting back into an array.
  };

  return (
    <OthersComponentCard>
      {comingData.length === 0 && !isLoading && (
        <p>No data present to filter</p>
      )}
      {isLoading && <p>Calculating Amount...</p>}
      {comingData.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold text-center mb-5">
            Filter Data By:
          </h2>
          <div className="flex md:gap-10 gap-5 font-bold md:text-lg">
            <button
              className="focus:underline focus:scale-105 "
              onClick={displayCategoryFilter}
            >
              Expense Category
            </button>
            <button
              className="focus:underline focus:scale-105 "
              onClick={displayUserFilter}
            >
              User
            </button>
            <button
              className="focus:underline focus:scale-105 "
              onClick={displayPayByFilter}
            >
              Payment Method
            </button>
          </div>
        </div>
      )}
      {fetchKey.length > 0 && comingData.length > 0 && (
        <PieChart data={data} fetchKey={fetchKey} />
      )}
      {fetchKey.length > 0 && !isLoading && (
        <p className="text-center">Total Expense : {totalAmount}</p>
      )}
    </OthersComponentCard>
  );
};

export default FilterData;
