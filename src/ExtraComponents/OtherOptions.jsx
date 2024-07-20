import { ImCalculator } from "react-icons/im";
import Cylinder from "./Cylinder";
import { FaFilter } from "react-icons/fa";
import { TiUserDelete } from "react-icons/ti";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaMoneyBill1Wave, FaSheetPlastic } from "react-icons/fa6";

const LeftBar = () => {
  const [showCalculator, setShowCalculator] = useState(false);
  const [showBill, setShowBill] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [showDeleteUser, setShowDeleteUser] = useState(false);
  const [showPreviousBill, setShowPreviousBill] = useState(false);
  const navigate = useNavigate();
  const sheetCode = useSelector((state) => state.expenseSheet.sheetCode);

  return (
    <div className="bg-transparent text-white w-10 fixed top-0 z-50 right-0 h-full flex flex-col gap-3 items-center ">
      <div className="relative top-[28%]">
        <Cylinder>
          <p
            className="flex flex-col items-center cursor-pointer"
            onMouseOver={() => setShowCalculator(true)}
            onMouseOut={() => setShowCalculator(false)}
          >
            <a
              href="https://whimsical-melba-dcb48d.netlify.app/"
              target="blank"
            >
              <ImCalculator className="text-2xl" />
            </a>
            {showCalculator && <span className="text-sm">Calculator</span>}
          </p>

          <p
            className="flex flex-col items-center cursor-pointer"
            onMouseOver={() => setShowBill(true)}
            onMouseOut={() => setShowBill(false)}
          >
            <FaMoneyBill1Wave
              className="text-2xl"
              onClick={() => navigate(`/home/sheets/${sheetCode}/generateBill`)}
            />
            {showBill && <span className="text-sm">Generate Bill</span>}
          </p>
          <p
            className="flex flex-col items-center cursor-pointer"
            onMouseOver={() => setShowPreviousBill(true)}
            onMouseOut={() => setShowPreviousBill(false)}
          >
            <FaSheetPlastic
              className="text-2xl"
              onClick={() => navigate(`/home/sheets/${sheetCode}/previousBill`)}
            />
            {showPreviousBill && <span className="text-sm">Previous Bill</span>}
          </p>
          <p
            className="flex flex-col items-center cursor-pointer"
            onMouseOver={() => setShowFilter(true)}
            onMouseOut={() => setShowFilter(false)}
          >
            <FaFilter
              className="text-2xl"
              onClick={() => navigate(`/home/sheets/${sheetCode}/filterData`)}
            />
            {showFilter && <span className="text-sm">Filter Data</span>}
          </p>
          <p
            className="flex flex-col items-center cursor-pointer"
            onMouseOver={() => setShowDeleteUser(true)}
            onMouseOut={() => setShowDeleteUser(false)}
          >
            <TiUserDelete
              className="text-2xl"
              onClick={() => navigate(`/home/sheets/${sheetCode}/deleteUser`)}
            />
            {showDeleteUser && <span className="text-sm">Delete User</span>}
          </p>
        </Cylinder>
      </div>
    </div>
  );
};

export default LeftBar;
