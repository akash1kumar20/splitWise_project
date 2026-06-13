import { FaPenAlt, FaTrash } from "react-icons/fa";

const ForSmallerScreen = ({ comingData, updateHandler, deleteHandler }) => {
  return (
    <>
      {comingData.map((data, i) => (
        <div className="lg:hidden grid grid-cols-2 gap-x-1 text-lg font-semibold px-4 border-2 mb-1 mx-2 md:mx-6" key={data.id}>
          <p>S.No: {i + 1}</p>
          <p className="flex justify-between items-center">
            <span>{data.date}</span>
            <span className="flex gap-x-4">
              <FaPenAlt className="text-yellow-400 text-lg cursor-pointer" onClick={() => updateHandler(data)} />
              <FaTrash className="text-red-500 text-lg cursor-pointer" onClick={() => deleteHandler(data.id)} />
            </span>
          </p>
          {/* Fix 4: full category name, no truncation */}
          <p>Category: {data.category}</p>
          <p>Note: <span className="text-md ms-1">{data.subCategory}</span></p>
          <p>
            Amount: {!data.relatedAmount ? data.amount : data.relatedAmtVal}
            {/* Fix 3: NA → F&L */}
            <span className="text-sm font-extrabold ms-1">
              ({!data.relatedAmount ? (data.payBy === "NA" ? "F&L" : data.payBy) : "F&L"})
            </span>
          </p>
          {!data.relatedAmount ? <p>Spend By: {data.user}</p> : <p>Related To: {data.relatedTo}</p>}
          {data.isEdited && (
            <p className="col-span-2 text-xs font-bold text-orange-400">
              ✏️ Edited | Previous Amount: ₹{data.previousAmount}
            </p>
          )}
        </div>
      ))}
    </>
  );
};

export default ForSmallerScreen;
