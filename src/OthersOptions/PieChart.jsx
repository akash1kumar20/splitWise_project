import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";

const PieChart = ({ data, fetchKey }) => {
  const [chartLabels, setChartLables] = useState([]);
  const [chartValues, setChartValues] = useState([]);

  useEffect(() => {
    let value;
    let amount;
    if (fetchKey === "payBy") {
      value = data.map((item) => item.payBy);
      amount = data.map((item) => item.amount);
    } else if (fetchKey === "user") {
      value = data.map((item) => item.user);
      amount = data.map((item) => item.amount);
    } else if (fetchKey === "category") {
      value = data.map((item) => item.category);
      amount = data.map((item) => item.amount);
    }
    setChartLables(value);
    setChartValues(amount);
  }, [fetchKey]);

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: "Expense Chart",
        data: chartValues,
        backgroundColor: [
          "rgb(255, 190, 11)",
          "rgb(251, 86, 7)",
          "rgb(255, 0, 110 )",
          "rgb(131, 56, 236)",
          "rgb(58, 134, 255)",
          "rgb(2, 48, 71)",
        ],
        borderColor: [
          "rgba(255, 190, 11, 1)",
          "rgba(251, 86, 7, 1)",
          "rgba(255, 0, 110, 1)",
          "rgba(131, 56, 236, 1)",
          "rgba(58, 134, 255, 1)",
          "rgba(2, 48, 71, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Pie
      data={chartData}
      className="bg-white bg-opacity-60 rounded-lg p-2 font-extrabold text-2xl"
    />
  );
};

export default PieChart;
