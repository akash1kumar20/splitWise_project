import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const AddSheet = () => {
  const [sheetPresent, setSheetPresent] = useState(false);
  const navigate = useNavigate();
  return (
    <div className="bg-gray-900 text-white">
      <h1 className="md:text-3xl text-xl pt-10 text-center font-serif underline">
        It sounds extraordinary but it's a fact that balance sheets can make
        fascinating reading.
      </h1>
      <div className=" flex py-16 justify-evenly items-center">
        {sheetPresent && (
          <div className="flex flex-col items-center gap-3 ">
            <p className="text-xl p-6 rounded-full bg-gray-600 border-2 border-gray-500 shadow-xl cursor-pointer">
              CS
            </p>
            <span className="text-sm text-gray-200">Your Sheet</span>
          </div>
        )}
        <div className="flex flex-col items-center gap-3">
          <p
            className="text-2xl p-6 rounded-full bg-gray-600 border-2 border-gray-500 shadow-xl cursor-pointer"
            onClick={() => navigate("/home/sheets/addSheet")}
          >
            <IoMdAdd />
          </p>
          <span className="text-sm text-gray-200">Add Sheet</span>
        </div>
        <div className="flex flex-col items-center gap-3">
          <p
            className="text-xl p-6 rounded-full bg-gray-600 border-2 border-gray-500 shadow-xl cursor-pointer"
            onClick={() => navigate("/home/sheets/findSheet")}
          >
            <FaSearch />
          </p>
          <span className="text-sm text-gray-200">Find Sheet</span>
        </div>
      </div>
    </div>
  );
};

export default AddSheet;
