import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CardComponent from "../Card/CardComponent";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FoundSheet = () => {
  const [data, setData] = useState([]);
  const sheetData = useSelector((state) => state.expenseSheet.sheetFoundData);
  const navigate = useNavigate();
  const changeEmail = useSelector((state) => state.expenseSheet.convertedMail);

  useEffect(() => {
    if (sheetData.length === 0) {
      navigate("/home/sheets");
    }
    setData(sheetData);
  }, []);

  async function createSheet(sheetData) {
    try {
      const sheetRes = await axios.post(
        `https://splitwiseapp-82dbf-default-rtdb.firebaseio.com/${changeEmail}/sheets.json`,
        sheetData,
      );

      if (sheetRes.status === 200) {
        // ✅ Register this user as a member of the sheet (used for admin bulk-delete)
        await axios.post(
          `https://splitwiseapp-82dbf-default-rtdb.firebaseio.com/${sheetData.inviationCode}/members.json`,
          { convertedMail: changeEmail },
        );

        // ✅ Fire event so SheetPresents refetches immediately (same fix as CreateSheet)
        window.dispatchEvent(new Event("sheetCreated"));
        navigate("/home/sheets");
      }
    } catch (err) {
      toast.error("Could not join sheet. Please check the code and try again.", { theme: "colored", autoClose: 2500, position: "top-center" });
    }
  }

  return (
    <>
      <ToastContainer autoClose={2000} />
      <CardComponent>
      {data.map((sheetData) => (
        <div className="px-4 text-xl font-bold" key={sheetData.id}>
          <p>
            Sheet Name:
            <span className="ms-2 underline font-extrabold">
              {sheetData.sheetName}
            </span>
          </p>
          <p>
            Sheet Created By:
            <span className="ms-2 underline font-extrabold">
              {sheetData.userMail}
            </span>
          </p>
          <button
            className="bg-blue-700 py-2 px-6 rounded-xl mt-4"
            onClick={() => createSheet(sheetData)}
          >
            Add In My Sheets
          </button>
        </div>
      ))}
    </CardComponent>
    </>
  );
};

export default FoundSheet;
