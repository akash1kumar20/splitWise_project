import axios from "axios";
import { useContext, useRef, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthContext from "../../store/auth-context";
import { useDispatch, useSelector } from "react-redux";
import { expenseSheetActions } from "../../store/expenseSheetSlice";
import Footer from "../ExtraComponents/Footer";
import PasswordValidation from "./PasswordValidation";

const AddAccount = () => {
  const [isLogIn, setIsLogIn] = useState(true);
  const [viewPassword, setViewPassword] = useState(false);
  const [viewConfirmPassword, setViewConfirmPassword] = useState(false);
  const mailRef = useRef();
  const [password, setPassword] = useState(" ");
  const confirmPasswordRef = useRef();
  const navigate = useNavigate();
  const autCtx = useContext(AuthContext);
  const dispatch = useDispatch();
  const [checkPassword, setCheckPassword] = useState(false);
  const submitPassword = useSelector((state) => state.password.submitPassword);

  async function formSubmitHandler(event) {
    event.preventDefault();
    let userMail;
    let userPassword;
    let confirmPassword;
    let url;
    if (isLogIn) {
      userMail = mailRef.current.value;
      userPassword = password;
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBOfzoct-rKO3JwaHNCGoh2qfHdGly_IdI";
    } else {
      if (!submitPassword) {
        return toast.warning("Please match the password condition", {
          theme: "colored",
          autoClose: 1000,
          position: "top-center",
        });
      } else {
        userMail = mailRef.current.value;
        userPassword = password;
        confirmPassword = confirmPasswordRef.current.value;
        if (confirmPassword !== userPassword) {
          return toast.warning("Please type passwords carefully", {
            position: "top-center",
            theme: "colored",
            autoClose: 2000,
          });
        }
      }
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBOfzoct-rKO3JwaHNCGoh2qfHdGly_IdI";
    }
    let message;
    try {
      let res = await axios.post(url, {
        email: userMail,
        password: userPassword,
        returnSecureToken: true,
      });
      autCtx.login(res.data.idToken);
      dispatch(expenseSheetActions.setUserMail(userMail));
      dispatch(expenseSheetActions.setToken(res.data.idToken));
      dispatch(expenseSheetActions.setChangedMail(userMail));
      if (res.status === 200 && isLogIn) {
        message = "Welcome Back";
        setTimeout(() => {
          navigate("/home");
        }, 2000);
      }
      if (res.status === 200 && !isLogIn) {
        message = "Account Created Successully!";
        setTimeout(() => {
          location.reload();
        }, 2000);
      }
      toast.success(message, {
        theme: "colored",
        autoClose: 2000,
        position: "top-right",
      });
    } catch (err) {
      toast.error("Authentication Failed!", {
        theme: "colored",
        autoClose: 2000,
        position: "top-right",
      });
    }
  }

  const passwordTypeHandler = () => {
    autCtx.changePasswordHandler();
    navigate("/changePassword");
  };
  return (
    <>
      <ToastContainer />
      <div className="mx-auto md:w-[50%] border-2 shadow-2xl drop-shadow-2xl text-center py-16">
        <h1 className="text-3xl font-semibold">
          {isLogIn ? "Please Login to continue" : "Create Account"}
        </h1>
        <form>
          <div className="flex flex-col static w-[80%] mx-auto mt-6">
            <label className="text-black text-lg font-semibold relative top-2 ml-[7px] px-[3px] bg-[#e8e8e8] w-fit">
              Email
            </label>
            <input
              name="mail"
              type="mail"
              ref={mailRef}
              required
              placeholder="Write here..."
              className="w-auto rounded-xl focus:outline-none text-black ps-3 py-2 placeholder:text-black bg-slate-400"
            />
          </div>
          <div className="flex flex-col static w-[80%] mx-auto mt-6">
            <label className="text-black text-lg font-semibold relative top-2 ml-[7px] px-[3px] bg-[#e8e8e8] w-fit">
              Password
            </label>
            <div className="flex justify-between bg-slate-400 text-black items-center pe-3 rounded-xl">
              <input
                name="password"
                type={viewPassword ? "type" : "password"}
                required
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setCheckPassword(true)}
                placeholder="Write here..."
                className="  bg-slate-400 rounded-xl focus:outline-none text-black ps-3 py-2 placeholder:text-black w-[95%]"
              />
              {!viewPassword && (
                <FiEye
                  className="text-2xl"
                  onClick={() => setViewPassword(true)}
                />
              )}
              {viewPassword && (
                <FiEyeOff
                  className="text-2xl"
                  onClick={() => setViewPassword(false)}
                />
              )}
            </div>
            {!isLogIn && checkPassword && (
              <PasswordValidation password={password} />
            )}
            {isLogIn && (
              <span
                className=" text-sm my-2 cursor-pointer"
                onClick={() => passwordTypeHandler()}
              >
                Forget Password?
              </span>
            )}
          </div>
          {!isLogIn && (
            <div className="flex flex-col static w-[80%] mx-auto mt-6">
              <label className="text-black text-md font-semibold relative top-2 ml-[7px] px-[3px] bg-[#e8e8e8] w-fit">
                Confirm Password
              </label>
              <div className="flex justify-between bg-slate-400 text-black items-center pe-3 rounded-xl">
                <input
                  name="confirmPassword"
                  type={viewConfirmPassword ? "type" : "password"}
                  required
                  ref={confirmPasswordRef}
                  placeholder="Write here..."
                  className=" bg-slate-400 rounded-xl focus:outline-none text-black ps-3 py-2 placeholder:text-black w-[95%]"
                />
                {!viewConfirmPassword && (
                  <FiEye
                    className="text-2xl"
                    onClick={() => setViewConfirmPassword(true)}
                  />
                )}
                {viewConfirmPassword && (
                  <FiEyeOff
                    className="text-2xl"
                    onClick={() => setViewConfirmPassword(false)}
                  />
                )}
              </div>
            </div>
          )}

          <button
            className="bg-blue-400 px-6 py-2 rounded-lg my-2 text-slate-900 drop-shadow-2xl shadow-2xl hover:bg-blue-800 hover:text-white"
            onClick={(event) => formSubmitHandler(event)}
          >
            {isLogIn ? "Login" : "Sign-in"}
          </button>

          {isLogIn && (
            <p
              className="mt-2 text-sm font-bold cursor-pointer"
              onClick={() => setIsLogIn(false)}
            >
              Create New Account
            </p>
          )}
          {!isLogIn && (
            <p
              className="mt-2 text-sm font-bold cursor-pointer"
              onClick={() => setIsLogIn(true)}
            >
              Already have a account?
            </p>
          )}
        </form>
      </div>
      <Footer />
    </>
  );
};

export default AddAccount;
