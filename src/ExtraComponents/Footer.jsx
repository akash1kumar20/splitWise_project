import { useEffect, useState } from "react";
import { FaRegCopyright } from "react-icons/fa";
import { RiArrowLeftWideFill } from "react-icons/ri";
import { SiFontbase } from "react-icons/si";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const Footer = ({ openCylinder, isOpen }) => {
  const param = JSON.stringify(useParams());
  const [viewExploreBtn, setViewExploreBtn] = useState(false);
  const sheetCode = useSelector((state) => state.expenseSheet.sheetCode);
  useEffect(() => {
    let booleanValue = param.includes(sheetCode);
    if (!booleanValue) {
      setViewExploreBtn(false);
    } else {
      setViewExploreBtn(true);
    }
  }, [param]);
  const [showText, setShowText] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [showTopBtn, setShowTopBtn] = useState(false);
  const handleScroll = () => {
    const scrollHeight = window.scrollY;
    const targetHeight = 280;

    if (scrollHeight > targetHeight) {
      setShowTopBtn(true);
    } else {
      setShowTopBtn(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const openCylinderHandler = () => {
    openCylinder();
  };

  return (
    <div className="fixed bottom-0 w-full">
      {sheetCode && (
        <div className="flex justify-between px-2 items-center">
          {!showTopBtn && <div className="px-4 py-[10px] invisible"></div>}
          {showTopBtn && (
            <>
              <div
                className="hidden px-4 py-[10px] text-white bg-black rounded-full md:flex gap-2 font-semibold cursor-pointer"
                onMouseOver={() => setShowTop(true)}
                onMouseOut={() => setShowTop(false)}
              >
                <a href="#top">
                  <SiFontbase className="text-[26px]" />
                </a>
                {showTop && <span className="text-white font-bold  ">Top</span>}
              </div>
              <div className="md:hidden px-4 py-[10px] text-white bg-black rounded-full flex gap-1 flex-col font-semibold cursor-pointer">
                <a href="#top">
                  <SiFontbase className="text-[26px]" />
                </a>
                <span className="text-white font-bold  text-xs">Top</span>
              </div>
            </>
          )}
          {viewExploreBtn && (
            <div
              className="px-4 py-[10px] md:flex hidden gap-2 text-white bg-black rounded-full font-semibold cursor-pointer "
              onMouseOver={() => setShowText(true)}
              onMouseOut={() => setShowText(false)}
              onClick={openCylinderHandler}
            >
              {showText && !isOpen && (
                <span className="text-white font-bold  ">Explore More</span>
              )}
              <p>
                {isOpen && (
                  <RiArrowLeftWideFill className="text-[26px] -rotate-90" />
                )}
                {!isOpen && (
                  <RiArrowLeftWideFill className="text-[26px] rotate-90" />
                )}
              </p>
            </div>
          )}
          {viewExploreBtn && (
            <div
              className="px-4 py-[10px] flex flex-col justify-center items-center md:hidden gap-1 text-white bg-black rounded-full font-semibold cursor-pointer "
              onClick={openCylinderHandler}
            >
              <p>
                {isOpen && (
                  <RiArrowLeftWideFill className="text-[26px] -rotate-90" />
                )}
                {!isOpen && (
                  <RiArrowLeftWideFill className="text-[26px] rotate-90" />
                )}
              </p>
              {!isOpen && (
                <span className="text-white font-bold text-xs">Explore</span>
              )}
            </div>
          )}
        </div>
      )}
      <div className="flex items-center justify-center bg-black bg-opacity-20 text-slate-500 text-md ">
        <FaRegCopyright />
        <h4 className="ms-1">Akash Kumar</h4>
      </div>
    </div>
  );
};

export default Footer;
