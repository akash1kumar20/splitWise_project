import axios from "axios";
import { FaSearch, FaTrash } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import Footer from "../ExtraComponents/Footer";
import { useDispatch, useSelector } from "react-redux";
import { expenseSheetActions } from "../../store/expenseSheetSlice";
import useFetchDataHook from "../customHooks/useFetchDataHook";
import Loading from "../ExtraComponents/Loading";
import { useState, useEffect } from "react";

const DB = "https://splitwiseapp-82dbf-default-rtdb.firebaseio.com";

const SheetPresents = () => {
  const changeEmail = useSelector((state) => state.expenseSheet.convertedMail);
  const theme = useSelector((state) => state.theme.theme);
  const dispatch = useDispatch();
  const userMail = useSelector((state) => state.expenseSheet.userMail);
  const [comingData, isLoading, , refetch] = useFetchDataHook(
    `${DB}/${changeEmail}/sheets.json`,
  );

  // ✅ Listen for sheetCreated event fired by both CreateSheet and FoundSheet
  useEffect(() => {
    const handleSheetCreated = () => refetch();
    window.addEventListener("sheetCreated", handleSheetCreated);
    return () => window.removeEventListener("sheetCreated", handleSheetCreated);
  }, [refetch]);

  const [deletedIds, setDeletedIds] = useState([]);
  const [pendingDelete, setPendingDelete] = useState(null);
  const navigate = useNavigate();

  const openSpecificSheetHandler = (sheet) => {
    dispatch(
      expenseSheetActions.setCodes({
        sheetCode: sheet.code,
        inviteCode: sheet.inviationCode,
      }),
    );
    dispatch(expenseSheetActions.setSheetAdmin(sheet.userMail));
    navigate(`/home/sheets/${sheet.code}`);
  };

  const deleteSheetHandler = async () => {
    const sheet = pendingDelete;
    setPendingDelete(null);
    try {
      // Always remove from current user's own list
      await axios.delete(`${DB}/${changeEmail}/sheets/${sheet.id}.json`);

      if (sheet.userMail === userMail) {
        // ✅ Admin deleting: remove sheet from ALL members' lists before wiping shared data
        try {
          const membersRes = await axios.get(
            `${DB}/${sheet.inviationCode}/members.json`,
          );
          if (membersRes.data) {
            for (let key in membersRes.data) {
              const memberEmail = membersRes.data[key].convertedMail;
              if (memberEmail === changeEmail) continue; // already deleted above
              try {
                const sheetsRes = await axios.get(
                  `${DB}/${memberEmail}/sheets.json`,
                );
                for (let sheetKey in sheetsRes.data) {
                  if (
                    sheetsRes.data[sheetKey].inviationCode ===
                    sheet.inviationCode
                  ) {
                    await axios.delete(
                      `${DB}/${memberEmail}/sheets/${sheetKey}.json`,
                    );
                  }
                }
              } catch (err) {
                console.log(err);
              }
            }
          }
        } catch (err) {
          console.log(err);
        }

        // Wipe all shared sheet data
        await axios.delete(`${DB}/${sheet.inviationCode}.json`);
      }

      setDeletedIds((prev) => [...prev, sheet.id]);
    } catch (error) {
      alert("Could not delete sheet. Please try again.");
    }
  };

  const visibleSheets = comingData.filter((s) => !deletedIds.includes(s.id));

  return (
    <>
      {pendingDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white text-black rounded-2xl p-6 mx-4 max-w-sm w-full text-center shadow-2xl">
            <p className="text-2xl mb-2">🗑️</p>
            <h2 className="text-xl font-bold mb-2">Delete Sheet?</h2>
            <p className="text-sm text-gray-600 mb-1">
              <strong>{pendingDelete.sheetName}</strong>
            </p>
            <p className="text-sm text-gray-600 mb-4">
              {pendingDelete.userMail === userMail
                ? "You are the admin. This will permanently delete the sheet and all its data for every member."
                : "This will remove the sheet from your list only. The sheet will remain for the admin and other members."}
            </p>
            <div className="flex gap-3 justify-center">
              <button
                className="bg-red-600 text-white px-6 py-2 rounded-xl font-semibold"
                onClick={deleteSheetHandler}
              >
                Delete
              </button>
              <button
                className="bg-gray-300 text-black px-6 py-2 rounded-xl font-semibold"
                onClick={() => setPendingDelete(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        className={
          theme
            ? "text-gray-900 bg-white h-[100vh] w-[100vw]"
            : "bg-gray-900 text-white h-[100vh] w-[100vw]"
        }
      >
        <h1 className="md:text-3xl text-xl pt-10 text-center font-serif underline">
          Know where every rupee goes.
        </h1>
        {isLoading && <Loading />}
        {!isLoading && (
          <div className="grid grid-cols-2 md:grid-cols-4 py-8 md:mx-32 gap-y-6">
            {visibleSheets.map((sheet) => (
              <div
                className="flex flex-col items-center gap-3 static"
                key={sheet.id}
              >
                <FaTrash
                  className="relative top-[20px] left-6 text-red-500 hover:text-red-700 cursor-pointer hover:scale-150"
                  onClick={() => setPendingDelete(sheet)}
                />
                <p
                  className="text-xl p-6 rounded-full bg-gray-600 border-2 border-gray-500 shadow-xl cursor-pointer text-white"
                  onClick={() => openSpecificSheetHandler(sheet)}
                >
                  {sheet.sheetName.substring(0, 4)}…
                </p>
                <span className="text-sm">{sheet.sheetName}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${sheet.userMail === userMail ? "bg-blue-600 text-white" : "bg-gray-500 text-white"}`}>
                  {sheet.userMail === userMail ? "Admin" : "Member"}
                </span>
              </div>
            ))}
            <div className="flex flex-col items-center gap-3 mt-9">
              <p
                className="text-2xl p-6 rounded-full bg-gray-600 border-2 border-gray-500 shadow-xl cursor-pointer text-white"
                onClick={() => navigate("/home/sheets/addSheet")}
              >
                <IoMdAdd />
              </p>
              <span className="text-sm">Add Sheet</span>
            </div>
            <div className="flex flex-col items-center gap-3 mt-9">
              <p
                className="text-xl p-6 rounded-full bg-gray-600 border-2 border-gray-500 shadow-xl cursor-pointer text-white"
                onClick={() => navigate("/home/sheets/findSheet")}
              >
                <FaSearch />
              </p>
              <span className="text-sm">Find Sheet</span>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default SheetPresents;
