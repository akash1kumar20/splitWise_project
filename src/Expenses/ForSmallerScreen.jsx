import { FaPenAlt, FaTrash } from "react-icons/fa";

const CATEGORY_CONFIG = {
  "Food & Drinks":        { color: "bg-green-600",  emoji: "F"  },
  "Household Items":      { color: "bg-blue-600",   emoji: "H"  },
  "Transport & Vehicle":  { color: "bg-amber-500",  emoji: "T"  },
  "Shopping":             { color: "bg-pink-600",   emoji: "S"  },
  "Life & Entertainment": { color: "bg-orange-500", emoji: "L"  },
  "Housing":              { color: "bg-teal-600",   emoji: "Ho" },
  "Health & Fitness":     { color: "bg-red-500",    emoji: "He" },
  "Education":            { color: "bg-purple-600", emoji: "E"  },
  "Travel":               { color: "bg-cyan-600",   emoji: "Tr" },
  "Others":               { color: "bg-gray-500",   emoji: "O"  },
};

const getConfig = (category, isFL) => {
  if (isFL) return { color: "bg-indigo-500", emoji: "FL" };
  return CATEGORY_CONFIG[category] || { color: "bg-gray-600", emoji: category ? category.charAt(0).toUpperCase() : "?" };
};

const ForSmallerScreen = ({ comingData, updateHandler, deleteHandler }) => {
  const isPersonal = localStorage.getItem("sp_sheetType") === "personal";

  return (
    <div className="lg:hidden flex flex-col">
      {comingData.map((data) => {
        const isFL    = !!data.relatedAmount;
        const amount  = isFL ? data.relatedAmtVal : data.amount;
        const pay     = isFL ? "F&L" : (data.payBy === "NA" ? "F&L" : data.payBy);
        // Personal sheet always shows "Self"
        const spendBy = isPersonal ? "Self" : (isFL ? `${data.user} pays ${data.relatedTo}` : data.user);
        const cfg = getConfig(data.category, isFL);

        return (
          <div key={data.id} className="flex items-center px-4 py-3 border-b border-gray-600 border-opacity-40">
            <div className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0 mr-3 ${cfg.color}`}>
              {cfg.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-base leading-tight truncate">
                {data.category}
                {isFL && <span className="ml-1 text-xs font-normal text-indigo-400">F&L</span>}
              </p>
              <p className="text-xs text-gray-400 truncate mt-0.5">
                {data.subCategory && data.subCategory !== "NA" ? `${data.subCategory} · ` : ""}
                {spendBy}
              </p>
              {data.isEdited && (
                <span className="text-orange-400 text-xs font-semibold">Edited · Prev Rs.{data.previousAmount}</span>
              )}
            </div>
            <div className="flex flex-col items-end ml-2 flex-shrink-0">
              <p className="font-bold text-red-400 text-base leading-tight">-Rs.{amount}</p>
              <p className="text-xs text-gray-400 mt-0.5">{data.date}</p>
              <p className="text-gray-500" style={{ fontSize: "10px" }}>{pay}</p>
              <div className="flex gap-3 mt-1.5">
                <FaPenAlt className="text-yellow-400 text-sm cursor-pointer" onClick={() => updateHandler(data)} />
                <FaTrash  className="text-red-500  text-sm cursor-pointer" onClick={() => deleteHandler(data.id)} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ForSmallerScreen;
