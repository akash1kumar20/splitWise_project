import React from "react";

const CreateExpense = () => {
  const userMail = localStorage.getItem("user-mail");

  return (
    <form>
      <div className="flex gap-3 flex-col">
        <div className="flex gap-6">
          <input
            type="date"
            required
            className="text-white bg-slate-400 py-2 px-3 rounded-xl focus:outline-none"
          />
          <input
            type="text"
            placeholder="Amount Spend On"
            required
            className="py-2 ps-3 rounded-xl bg-slate-400 text-white focus:outline-none placeholder:text-black w-[50%]"
          />
        </div>
        <div className="grid md:grid-cols-3 grid-cols-2 gap-3 pe-4">
          <input
            type="text"
            required
            placeholder="Amount in ₹"
            className="py-2 ps-3 rounded-xl bg-slate-400 text-white focus:outline-none placeholder:text-black"
          />

          <select className="py-2 px-3 rounded-xl bg-slate-400 text-white">
            <option hidden>Spend By:</option>
            <option>{userMail}</option>
            {/* //admin name need to come here */}
          </select>
          <button className="text-white bg-gradient-to-br from-purple-500 via-blue-600 to-blue-900 px-10 py-2 rounded-2xl md:w-fit">
            Add
          </button>
        </div>
      </div>
    </form>
  );
};

export default CreateExpense;
