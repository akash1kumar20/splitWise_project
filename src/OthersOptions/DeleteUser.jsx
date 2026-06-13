import { useSelector } from "react-redux";
import useFetchDataHook from "../customHooks/useFetchDataHook";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TbTrashXFilled } from "react-icons/tb";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "../ExtraComponents/Loading";
import useAdminStatus from "../customHooks/useAdminStatus";

const DeleteUser = () => {
  const token = useSelector((s) => s.expenseSheet.token);
  const navigate = useNavigate();
  const { isAdmin } = useAdminStatus();

  useEffect(() => {
    if (!token) navigate("/");
  }, []);

  const code = useSelector((s) => s.expenseSheet.inviteCode);
  const urlKey = `https://splitwiseapp-82dbf-default-rtdb.firebaseio.com/${code}/usersList`;
  const [comingData, isLoading, , refetch] = useFetchDataHook(`${urlKey}.json`);
  const [pendingDelete, setPendingDelete] = useState(null);

  const confirmDelete = async () => {
    const id = pendingDelete;
    setPendingDelete(null);
    try {
      const res = await axios.delete(`${urlKey}/${id}.json`);
      if (res.status === 200) {
        toast.info("User Deleted!", {
          theme: "dark",
          position: "top-right",
          autoClose: 1000,
        });
        refetch();
      }
    } catch {
      toast.error("Please Try Again", {
        theme: "colored",
        position: "top-right",
        autoClose: 1000,
      });
    }
  };

  return (
    <div className="min-h-screen bg-[rgba(154,140,152,0.8)]">
      <ToastContainer />

      {/* Confirmation modal */}
      {pendingDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-4">
          <div className="bg-white text-black rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl">
            <p className="text-3xl mb-2">⚠️</p>
            <h2 className="text-xl font-bold mb-2">Delete User?</h2>
            <p className="text-sm text-gray-600 mb-4">
              Their past expenses will still be recorded.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                className="bg-red-600 text-white px-6 py-2 rounded-xl font-semibold"
                onClick={confirmDelete}
              >
                Delete
              </button>
              <button
                className="bg-gray-200 text-gray-800 px-6 py-2 rounded-xl font-semibold"
                onClick={() => setPendingDelete(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-4 border-b bg-white shadow-sm">
        <button
          className="text-sm bg-gray-800 text-white px-4 py-2 rounded-xl hover:bg-gray-700 whitespace-nowrap"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
        <h1 className="text-lg font-bold text-gray-800">Delete User</h1>
        <div className="w-20" />
      </div>

      <div className="max-w-md mx-auto px-4 pt-6">
        {isLoading && <Loading />}

        {!isLoading && !isAdmin && (
          <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 text-sm px-4 py-4 rounded-2xl text-center">
            🔒 Only the <strong>sheet admin</strong> can delete users.
          </div>
        )}

        {!isLoading && isAdmin && comingData.length === 0 && (
          <p className="text-center text-gray-500 mt-8">No users to delete.</p>
        )}

        {!isLoading && isAdmin && comingData.length > 0 && (
          <div className="bg-white rounded-2xl shadow border border-gray-100 overflow-hidden">
            {comingData.map((data, i) => (
              <div
                key={data.id}
                className={`flex items-center justify-between px-5 py-4 ${i !== 0 ? "border-t border-gray-100" : ""}`}
              >
                <span className="font-semibold text-gray-800">
                  {data.userName}
                </span>
                <button
                  className="text-red-500 hover:text-red-700 hover:scale-110 transition-transform"
                  onClick={() => setPendingDelete(data.id)}
                >
                  <TbTrashXFilled className="text-2xl" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeleteUser;
