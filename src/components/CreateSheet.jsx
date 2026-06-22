import { useRef, useState } from "react";
import CardComponent from "../Card/CardComponent";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DB = "https://splitwiseapp-82dbf-default-rtdb.firebaseio.com";

const CreateSheet = () => {
  const sheetNameRef = useRef();
  const changeEmail = useSelector((s) => s.expenseSheet.convertedMail);
  const userMail = useSelector((s) => s.expenseSheet.userMail);
  const navigate = useNavigate();

  const [sheetType, setSheetType] = useState("split");
  const [isLoading, setIsLoading] = useState(false);

  const formSubmitHandler = async (event) => {
    event.preventDefault();
    const name = sheetNameRef.current.value.trim();
    if (!name) return toast.error("Please enter a sheet name");

    setIsLoading(true);
    const sheetCode = Math.random().toString(36).substring(2, 7).toUpperCase();
    const invitationCode = changeEmail + sheetCode;
    const sheetDetails = {
      code: sheetCode,
      sheetName: name,
      userMail,
      inviationCode: invitationCode,
      sheetType,
    };

    try {
      await axios.post(
        `${DB}/${invitationCode}/sheetDetails.json`,
        sheetDetails,
      );
      await axios.post(`${DB}/${changeEmail}/sheets.json`, sheetDetails);
      await axios.post(`${DB}/${invitationCode}/members.json`, {
        convertedMail: changeEmail,
      });

      if (sheetType === "personal") {
        await axios.post(`${DB}/${invitationCode}/usersList.json`, {
          userName: "Self",
        });
      }

      window.dispatchEvent(new Event("sheetCreated"));
      toast.success("Sheet Created!", {
        position: "top-right",
        autoClose: 1000,
      });
      setTimeout(() => navigate("/home/sheets"), 1000);
    } catch {
      toast.error("Something went wrong.");
      setIsLoading(false);
    }
  };

  return (
    <CardComponent>
      <ToastContainer />
      <div className="max-w-sm mx-auto p-4 sm:p-6 w-full">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">
          Create New Sheet
        </h2>

        {/* Toggle Switch */}
        <div className="flex bg-gray-800 rounded-2xl p-1 border border-gray-700 mb-4">
          <button
            type="button"
            onClick={() => setSheetType("split")}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 ${sheetType === "split" ? "bg-blue-600 text-white shadow-lg" : "text-gray-400 hover:text-white"}`}
          >
            Split Sheet
          </button>
          <button
            type="button"
            onClick={() => setSheetType("personal")}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 ${sheetType === "personal" ? "bg-purple-600 text-white shadow-lg" : "text-gray-400 hover:text-white"}`}
          >
            Personal Sheet
          </button>
        </div>

        <p className="text-xs text-gray-400 text-center mb-6 h-4">
          {sheetType === "split"
            ? "Share expenses with others and settle debts."
            : "Track your own daily expenses privately."}
        </p>

        <form onSubmit={formSubmitHandler} className="flex flex-col gap-4">
          <input
            type="text"
            ref={sheetNameRef}
            required
            placeholder="Enter sheet name..."
            className="bg-gray-800 border border-gray-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 w-full transition-colors placeholder:text-gray-500"
          />

          <button
            type="submit"
            disabled={isLoading}
            className={`text-white font-bold py-3 rounded-xl w-full transition-transform active:scale-95 ${isLoading ? "bg-gray-600 cursor-not-allowed" : sheetType === "split" ? "bg-blue-600 hover:bg-blue-700" : "bg-purple-600 hover:bg-purple-700"}`}
          >
            {isLoading
              ? "Creating..."
              : `Create ${sheetType === "split" ? "Split" : "Personal"} Sheet`}
          </button>
        </form>
      </div>
    </CardComponent>
  );
};
export default CreateSheet;
