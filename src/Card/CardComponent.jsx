import React from "react";
import { useNavigate } from "react-router-dom";

const CardComponent = ({ children }) => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm overflow-y-auto">
      {/* Close Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 right-4 text-white text-3xl font-bold hover:text-red-400 transition-colors"
      >
        ×
      </button>

      {/* Modal Container */}
      <div className="min-h-screen flex items-center justify-center p-4">
        <div
          className="
            w-full
            max-w-md
            bg-[rgba(0,0,0,0.92)]
            border
            border-gray-700
            rounded-2xl
            shadow-2xl
            text-white
            px-4
            py-5
            sm:px-6
            sm:py-6
          "
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default CardComponent;
