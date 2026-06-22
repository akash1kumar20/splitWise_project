import TableHead from "../ExtraComponents/TableHead";
import { FaPenAlt, FaTrash } from "react-icons/fa";

const ForLargerScreen = ({ comingData, updateHandler, deleteHandler }) => {
  const isPersonal = localStorage.getItem("sp_sheetType") === "personal";
  const displayUser = () => "Self"; // personal sheets always show Self

  return (
    <>
      <div className="hidden text-2xl lg:flex flex-row justify-between mx-6 border-2 p-4 font-bold">
        <TableHead />
      </div>
      {comingData.map((data, i) => (
        <table
          className="hidden text-2xl lg:flex flex-row justify-between mx-6 border-2 p-4"
          key={data.id}
        >
          <tbody>
            <tr>
              <td className="tableElementSide">{i + 1}</td>
              <td className="tableHeading">{data.date}</td>
              <td className="tableElementMain">{data.category}</td>
              <td className="tableElementMain">{data.subCategory}</td>
              <td className="tableHeading">
                {!data.relatedAmount ? data.amount : data.relatedAmtVal}
                {!data.relatedAmount ? (
                  <p className="text-sm font-extrabold">PM - {data.payBy}</p>
                ) : (
                  <p className="text-sm font-extrabold">
                    F&L - {data.relatedTo}
                  </p>
                )}
                {data.isEdited && (
                  <p className="text-xs font-bold text-orange-400">
                    Edited | Prev: Rs.{data.previousAmount}
                  </p>
                )}
              </td>
              {/* Personal sheet: always show "Self" */}
              <td className="tableHeading">
                {isPersonal ? "Self" : data.user}
              </td>
              <td className="tableElementSide">
                <span className="flex gap-x-6 ms-10">
                  <FaPenAlt
                    className="text-yellow-400 text-lg cursor-pointer hover:scale-x-125"
                    onClick={() => updateHandler(data)}
                  />
                  <FaTrash
                    className="text-red-500  text-lg cursor-pointer hover:scale-x-125"
                    onClick={() => deleteHandler(data.id)}
                  />
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      ))}
    </>
  );
};

export default ForLargerScreen;
