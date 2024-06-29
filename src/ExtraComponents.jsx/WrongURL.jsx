import React, { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { useNavigate } from "react-router-dom";

const WrongURL = () => {
  const [counter, setCounter] = useState(5);
  const navigate = useNavigate();
  setInterval(() => {
    setCounter(counter - 1);
  }, 1000);
  useEffect(() => {
    setTimeout(() => {
      navigate("/home");
    }, 5000);
  }, []);

  return (
    <div className="bg-red-600 flex flex-col items-center gap-y-6 h-[100vh] w-[100vw] text-white pt-24">
      <h3 className="text-2xl">Restricted Area!</h3>
      <RxCross2 className="text-3xl text-yellow-300 " />
      <p>
        Go to
        <span
          className="text-blue-900 cursor-pointer mx-2"
          onClick={() => navigate("/home")}
        >
          Home
        </span>
        now ,<span className="ms-2">Or Redirecting you in {counter}</span>
      </p>
    </div>
  );
};

export default WrongURL;
