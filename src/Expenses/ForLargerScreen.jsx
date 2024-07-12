import TableHead from "../ExtraComponents/TableHead";
import { FaPenAlt, FaTrash } from "react-icons/fa";

const ForLargerScreen = ({ comingData, updateHandler, deleteHandler }) => {
  const updateExpenseHandler = (data) => {
    updateHandler(data);
  };
  const deleteExpenseHandler = (id) => {
    deleteHandler(id);
  };
  return (
    <>
      <div className="hidden text-2xl text-white lg:flex flex-row justify-between mx-6 border-2 p-4 font-bold">
        <table>
          <thead>
            <tr>
              <TableHead />
              <th className="tableElementSide">Actions</th>
            </tr>
          </thead>
        </table>
      </div>
      {comingData.map((data, i) => (
        <div
          className="hidden text-2xl text-white lg:flex flex-row justify-between mx-6 border-2 p-4"
          key={data.id}
        >
          <table>
            <tbody>
              <tr>
                <td className="tableElementSide">{i + 1}</td>
                <td className="tableHeading">{data.date}</td>
                <td className="tableElementMain">{data.category}</td>
                {data.subCategory.length > 0 && (
                  <td className="tableElementMain">{data.subCategory}</td>
                )}
                {data.subCategory.length === 0 && (
                  <td className="tableElementMain">___</td>
                )}
                <td className="tableHeading">
                  {data.amount}
                  <p className="text-sm font-extrabold">By - {data.payBy}</p>
                </td>
                <td className="tableHeading ">{data.user}</td>
                <td className="tableElementSide">
                  <span className="flex gap-x-6">
                    <FaPenAlt
                      className="text-yellow-400 text-lg cursor-pointer  hover:scale-x-125"
                      onClick={() => updateExpenseHandler(data)}
                    />
                    <FaTrash
                      className="text-red-500 text-lg cursor-pointer hover:scale-x-125"
                      onClick={() => deleteExpenseHandler(data.id)}
                    />
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ))}
    </>
  );
};

export default ForLargerScreen;