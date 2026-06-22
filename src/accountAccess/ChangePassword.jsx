import { useContext, useRef, useState } from "react";
import AuthContext from "../../store/auth-context";
import { FiEye, FiEyeOff } from "react-icons/fi";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import PasswordValidation from "./PasswordValidation";
import { useSelector } from "react-redux";
import { RESET_PASSWORD_URL, UPDATE_PASSWORD_URL } from "../config/firebase";

const ChangePassword = () => {
  const navigate = useNavigate();
  const autCtx = useContext(AuthContext);
  let forgetPassword = autCtx.forgetPassword;

  // ✅ FIX: Renamed for clarity — these are visibility toggles, not passwords
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ✅ FIX: Initialize as empty string, not false (was being compared to a string later)
  const [enteredPassword, setEnteredPassword] = useState("");
  const mailRef = useRef();
  const confirmPasswordRef = useRef();
  const submitPassword = useSelector((state) => state.password.submitPassword);
  const token = autCtx.token;

  if (!token) {
    forgetPassword = true;
  }

  async function submitFormHandler(event) {
    event.preventDefault();

    if (forgetPassword) {
      const userMail = mailRef.current.value;
      try {
        const res = await axios.post(RESET_PASSWORD_URL, {
          requestType: "PASSWORD_RESET",
          email: userMail,
        });
        if (res.status === 200) {
          toast.success("Reset email sent! Check your inbox and spam folder.", {
            theme: "colored",
            position: "top-right",
            autoClose: 3000,
          });
          setTimeout(() => navigate("/"), 3000);
        }
      } catch (err) {
        toast.error("Please try again", {
          theme: "colored",
          position: "top-right",
          autoClose: 2000,
        });
      }
      return;
    }

    // Changing password while logged in
    if (!submitPassword) {
      return toast.warning("Please match the password condition", {
        theme: "colored",
        autoClose: 1000,
        position: "top-center",
      });
    }

    const confirmPassword = confirmPasswordRef.current.value;

    // ✅ FIX: Compare enteredPassword (string) to confirmPassword (string)
    // Original bug: compared `passowrd` (boolean toggle) to `confirmPassword` (string)
    if (enteredPassword !== confirmPassword) {
      return toast.warning("Passwords do not match", {
        theme: "colored",
        position: "top-center",
        autoClose: 2000,
      });
    }

    try {
      const res = await axios.post(UPDATE_PASSWORD_URL, {
        idToken: token,
        password: enteredPassword,
        returnSecureToken: true,
      });
      autCtx.login(res.data.idToken);
      if (res.status === 200) {
        toast.success("Password changed! Please log in again.", {
          theme: "colored",
          position: "top-right",
          autoClose: 2000,
        });
        setTimeout(() => navigate("/"), 2000);
      }
    } catch (err) {
      toast.error("Please try again", {
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
          {forgetPassword ? "Please Enter Your Email" : "Change Your Password"}
        </h2>
        <form className="mt-6" onSubmit={submitFormHandler}>
          {forgetPassword ? (
            <div className="flex flex-col gap-3">
              <span className="text-sm text-red-400">
                You will receive a reset email.
              </span>
              <span className="text-sm text-yellow-300">
                📬 If you don't see it, please check your{" "}
                <strong>spam / junk folder</strong>.
              </span>
              <input
                name="mail"
                type="email"
                required
                ref={mailRef}
                placeholder="Enter Your Email"
                className="py-2 mx-auto rounded-lg md:w-[60%] w-[90%] ps-2 placeholder:text-black placeholder:text-lg focus:outline-none text-black"
              />
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center md:w-[60%] w-[90%] bg-white text-black mx-auto rounded-lg px-2">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter New Password"
                  className="placeholder:text-black py-2 rounded-lg w-[95%] placeholder:text-lg focus:outline-none"
                  onChange={(e) => setEnteredPassword(e.target.value)}
                />
                {showPassword ? (
                  <FiEyeOff
                    className="cursor-pointer"
                    onClick={() => setShowPassword(false)}
                  />
                ) : (
                  <FiEye
                    className="cursor-pointer"
                    onClick={() => setShowPassword(true)}
                  />
                )}
              </div>
              <PasswordValidation password={enteredPassword} />
              <div className="flex justify-between items-center md:w-[60%] w-[90%] bg-white text-black mx-auto rounded-lg px-2 mt-4">
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  ref={confirmPasswordRef}
                  placeholder="Confirm Password"
                  className="placeholder:text-black py-2 rounded-lg placeholder:text-lg focus:outline-none w-[95%]"
                />
                {showConfirmPassword ? (
                  <FiEyeOff
                    className="cursor-pointer"
                    onClick={() => setShowConfirmPassword(false)}
                  />
                ) : (
                  <FiEye
                    className="cursor-pointer"
                    onClick={() => setShowConfirmPassword(true)}
                  />
                )}
              </div>
            </div>
          )}
          <button
            type="submit"
            className="mt-4 bg-blue-700 text-white rounded-2xl py-3 px-6"
          >
            Submit
          </button>
          <button
            type="button"
            className="mt-4 ms-4 bg-red-700 text-white rounded-2xl py-3 px-6"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
        </form>
      </div>
    </>
  );
};

export default ChangePassword;
