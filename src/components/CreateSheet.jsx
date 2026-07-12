import { useRef, useState } from "react";
import CardComponent from "../Card/CardComponent";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DB = "https://splitwiseapp-82dbf-default-rtdb.firebaseio.com";

const sheetModes = {
  split: {
    label: "Split Sheet",
    action: "Create Split Sheet",
    accent: "bg-blue-600 hover:bg-blue-700",
    dot: "bg-blue-500",
  },
  personal: {
    label: "Personal Sheet",
    action: "Create Personal Sheet",
    accent: "bg-purple-600 hover:bg-purple-700",
    dot: "bg-purple-500",
  },
};

const CreateSheet = () => {
  const sheetNameRef = useRef();
  const changeEmail = useSelector((s) => s.expenseSheet.convertedMail);
  const userMail = useSelector((s) => s.expenseSheet.userMail);
  const navigate = useNavigate();

  const [sheetType, setSheetType] = useState("split");
  const [isLoading, setIsLoading] = useState(false);

  const formSubmitHandler = async (event) => {
    event.preventDefault();

    const name = sheetNameRef.current?.value.trim();
    if (!name) {
      toast.error("Please enter a sheet name", {
        theme: "colored",
        autoClose: 1000,
        position: "top-center",
      });
      return;
    }

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

      // ✅ onClose fires when the toast fully finishes (including animation)
      // Navigation happens at that exact moment — global store is clean,
      // SheetPresents won't pick up any orphaned toast.
      toast.success("Sheet created!", {
        theme: "colored",
        autoClose: 1500,
        position: "top-center",
        onClose: () => navigate("/home/sheets"),
      });
    } catch (error) {
      toast.error("Something went wrong. Please try again.", {
        theme: "colored",
        autoClose: 1000,
        position: "top-center",
      });
      setIsLoading(false);
    }
  };

  return (
    <CardComponent>
      <ToastContainer />
      <div className="w-full max-w-md mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="rounded-[24px] border border-white/20 bg-zinc-950/95 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
          <div className="px-5 sm:px-7 pt-6 sm:pt-7 pb-7 sm:pb-8">
            <h2 className="text-center text-xl sm:text-2xl font-semibold text-white">
              Create New Sheet
            </h2>

            <p className="mt-2 text-center text-sm text-slate-400">
              Choose the sheet type, name it, and continue.
            </p>

            <div className="mt-6 flex rounded-2xl bg-slate-800/80 p-1 border border-white/10">
              {Object.entries(sheetModes).map(([key, mode]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSheetType(key)}
                  className={`flex-1 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200 ${
                    sheetType === key
                      ? `${mode.accent} text-white shadow-lg shadow-black/20`
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>

            <div className="mt-4 min-h-[20px] text-center text-xs sm:text-sm text-slate-400 leading-relaxed">
              {sheetType === "split"
                ? "Share expenses with others and settle debts together."
                : "Track your own expenses privately without sharing."}
            </div>

            <form
              onSubmit={formSubmitHandler}
              className="mt-6 flex flex-col gap-4"
            >
              <div>
                <label
                  htmlFor="sheetName"
                  className="mb-2 block text-sm font-medium text-slate-300 text-left"
                >
                  Sheet name
                </label>
                <input
                  id="sheetName"
                  type="text"
                  ref={sheetNameRef}
                  required
                  autoComplete="off"
                  placeholder="Enter sheet name..."
                  className="w-full rounded-xl border border-slate-600 bg-slate-800/90 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition-colors focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full rounded-xl px-4 py-3.5 text-sm font-bold text-white transition-all duration-200 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 ${
                  isLoading ? "bg-slate-600" : sheetModes[sheetType].accent
                }`}
              >
                {isLoading ? "Creating..." : sheetModes[sheetType].action}
              </button>
            </form>
          </div>
        </div>
      </div>
    </CardComponent>
  );
};

export default CreateSheet;
