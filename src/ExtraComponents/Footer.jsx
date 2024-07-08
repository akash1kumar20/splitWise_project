import { useState } from "react";
import { FaRegCopyright } from "react-icons/fa";
import { RiArrowLeftWideFill } from "react-icons/ri";

const Footer = ({ opeCylinder, isOpen }) => {
  const [showText, setShowText] = useState(false);
  const openCylinderHandler = () => {
    opeCylinder();
  };

  return (
    <div className="fixed bottom-0 w-full">
      <div className="flex flex-col items-end justify-center pe-4 text-sm">
        {showText && !isOpen && (
          <span className="text-white font-bold mb-2">Explore More</span>
        )}
        <p
          className="px-4 py-[10px] text-white bg-black rounded-full text-xl font-semibold cursor-pointer"
          onClick={openCylinderHandler}
          onMouseOver={() => setShowText(true)}
          onMouseOut={() => setShowText(false)}
        >
          {isOpen && <RiArrowLeftWideFill className="text-3xl -rotate-90" />}
          {!isOpen && <RiArrowLeftWideFill className="text-3xl rotate-90" />}
        </p>
      </div>
      <div className="flex items-center justify-center bg-black bg-opacity-20 text-slate-500 text-md ">
        <FaRegCopyright />
        <h4 className="ms-1">Akash Kumar</h4>
      </div>
    </div>
  );
};

export default Footer;
