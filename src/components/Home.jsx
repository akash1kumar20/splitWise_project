import { Outlet, useNavigate } from "react-router-dom";
import SheetPresents from "./SheetPresents";
import { useContext, useEffect } from "react";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthContext from "../../store/auth-context";

const Home = () => {
  const autCtx = useContext(AuthContext);
  const navigate = useNavigate();
  const token = useSelector((state) => state.expenseSheet.token);
  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, []);

  function logoutHandler() {
    autCtx.logout();
    toast.error("Logout Succesfully!", {
      theme: "colored",
      position: "top-right",
      autoClose: 1000,
    });
    setTimeout(() => {
      navigate("/");
    }, 1000);
  }
  return (
    <>
      <ToastContainer />
      <div className="bg-slate-700 h-12 flex justify-end items-center pe-4">
        <button
          className="bg-gradient-to-br from-red-800 via-red-500 to-red-800 text-white py-2 px-6 rounded-xl my-1 font-semibold"
          onClick={logoutHandler}
        >
          Logout
        </button>
      </div>
      <SheetPresents />
      <Outlet />
    </>
  );
};

export default Home;
