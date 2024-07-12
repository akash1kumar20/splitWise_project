import { FaPenAlt, FaTrash } from "react-icons/fa";

const ForSmallerScreen = ({ comingData, updateHandler, deleteHandler }) => {
  const updateExpenseHandler = (data) => {
    updateHandler(data);
  };
  const deleteExpenseHandler = (id) => {
    deleteHandler(id);
  };
  return (
    <>
      {comingData.map((data, i) => (
        <div
          className="lg:hidden grid grid-cols-2 text-white gap-x-1 text-lg font-semibold px-4 border-2 mb-1 mx-2 md:mx-6"
          key={data.id}
        >
          <p>S.No: {i + 1}</p>
          <p className="flex justify-between items-center">
            <span className="ms-1">Date: {data.date}</span>
            <span className="flex gap-x-2">
              <FaPenAlt
                className="text-yellow-400 text-lg cursor-pointer  hover:scale-x-125"
                onClick={() => updateExpenseHandler(data)}
              />
              <FaTrash
                className="text-red-500 text-lg cursor-pointer hover:scale-x-125"
                onClick={() => deleteExpenseHandler(data.id)}
              />
            </span>
          </p>

          <p>Category: {data.category}</p>
          {data.subCategory.length > 0 && (
            <p>
              Note:
              <span className="text-md ms-1">{data.subCategory}</span>
            </p>
          )}
          {data.subCategory.length === 0 && (
            <p>
              Note:
              <span className="text-md ms-1">___</span>
            </p>
          )}
          <p>
            Amount: {data.amount}
            <span className="text-sm font-extrabold ms-1">
              ( {data.payBy} )
            </span>
          </p>
          <p>Spend By: {data.user}</p>
        </div>
      ))}
    </>
  );
};

export default ForSmallerScreen;
