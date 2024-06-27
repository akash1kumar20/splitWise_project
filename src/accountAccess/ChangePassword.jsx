import React, { useContext, useRef, useState } from "react";
import AuthContext from "../../store/auth-context";
import { FiEye, FiEyeOff } from "react-icons/fi";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const autCtx = useContext(AuthContext);
  const forgetPassword = autCtx.forgetPassword;
  const [passowrd, setPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState(false);
  const mailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const token = autCtx.token;
  const navigate = useNavigate();

  async function submitFormHandler(event) {
    event.preventDefault();
    let userMail;
    let password;
    let confirmPassword;

    if (forgetPassword) {
      userMail = mailRef.current.value;
      try {
        let res = await axios.post(
          "https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyBOfzoct-rKO3JwaHNCGoh2qfHdGly_IdI",
          {
            requestType: "PASSWORD_RESET",
            email: userMail,
          }
        );
        if (res.status === 200) {
          toast.success("Mail sent to your Email", {
            theme: "colored",
            position: "top-right",
            autoClose: 2000,
          });
          setTimeout(() => {
            navigate("/");
          }, 2000);
        }
      } catch (error) {
        toast.error("Please Try again", {
          theme: "colored",
          position: "top-right",
          autoClose: 2000,
        });
      }
    } else {
      password = passwordRef.current.value;
      confirmPassword = confirmPasswordRef.current.value;
      if (passowrd !== confirmPassword) {
        toast.warning("Type Password correctly", {
          theme: "colored",
          position: "top-center",
          autoClose: 2000,
        });
      }
      try {
        let res = await axios.post(
          "https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyBOfzoct-rKO3JwaHNCGoh2qfHdGly_IdI",
          {
            idToken: token,
            password: password,
            returnSecureToken: true,
          }
        );
        autCtx.login(res.data.idToken);
        if (res.status === 200) {
          toast.success("Password Changed! Now login with new password", {
            theme: "colored",
            position: "top-right",
            autoClose: 2000,
          });
          setTimeout(() => {
            navigate("/");
          }, 2000);
        }
      } catch (error) {}
      toast.error("Please Try again", {
        theme: "colored",
        position: "top-right",
        autoClose: 2000,
      });
    }
  }

  return (
    <>
      <ToastContainer />
      <div className="mx-auto md:w-[60%] w-[90%] text-center border-2 border-black mt-4 md:py-16 py-6 bg-gradient-to-br from-slate-600 via-gray-700 to-black text-white shadow-2xl drop-shadow-2xl rounded-2xl">
        <h2 className="md:text-2xl font-semibold">
          {forgetPassword
            ? "Please Enter Your Email"
            : "Change Your Passowrd Here"}
        </h2>
        <form className="mt-6">
          {forgetPassword && (
            <div className="flex flex-col gap-3">
              <span className="text-sm text-red-400">
                You will recieve a mail, to reset the passowrd.
              </span>
              <input
                type="mail"
                required
                ref={mailRef}
                placeholder="Enter Your Mail"
                className="py-2 mx-auto rounded-lg md:w-[60%] w-[90%] ps-2 placeholder:text-black placeholder:text-lg focus:outline-none text-black"
              />
            </div>
          )}
          {!forgetPassword && (
            <div>
              <div className="flex justify-between items-center md:w-[60%] w-[90%] bg-white text-black mx-auto rounded-lg px-2">
                <input
                  type={passowrd ? "type" : "password"}
                  required
                  placeholder="Enter New Password"
                  className=" placeholder:text-black py-2 rounded-lg w-[95%] placeholder:text-lg focus:outline-none"
                />
                {!passowrd && <FiEye onClick={() => setPassword(true)} />}
                {passowrd && <FiEyeOff onClick={() => setPassword(false)} />}
              </div>
              <div className="flex justify-between items-center md:w-[60%] w-[90%] bg-white text-black mx-auto rounded-lg px-2 mt-4">
                <input
                  type={confirmPassword ? "text" : "password"}
                  required
                  placeholder="Confirm Password"
                  className=" placeholder:text-black py-2 rounded-lg  placeholder:text-lg focus:outline-none  w-[95%]"
                />
                {!confirmPassword && (
                  <FiEye onClick={() => setConfirmPassword(true)} />
                )}
                {confirmPassword && (
                  <FiEyeOff onClick={() => setConfirmPassword(false)} />
                )}
              </div>
            </div>
          )}
          <button
            className="mt-4 bg-blue-700 text-white rounded-2xl py-3 px-6"
            onClick={(event) => submitFormHandler(event)}
          >
            Submit
          </button>
          <button
            className="mt-4 ms-4 bg-red-700 text-white rounded-2xl py-3 px-6"
            onClick={() => navigate("/")}
          >
            Cancel
          </button>
        </form>
      </div>
    </>
  );
};

export default ChangePassword;
