import { useContext, useRef, useState } from "react";
import AuthContext from "../../store/auth-context";
import { FiEye, FiEyeOff } from "react-icons/fi";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import PasswordValidation from "./PasswordValidation";
import { useSelector } from "react-redux";
import {
  RESET_PASSWORD_URL,
  SIGNIN_URL,
  UPDATE_PASSWORD_URL,
} from "../config/firebase";

const ChangePassword = () => {
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);
  const submitPassword = useSelector((state) => state.password.submitPassword);
  const userMail =
    useSelector((state) => state.expenseSheet.userMail) ||
    localStorage.getItem("sp_userMail");

  const mailRef = useRef();
  const currentPasswordRef = useRef();
  const confirmPasswordRef = useRef();

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [enteredPassword, setEnteredPassword] = useState("");
  const [checkPassword, setCheckPassword] = useState(false);

  let forgetPassword = authCtx.forgetPassword;
  const token = authCtx.token;

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
          toast.success("Reset email sent. Check your inbox and spam folder.", {
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

    if (!submitPassword) {
      return toast.warning("Please match the password condition", {
        theme: "colored",
        autoClose: 1000,
        position: "top-center",
      });
    }

    const confirmPassword = confirmPasswordRef.current.value;
    const currentPassword = currentPasswordRef.current.value;

    if (enteredPassword !== confirmPassword) {
      return toast.warning("Passwords do not match", {
        theme: "colored",
        position: "top-center",
        autoClose: 2000,
      });
    }

    if (!userMail) {
      return toast.error("Please log in again before changing password", {
        theme: "colored",
        position: "top-right",
        autoClose: 2000,
      });
    }

    try {
      const verifiedUser = await axios.post(SIGNIN_URL, {
        email: userMail,
        password: currentPassword,
        returnSecureToken: true,
      });

      const res = await axios.post(UPDATE_PASSWORD_URL, {
        idToken: verifiedUser.data.idToken,
        password: enteredPassword,
        returnSecureToken: true,
      });

      authCtx.login(res.data.idToken);

      if (res.status === 200) {
        toast.success("Password changed. Please log in again.", {
          theme: "colored",
          position: "top-right",
          autoClose: 2000,
        });
        setTimeout(() => navigate("/"), 2000);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error?.message;
      const isWrongCurrentPassword =
        errorMessage === "INVALID_PASSWORD" ||
        errorMessage === "INVALID_LOGIN_CREDENTIALS" ||
        errorMessage === "INVALID_CREDENTIAL";

      toast.error(
        isWrongCurrentPassword
          ? "Current password is incorrect"
          : "Please try again",
        {
          theme: "colored",
          position: "top-right",
          autoClose: 2000,
        },
      );
    }
  }

  const inputShell =
    "flex items-center gap-2 rounded-xl bg-white px-3 ring-1 ring-black/5 shadow-sm transition focus-within:ring-2 focus-within:ring-blue-500";
  const inputField =
    "w-full bg-transparent py-3 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none sm:text-base";

  return (
    <>
      <ToastContainer autoClose={2000} />
      <main className="min-h-screen px-4 py-6 sm:py-10">
        <section className="mx-auto w-full max-w-xl rounded-3xl border border-white/10 bg-gradient-to-br from-slate-600 via-slate-700 to-slate-950 p-5 text-white shadow-[0_25px_80px_rgba(0,0,0,0.28)] sm:p-8 md:p-10">
          <div className="text-center">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {forgetPassword ? "Reset Your Password" : "Change Your Password"}
            </h2>
            <p className="mt-2 text-sm text-white/70 sm:text-base">
              {forgetPassword
                ? "Enter your email and we will send a reset link."
                : "Use a strong password and confirm it below."}
            </p>
          </div>

          <form
            className="mt-8 space-y-5 sm:mt-10"
            onSubmit={submitFormHandler}
          >
            {forgetPassword ? (
              <div className="space-y-4">
                <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-left text-sm text-amber-100">
                  You will receive a reset email.
                  <span className="mt-1 block text-amber-200/90">
                    Check your spam or junk folder if it does not arrive.
                  </span>
                </div>

                <label className="block text-left text-sm font-medium text-white/85">
                  Email address
                  <div className={`${inputShell} mt-2`}>
                    <input
                      name="mail"
                      type="email"
                      required
                      ref={mailRef}
                      placeholder="Enter your email"
                      className={inputField}
                    />
                  </div>
                </label>
              </div>
            ) : (
              <div className="space-y-4">
                <label className="block text-left text-sm font-medium text-white/85">
                  Current password
                  <div className={`${inputShell} mt-2`}>
                    <input
                      name="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      required
                      ref={currentPasswordRef}
                      placeholder="Enter current password"
                      className={inputField}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword((prev) => !prev)}
                      className="shrink-0 rounded-lg p-1 text-slate-600 transition hover:text-slate-900"
                      aria-label={
                        showCurrentPassword
                          ? "Hide current password"
                          : "Show current password"
                      }
                    >
                      {showCurrentPassword ? (
                        <FiEyeOff size={18} />
                      ) : (
                        <FiEye size={18} />
                      )}
                    </button>
                  </div>
                </label>

                <label className="block text-left text-sm font-medium text-white/85">
                  New password
                  <div className={`${inputShell} mt-2`}>
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Enter new password"
                      className={inputField}
                      onChange={(e) => setEnteredPassword(e.target.value)}
                      onFocus={() => setCheckPassword(true)}
                      onBlur={() => setCheckPassword(false)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="shrink-0 rounded-lg p-1 text-slate-600 transition hover:text-slate-900"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <FiEyeOff size={18} />
                      ) : (
                        <FiEye size={18} />
                      )}
                    </button>
                  </div>
                </label>

                {checkPassword && (
                  <div className="rounded-2xl bg-white/5 px-3 py-3 sm:px-4">
                    <PasswordValidation password={enteredPassword} />
                  </div>
                )}

                <label className="block text-left text-sm font-medium text-white/85">
                  Confirm password
                  <div className={`${inputShell} mt-2`}>
                    <input
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      ref={confirmPasswordRef}
                      placeholder="Confirm password"
                      className={inputField}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="shrink-0 rounded-lg p-1 text-slate-600 transition hover:text-slate-900"
                      aria-label={
                        showConfirmPassword
                          ? "Hide confirm password"
                          : "Show confirm password"
                      }
                    >
                      {showConfirmPassword ? (
                        <FiEyeOff size={18} />
                      ) : (
                        <FiEye size={18} />
                      )}
                    </button>
                  </div>
                </label>
              </div>
            )}

            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-center">
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-xl bg-blue-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-900/20 transition hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 focus:ring-offset-slate-800 sm:w-auto"
              >
                Submit
              </button>
              <button
                type="button"
                className="inline-flex w-full items-center justify-center rounded-xl bg-red-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-red-900/20 transition hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2 focus:ring-offset-slate-800 sm:w-auto"
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      </main>
    </>
  );
};

export default ChangePassword;
