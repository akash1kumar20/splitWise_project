import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

const AddAccount = () => {
  const [isLogIn, setIsLogIn] = useState(true);
  const [viewPassword, setViewPassword] = useState(false);
  const [viewConfirmPassword, setViewConfirmPassword] = useState(false);
  return (
    <div className="mx-auto md:w-[50%] border-2 shadow-2xl drop-shadow-2xl text-center py-16">
      <h1 className="text-3xl font-semibold">Please Login to continue</h1>
      <form>
        <div className="flex flex-col static w-[80%] mx-auto mt-6">
          <label className="text-black text-lg font-semibold relative top-2 ml-[7px] px-[3px] bg-[#e8e8e8] w-fit">
            Email
          </label>
          <input
            type="mail"
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
              type={viewPassword ? "type" : "password"}
              required
              placeholder="Write here..."
              className="w-auto  bg-slate-400 rounded-xl focus:outline-none text-black ps-3 py-2 placeholder:text-black"
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
          {isLogIn && (
            <span className=" text-sm my-2 cursor-pointer">
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
                type={viewConfirmPassword ? "type" : "password"}
                required
                placeholder="Write here..."
                className="w-auto  bg-slate-400 rounded-xl focus:outline-none text-black ps-3 py-2 placeholder:text-black"
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

        <button className="bg-blue-400 px-6 py-2 rounded-lg my-2 text-slate-900 drop-shadow-2xl shadow-2xl hover:bg-blue-800 hover:text-white">
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
  );
};

export default AddAccount;
