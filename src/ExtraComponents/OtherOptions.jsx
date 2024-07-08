import { ImCalculator } from "react-icons/im";
import Cylinder from "./Cylinder";
import { RiBillLine } from "react-icons/ri";
import { FaFilter } from "react-icons/fa";
import { TiUserDelete } from "react-icons/ti";
import { useState } from "react";

const LeftBar = () => {
  const [showCalculator, setShowCalculator] = useState(false);
  const [showBill, setShowBill] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [showDeleteUser, setShowDeleteUser] = useState(false);

  return (
    <div className="bg-transparent text-white w-10 fixed top-0 z-50 right-0 h-full flex flex-col gap-3 items-center ">
      <div className="relative top-[28%]">
        <Cylinder>
          <p
            className="flex flex-col items-center cursor-pointer"
            onMouseOver={() => setShowCalculator(true)}
            onMouseOut={() => setShowCalculator(false)}
          >
            <ImCalculator className="text-2xl" />
            {showCalculator && <span className="text-sm">Calculator</span>}
          </p>
          <p
            className="flex flex-col items-center cursor-pointer"
            onMouseOver={() => setShowBill(true)}
            onMouseOut={() => setShowBill(false)}
          >
            <RiBillLine className="text-2xl" />
            {showBill && <span className="text-sm">Generate Bill</span>}
          </p>
          <p
            className="flex flex-col items-center cursor-pointer"
            onMouseOver={() => setShowFilter(true)}
            onMouseOut={() => setShowFilter(false)}
          >
            <FaFilter className="text-2xl" />
            {showFilter && <span className="text-sm">Filter Data</span>}
          </p>
          <p
            className="flex flex-col items-center cursor-pointer"
            onMouseOver={() => setShowDeleteUser(true)}
            onMouseOut={() => setShowDeleteUser(false)}
          >
            <TiUserDelete className="text-2xl" />
            {showDeleteUser && <span className="text-sm">Delete User</span>}
          </p>
        </Cylinder>
      </div>
    </div>
  );
};

export default LeftBar;
