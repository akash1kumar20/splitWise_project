import { useState } from "react";
import OthersComponentCard from "../Card/OthersComponentCard";
import useFetchDataHook from "../customHooks/useFetchDataHook";
import { useSelector } from "react-redux";
import PieChart from "./PieChart";

const FilterData = () => {
  const [data, setData] = useState([]);
  const [fetchKey, setFetchKey] = useState("");
  const code = useSelector((state) => state.expenseSheet.sheetCode);
  const urlKey = "expenseSheet" + code;
  const [comingData, isLoading] = useFetchDataHook(
    `https://splitwiseapp-82dbf-default-rtdb.firebaseio.com/${urlKey}.json`
  );

  let totalAmount = 0;
  let percentage = 0;
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
      {fetchKey.length > 0 && <PieChart data={data} fetchKey={fetchKey} />}
      {isLoading && <p>Calculating Amount...</p>}
      {fetchKey.length > 0 && !isLoading && (
        <p className="text-center">Total Expense : {totalAmount}</p>
      )}
    </OthersComponentCard>
  );
};

export default FilterData;
