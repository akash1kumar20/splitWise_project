import React from "react";
import { useNavigate } from "react-router-dom";

const CardComponent = (props) => {
  const navigate = useNavigate();
  return (
    <div className="fixed top-[0%] bg-black bg-opacity-70 w-[100vw] h-[100vh] px-14 z-10">
      <p
        className="text-white text-3xl flex items-center justify-center pt-10 p-2 rounded-lg cursor-pointer font-bold "
        onClick={() => navigate(-1)}
      >
        X
      </p>
      <div className=" bg-[rgba(0,0,0,0.7)] md:px-32 px-3 py-6 rounded-lg drop-shadow-2xl shadow-2xl shadow-black text-white border-2 border-[rgb(230, 57, 70)] text-center z-50 mt-24 w-fit mx-auto">
        {props.children}
      </div>
    </div>
  );
};

export default CardComponent;
