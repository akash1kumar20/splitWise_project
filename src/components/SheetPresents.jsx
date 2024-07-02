import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaSearch, FaTrash } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import Footer from "../ExtraComponents.jsx/Footer";
import { useDispatch, useSelector } from "react-redux";
import { expenseSheetActions } from "../../store";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddSheet = () => {
  const [sheetPresent, setSheetPresent] = useState(false);
  const [sheetData, setSheetData] = useState([]);
  const [loading, setLoading] = useState(false);
  const changeEmail = useSelector((state) => state.expenseSheet.convertedMail);
  const dispatch = useDispatch();
  const useMail = useSelector((state) => state.expenseSheet.userMail);

  useEffect(() => {
    setLoading(true);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let res = await axios.get(
          `https://splitwiseapp-82dbf-default-rtdb.firebaseio.com/${changeEmail}/sheets.json`
        );
        setLoading(false);
        if (res.status === 200) {
          setSheetPresent(true);
        }
        const sheetArray = [];
        for (let key in res.data) {
          sheetArray.push({ ...res.data[key], id: key });
        }
        setSheetData(sheetArray);
      } catch (err) {}
    };
    fetchData();
  });
  const navigate = useNavigate();
  const openSpecificSheetHandler = (sheet) => {
    dispatch(
      expenseSheetActions.setCodes({
        sheetCode: sheet.code,
        inviteCode: sheet.inviationCode,
      })
    );

    navigate(`/home/sheets/${sheet.code}`);
  };

  const deleteSheetHandler = async (sheet) => {
    try {
      let delQuery1 = await axios.delete(
        `https://splitwiseapp-82dbf-default-rtdb.firebaseio.com/${changeEmail}/sheets/${sheet.id}.json`
      );
      let delQuery2;
      if (sheet.userMail === userMail) {
        delQuery2 = await axios.delete(
          `https://splitwiseapp-82dbf-default-rtdb.firebaseio.com/${sheet.inviationCode}.json`
        );
      }
      if (delQuery1.status === 200 && delQuery2.status === 200) {
        toast.error("Sheet Deleted", {
          theme: "dark",
          position: "top-right",
          autoClose: 1000,
        });
      }
    } catch (error) {}
  };
  return (
    <>
      <div className="bg-gray-900 text-white h-[100vh] w-[100vw]">
        <ToastContainer />
        <h1 className="md:text-3xl text-xl pt-10 text-center font-serif underline">
          It sounds extraordinary but it's a fact that balance sheets can make
          fascinating reading.
        </h1>
        {loading && <p className="text-center mt-10">Loading...</p>}
        {!loading && (
          <div className="grid grid-cols-2 md:grid-cols-4 py-8 md:mx-32 gap-y-6 ">
            {sheetPresent &&
              sheetData.map((sheet) => (
                <div
                  className="flex flex-col items-center gap-3 static"
                  key={sheet.id}
                >
                  <FaTrash
                    className="relative top-[20px] left-6 text-red-500 hover:text-red-700 cursor-pointer hover:scale-150"
                    onClick={() => deleteSheetHandler(sheet)}
                  />

                  <p
                    className="text-xl p-6 rounded-full bg-gray-600 border-2 border-gray-500 shadow-xl cursor-pointer"
                    onClick={() => openSpecificSheetHandler(sheet)}
                  >
                    {sheet.sheetName.substring(0, 2)}...
                  </p>
                  <span className="text-sm text-gray-200">
                    {sheet.sheetName}
                  </span>
                </div>
              ))}
            <div className="flex flex-col items-center gap-3 mt-9">
              <p
                className="text-2xl p-6 rounded-full bg-gray-600 border-2 border-gray-500 shadow-xl cursor-pointer"
                onClick={() => navigate("/home/sheets/addSheet")}
              >
                <IoMdAdd />
              </p>
              <span className="text-sm text-gray-200">Add Sheet</span>
            </div>
            <div className="flex flex-col items-center gap-3 mt-9">
              <p
                className="text-xl p-6 rounded-full bg-gray-600 border-2 border-gray-500 shadow-xl cursor-pointer"
                onClick={() => navigate("/home/sheets/findSheet")}
              >
                <FaSearch />
              </p>
              <span className="text-sm text-gray-200">Find Sheet</span>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default AddSheet;
