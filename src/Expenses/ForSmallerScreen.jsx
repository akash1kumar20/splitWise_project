import { FaPenAlt, FaTrash } from "react-icons/fa";

const ForSmallerScreen = ({ comingData, updateHandler, deleteHandler }) => {
  return (
    <div className="lg:hidden flex flex-col">
      {comingData.map((data, i) => {
        const isFL = !!data.relatedAmount;
        const amount = isFL ? data.relatedAmtVal : data.amount;
        const pay = isFL ? "F&L" : data.payBy === "NA" ? "F&L" : data.payBy;
        const spendBy = isFL
          ? `${data.user} pays ${data.relatedTo}`
          : data.user;

        return (
          <div
            key={data.id}
            className="flex items-center px-4 py-3 border-b border-gray-600 border-opacity-40"
          >
            <div
              className={`w-11 h-11 rounded-full bg-blue-500 flex items-center justify-center text-xl flex-shrink-0 mr-3 }`}
            >
              {i + 1}
            </div>

            {/* Middle: category + note + spend by */}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-base leading-tight truncate">
                {data.category}
                {isFL && (
                  <span className="ml-1 text-xs font-normal text-indigo-400">
                    F&L
                  </span>
                )}
              </p>
              <p className="text-xs text-gray-400 truncate mt-0.5">
                {data.subCategory && data.subCategory !== "NA"
                  ? `${data.subCategory} · `
                  : ""}
                {spendBy}
              </p>
              {data.isEdited && (
                <span className="text-orange-400 text-xs font-semibold">
                  Edited · Prev Rs.{data.previousAmount}
                </span>
              )}
            </div>

            {/* Right: amount + date + pay method + actions */}
            <div className="flex flex-col items-end ml-2 flex-shrink-0">
              <p className="font-bold text-red-400 text-base leading-tight">
                -Rs.{amount}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{data.date}</p>
              <p className="text-gray-500" style={{ fontSize: "10px" }}>
                {pay}
              </p>
              <div className="flex gap-3 mt-1.5">
                <FaPenAlt
                  className="text-yellow-400 text-sm cursor-pointer"
                  onClick={() => updateHandler(data)}
                />
                <FaTrash
                  className="text-red-500 text-sm cursor-pointer"
                  onClick={() => deleteHandler(data.id)}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ForSmallerScreen;
