import React from "react";
import CardComponent from "../Card/CardComponent";

const CreateSheet = () => {
  return (
    <CardComponent>
      <h2 className="text-xl font-semibold">Create Your Own Sheet</h2>
      <form className="mt-4">
        <input
          type="text"
          required
          placeholder="Give a name to your sheet"
          className="py-2 ps-2 bg-slate-500 text-white focus:outline-none placeholder:text-white w-full rounded-md border border-slate-700"
        />
        <button className="px-6 py-3 bg-blue-800 text-white rounded-xl mt-3">
          Generate
        </button>
      </form>
    </CardComponent>
  );
};

export default CreateSheet;
