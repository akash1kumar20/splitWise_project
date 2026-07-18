import { useState } from "react";
import useFetchDataHook from "../customHooks/useFetchDataHook";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PieChart from "./PieChart";
import { FIREBASE_DB_URL } from "../config/firebase";

const FilterData = () => {
  const [data, setData] = useState([]);
  const [fetchKey, setFetchKey] = useState("");
  const [activeKey, setActiveKey] = useState("");
  const code = useSelector((s) => s.expenseSheet.inviteCode);
  const navigate = useNavigate();

  const [comingData, isLoading] = useFetchDataHook(
    `${FIREBASE_DB_URL}/${code}/expenseSheet.json`,
  );

  const filterDataHandler = (dynamicKey) => {
    const dataArr = comingData.reduce((acc, item) => {
      const amount = parseFloat(item.amount) || 0;
      const relatedAmtVal = parseFloat(item.relatedAmtVal) || 0;

      let key;
      if (dynamicKey === "category") key = item.category;
      else if (dynamicKey === "user") key = item.user;
      else if (dynamicKey === "payBy")
        key = item.payBy === "NA" ? "F&L Entry" : item.payBy;

      if (acc[key]) {
        // subsequent items — accumulate
        acc[key].amount += amount + relatedAmtVal;
      } else {
        // ✅ Fix: first item must also include relatedAmtVal in amount
        // (previously only `amount` was stored, losing F&L values for first-in-group)
        acc[key] = {
          ...item,
          amount: amount + relatedAmtVal,
          relatedAmtVal: 0,
          payBy: key,
          user: key,
          category: key,
        };
      }
      return acc;
    }, {});

    setData(Object.values(dataArr));
    setFetchKey(dynamicKey);
    setActiveKey(dynamicKey);
  };

  const filteredTotal = data.reduce((s, i) => s + (i.amount || 0), 0);

  const tabs = [
    { key: "category", label: "Expense Category" },
    { key: "user", label: "User" },
    { key: "payBy", label: "Payment Method" },
  ];

  return (
    <div className="min-h-screen bg-[rgba(154,140,152,0.8)] pb-10">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-4 border-b bg-white shadow-sm">
        <button
          className="text-sm bg-gray-800 text-white px-4 py-2 rounded-xl hover:bg-gray-700 whitespace-nowrap"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
        <h1 className="text-lg font-bold text-gray-800">Filter Data</h1>
        <div className="w-20" />
      </div>

      <div className="max-w-lg mx-auto px-4 pt-5">
        {isLoading && (
          <p className="text-center text-gray-500 mt-10">Loading...</p>
        )}
        {!isLoading && comingData.length === 0 && (
          <p className="text-center text-gray-500 mt-10">
            No expenses to filter.
          </p>
        )}

        {comingData.length > 0 && (
          <>
            {/* Tab buttons */}
            <div className="flex rounded-2xl overflow-hidden border border-gray-300 mb-5">
              {tabs.map((tab, i) => (
                <button
                  key={tab.key}
                  onClick={() => filterDataHandler(tab.key)}
                  className={`flex-1 py-2 px-1 text-xs sm:text-sm font-semibold transition-all
                    ${i !== 0 ? "border-l border-gray-300" : ""}
                    ${
                      activeKey === tab.key
                        ? "bg-gray-800 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            {!fetchKey && (
              <p className="text-white text-center font-semibold text-lg">
                Click on a category
              </p>
            )}
            {/* Pie chart */}
            {fetchKey && (
              <div className="bg-white rounded-2xl shadow border border-gray-100 p-4">
                <PieChart data={data} fetchKey={fetchKey} />
                <p className="text-center font-semibold text-gray-700 mt-3">
                  Total Expense : ₹{filteredTotal}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FilterData;
