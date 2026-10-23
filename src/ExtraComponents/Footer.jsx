import { useEffect, useState } from "react";
import { FaRegCopyright } from "react-icons/fa";
import { RiArrowLeftWideFill } from "react-icons/ri";
import { SiFontbase } from "react-icons/si";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

// ✅ Labels always visible — removed onMouseOver/onMouseOut.
// Hover labels were invisible on mobile/PWA (touch screens don't fire hover).
// Labels now always show so new users know what each button does.

const Footer = ({ openCylinder, isOpen }) => {
  const param = JSON.stringify(useParams());
  const [viewExploreBtn, setViewExploreBtn] = useState(false);
  const sheetCode = useSelector((state) => state.expenseSheet.sheetCode);

  useEffect(() => {
    setViewExploreBtn(param.includes(sheetCode));
  }, [param]);

  const [showTopBtn, setShowTopBtn] = useState(false);

  const handleScroll = () => {
    setShowTopBtn(window.scrollY > 280);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed bottom-0 w-full">
      {sheetCode && (
        <div className="flex justify-between px-2 items-center">
          {/* Scroll to Top button */}
          {!showTopBtn && <div className="px-4 py-[10px] invisible" />}
          {showTopBtn && (
            <a
              href="#top"
              className="px-4 py-[10px] text-white bg-black rounded-full flex gap-2 items-center font-semibold cursor-pointer active:bg-gray-800 transition-colors"
            >
              <SiFontbase className="text-[26px]" />
              <span className="text-white font-bold text-xs">Top</span>
            </a>
          )}

          {/* Explore More / Cylinder toggle button */}
          {viewExploreBtn && (
            <div
              className="px-4 py-[10px] flex gap-2 items-center text-white bg-black rounded-full font-semibold cursor-pointer active:bg-gray-800 transition-colors"
              onClick={openCylinder}
            >
              <span className="text-white font-bold text-xs">
                {isOpen ? "Close" : "More"}
              </span>
              <RiArrowLeftWideFill
                className={`text-[26px] transition-transform ${isOpen ? "-rotate-90" : "rotate-90"}`}
              />
            </div>
          )}
        </div>
      )}
      <div className="flex items-center justify-center bg-black bg-opacity-20 text-slate-500 text-md">
        <FaRegCopyright />
        <h4 className="ms-1">Akash Kumar</h4>
      </div>
    </div>
  );
};

export default Footer;
