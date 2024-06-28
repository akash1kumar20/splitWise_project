import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import Footer from "../ExtraComponents.jsx/Footer";

const AddSheet = () => {
  const [sheetPresent, setSheetPresent] = useState(false);
  const [sheetData, setSheetData] = useState([]);

  useEffect(() => {
    const userMail = localStorage.getItem("user-mail");
    let changeEmail;
    if (userMail === null) {
      changeEmail = 0;
    } else {
      changeEmail = userMail.replace("@", "").replace(".", "");
    }
    const fetchData = async () => {
      try {
        let res = await axios.get(
          `https://splitwiseapp-82dbf-default-rtdb.firebaseio.com/${changeEmail}/sheets.json`
        );
        if (res.status === 200) {
          setSheetPresent(true);
        }
        const sheetArray = [];
        for (let key in res.data) {
          sheetArray.push({ ...res.data[key], id: key });
        }
        setSheetData(sheetArray);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  });
  const navigate = useNavigate();
  return (
    <>
      <div className="bg-gray-900 text-white h-[100vh] w-[100vw]">
        <h1 className="md:text-3xl text-xl pt-10 text-center font-serif underline">
          It sounds extraordinary but it's a fact that balance sheets can make
          fascinating reading.
        </h1>
        <div className="grid grid-cols-2 md:grid-cols-4 py-16 md:mx-32 gap-y-6">
          {sheetPresent &&
            sheetData.map((sheet) => (
              <div className="flex flex-col items-center gap-3 " key={sheet.id}>
                <p
                  className="text-xl p-6 rounded-full bg-gray-600 border-2 border-gray-500 shadow-xl cursor-pointer"
                  onClick={() => navigate(`/home/sheets/${sheet.code}`)}
                >
                  {sheet.sheetName}
                </p>
                <span className="text-sm text-gray-200">Your Sheet</span>
              </div>
            ))}
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
      <Footer />
    </>
  );
};

export default AddSheet;
