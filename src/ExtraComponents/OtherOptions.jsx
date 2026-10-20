import { ImCalculator } from "react-icons/im";
import Cylinder from "./Cylinder";
import { FaFilter } from "react-icons/fa";
import { TiUserDelete } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import useAdminStatus from "../customHooks/useAdminStatus";
import { useSelector } from "react-redux";
import { FaMoneyBill1Wave, FaSheetPlastic } from "react-icons/fa6";

// ✅ Labels always visible — removed onMouseOver/onMouseOut.
// Hover-based labels were invisible on touch screens (mobile/PWA).
// Every user can now see what each icon does without hovering.

const LeftBar = () => {
  const navigate  = useNavigate();
  const sheetCode = useSelector((state) => state.expenseSheet.sheetCode);
  const { isAdmin } = useAdminStatus();
  const isPersonal = localStorage.getItem("sp_sheetType") === "personal";

  return (
    <div className="bg-transparent text-white w-10 fixed top-0 z-50 right-0 h-full flex flex-col gap-3 items-center">
      <div className="relative top-[28%]">
        <Cylinder>

          <p className="flex flex-col items-center cursor-pointer gap-0.5">
            <a href="https://whimsical-melba-dcb48d.netlify.app/" target="blank">
              <ImCalculator className="text-2xl" />
            </a>
            <span className="text-[10px] leading-tight text-center">Calculator</span>
          </p>

          <p
            className="flex flex-col items-center cursor-pointer gap-0.5"
            onClick={() => navigate(`/home/sheets/${sheetCode}/generateBill`)}
          >
            <FaMoneyBill1Wave className="text-2xl" />
            <span className="text-[10px] leading-tight text-center">Generate Bill</span>
          </p>

          <p
            className="flex flex-col items-center cursor-pointer gap-0.5"
            onClick={() => navigate(`/home/sheets/${sheetCode}/previousBill`)}
          >
            <FaSheetPlastic className="text-2xl" />
            <span className="text-[10px] leading-tight text-center">Previous Bill</span>
          </p>

          <p
            className="flex flex-col items-center cursor-pointer gap-0.5"
            onClick={() => navigate(`/home/sheets/${sheetCode}/filterData`)}
          >
            <FaFilter className="text-2xl" />
            <span className="text-[10px] leading-tight text-center">Filter Data</span>
          </p>

          {/* Delete User — admin only, split sheets only */}
          {isAdmin && !isPersonal && (
            <p
              className="flex flex-col items-center cursor-pointer gap-0.5"
              onClick={() => navigate(`/home/sheets/${sheetCode}/deleteUser`)}
            >
              <TiUserDelete className="text-2xl" />
              <span className="text-[10px] leading-tight text-center">Del. User</span>
            </p>
          )}

        </Cylinder>
      </div>
    </div>
  );
};

export default LeftBar;
