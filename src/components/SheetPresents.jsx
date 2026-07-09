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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DB = "https://splitwiseapp-82dbf-default-rtdb.firebaseio.com";

const SheetPresents = () => {
  const changeEmail = useSelector((s) => s.expenseSheet.convertedMail);
  const theme = useSelector((s) => s.theme.theme);
  const dispatch = useDispatch();
  const userMail = useSelector((s) => s.expenseSheet.userMail);
  const navigate = useNavigate();

  const [comingData, isLoading, , refetch] = useFetchDataHook(
    `${DB}/${changeEmail}/sheets.json`,
  );

  useEffect(() => {
    const h = () => refetch();
    window.addEventListener("sheetCreated", h);
    return () => window.removeEventListener("sheetCreated", h);
  }, [refetch]);

  const [deletedIds, setDeletedIds] = useState([]);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [blockedDelete, setBlockedDelete] = useState(null);
  const [checking, setChecking] = useState(false);

  const openSheet = (sheet) => {
    dispatch(
      expenseSheetActions.setCodes({
        sheetCode: sheet.code,
        inviteCode: sheet.inviationCode,
      }),
    );
    dispatch(expenseSheetActions.setSheetAdmin(sheet.userMail));
    localStorage.setItem("sp_sheetType", sheet.sheetType || "split");
    localStorage.setItem("sp_sheetAdmin", sheet.userMail);
    localStorage.setItem("sp_sheetName", sheet.sheetName);
    navigate(`/home/sheets/${sheet.code}`);
  };

  const checkCanDelete = async (sheet) => {
    try {
      const expRes = await axios.get(
        `${DB}/${sheet.inviationCode}/expenseSheet.json`,
      );
      if (expRes.data && Object.keys(expRes.data).length > 0)
        return {
          canDelete: false,
          reason:
            "This sheet still has unsettled expenses. Please generate and settle the bill before deleting.",
        };
      if (sheet.sheetType !== "personal") {
        const paidRes = await axios.get(
          `${DB}/${sheet.inviationCode}/settlementPaid.json`,
        );
        if (paidRes.data && typeof paidRes.data === "object") {
          if (!Object.values(paidRes.data).every((v) => v === true))
            return {
              canDelete: false,
              reason:
                "Some settlements are still pending. Please mark all as Paid before deleting.",
            };
        }
      }
      return { canDelete: true };
    } catch {
      return { canDelete: true };
    }
  };

  const handleTrashClick = async (sheet) => {
    setChecking(true);
    const { canDelete, reason } = await checkCanDelete(sheet);
    setChecking(false);
    if (!canDelete) {
      setBlockedDelete({ sheetName: sheet.sheetName, reason });
      return;
    }
    setPendingDelete(sheet);
  };

  const deleteSheetHandler = async () => {
    const sheet = pendingDelete;
    setPendingDelete(null);
    try {
      await axios.delete(`${DB}/${changeEmail}/sheets/${sheet.id}.json`);
      if (sheet.userMail === userMail) {
        try {
          const membersRes = await axios.get(
            `${DB}/${sheet.inviationCode}/members.json`,
          );
          if (membersRes.data) {
            // ✅ FIX: Fetch all member sheet lists in parallel, then delete in parallel.
            // Old pattern: sequential for...in with await = O(n) serial API calls.
            // New pattern: Promise.all = all deletes fire simultaneously.
            const otherMembers = Object.values(membersRes.data)
              .map((m) => m.convertedMail)
              .filter((mem) => mem !== changeEmail);

            await Promise.all(
              otherMembers.map(async (mem) => {
                try {
                  const sr = await axios.get(`${DB}/${mem}/sheets.json`);
                  const matchingKeys = Object.entries(sr.data || {})
                    .filter(([, s]) => s.inviationCode === sheet.inviationCode)
                    .map(([sk]) => sk);
                  await Promise.all(
                    matchingKeys.map((sk) =>
                      axios.delete(`${DB}/${mem}/sheets/${sk}.json`),
                    ),
                  );
                } catch (_) {}
              }),
            );
          }
        } catch (_) {}
        await axios.delete(`${DB}/${sheet.inviationCode}.json`);
      }
      setDeletedIds((p) => [...p, sheet.id]);
    } catch {
      toast.error("Could not delete sheet. Please try again.", {
        theme: "colored",
        autoClose: 2000,
        position: "top-center",
      });
    }
  };

  const visibleSheets = comingData.filter((s) => !deletedIds.includes(s.id));

  return (
    <>
      <ToastContainer autoClose={1000} />
      {blockedDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white text-black rounded-2xl p-6 mx-4 max-w-sm w-full text-center shadow-2xl">
            <h2 className="text-xl font-bold mb-2">Cannot Delete Sheet</h2>
            <p className="text-sm font-semibold text-gray-700 mb-1">
              {blockedDelete.sheetName}
            </p>
            <p className="text-sm text-gray-600 mb-5">{blockedDelete.reason}</p>
            <button
              className="bg-gray-800 text-white px-8 py-2 rounded-xl font-semibold"
              onClick={() => setBlockedDelete(null)}
            >
              OK
            </button>
          </div>
        </div>
      )}
      {pendingDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white text-black rounded-2xl p-6 mx-4 max-w-sm w-full text-center shadow-2xl">
            <h2 className="text-xl font-bold mb-2">Delete Sheet?</h2>
            <p className="text-sm text-gray-600 mb-1">
              <strong>{pendingDelete.sheetName}</strong>
            </p>
            <p className="text-sm text-gray-600 mb-4">
              {pendingDelete.userMail === userMail
                ? "You are the admin. This will permanently delete the sheet and all data for every member."
                : "This will remove the sheet from your list only."}
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
      {checking && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl px-8 py-5 shadow-xl text-gray-700 font-semibold text-sm">
            Checking settlement status...
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
                className="flex flex-col items-center gap-2 static"
                key={sheet.id}
              >
                <FaTrash
                  className="relative top-[20px] left-6 text-red-500 hover:text-red-700 cursor-pointer hover:scale-150"
                  onClick={() => handleTrashClick(sheet)}
                />
                <p
                  className="text-xl p-6 rounded-full bg-gray-600 border-2 border-gray-500 shadow-xl cursor-pointer text-white"
                  onClick={() => openSheet(sheet)}
                >
                  {sheet.sheetName.substring(0, 4).toUpperCase()}...
                </p>
                <span className="text-sm font-semibold shadow-lg">
                  {sheet.sheetName.toUpperCase()}
                </span>
                {sheet.sheetType === "personal" ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-600 text-white">
                    Personal
                  </span>
                ) : (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${sheet.userMail === userMail ? "bg-blue-600 text-white" : "bg-gray-500 text-white"}`}
                  >
                    {sheet.userMail === userMail ? "Admin" : "Member"}
                  </span>
                )}
              </div>
            ))}
            <div className="flex flex-col items-center gap-3 mt-9">
              <p
                className="text-2xl p-6 rounded-full bg-gray-600 border-2 border-gray-500 shadow-xl cursor-pointer text-white"
                onClick={() => navigate("/home/sheets/addSheet")}
              >
                <IoMdAdd />
              </p>
              <span className="text-sm font-semibold shadow-lg">Add Sheet</span>
            </div>
            <div className="flex flex-col items-center gap-3 mt-9">
              <p
                className="text-xl p-6 rounded-full bg-gray-600 border-2 border-gray-500 shadow-xl cursor-pointer text-white"
                onClick={() => navigate("/home/sheets/findSheet")}
              >
                <FaSearch />
              </p>
              <span className="text-sm font-semibold shadow-lg">
                Find Sheet
              </span>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};
export default SheetPresents;
