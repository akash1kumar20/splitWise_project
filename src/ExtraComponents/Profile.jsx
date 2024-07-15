import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../store/auth-context";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { themeSliceActions } from "../../store/themeSlice";

const Profile = () => {
  const userMail = useSelector((state) => state.expenseSheet.userMail);
  const [themeHanlder, setThemeHandler] = useState(false);
  const navigate = useNavigate();
  const autCtx = useContext(AuthContext);
  const dispatch = useDispatch();
  const logoutHandler = () => {
    autCtx.logout();
    toast.error("Logout Successfully!", {
      position: "top-right",
      theme: "dark",
      autoClose: 1000,
    });
    setTimeout(() => {
      navigate("/");
    }, 800);
  };

  return (
    <>
      <ToastContainer />
      <div className=" bg-slate-900 w-fit  flex flex-col right-2 fixed text-white  px-5 mt-1 rounded-lg py-10 border-2 border-slate-400 z-50">
        <span className="text-center font-bold underline text-sm">
          {userMail}
        </span>
        <button
          className="bg-slate-500 py-2 px-4 rounded-xl mb-2 mt-5 text-white hover:bg-slate-300 hover:text-black"
          onClick={() => navigate("/changePassword")}
        >
          Change Password
        </button>
        <button
          className="bg-yellow-500 py-2 px-4 rounded-xl my-2 text-white hover:bg-yellow-300 hover:text-black"
          onClick={() => navigate("/")}
        >
          Change Account
        </button>
        <button
          className="bg-purple-500 py-2 px-4 rounded-xl my-2 text-white hover:bg-purple-300 hover:text-black"
          onClick={() => setThemeHandler((themeHanlder) => !themeHanlder)}
        >
          Choose Theme
        </button>
        {themeHanlder && (
          <p className="flex gap-1 justify-between">
            <button
              className="bg-gray-500  py-2 px-4 rounded-xl my-2 text-white hover:bg-gray-300 hover:text-black"
              onClick={() => dispatch(themeSliceActions.setTheme(false))}
            >
              Dark
            </button>
            <button
              className="bg-white py-2 px-4 rounded-xl my-2 text-black font-semibold hover:text-black hover:font-normal"
              onClick={() => dispatch(themeSliceActions.setTheme(true))}
            >
              Light
            </button>
          </p>
        )}
        <button
          className="bg-red-500 py-2 px-4 rounded-xl my-2 text-white hover:bg-red-300 hover:text-black"
          onClick={logoutHandler}
        >
          Logout
        </button>
      </div>
    </>
  );
};

export default Profile;
