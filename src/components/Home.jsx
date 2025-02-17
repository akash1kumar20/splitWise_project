import { Outlet, useNavigate } from "react-router-dom";
import SheetPresents from "./SheetPresents";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Profile from "../ExtraComponents/Profile";
import { FaUser } from "react-icons/fa";

const Home = () => {
  const navigate = useNavigate();
  const token = useSelector((state) => state.expenseSheet.token);
  const [openProfile, setOpenProfile] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, []);

  function profileHandler() {
    setOpenProfile((openProfile) => !openProfile);
  }
  return (
    <>
      <div className="bg-slate-700 h-12 flex justify-end items-center pe-4 ">
        <button
          className="bg-gradient-to-br from-red-800 via-red-500 to-red-800 text-white py-2 px-6 rounded-xl my-1 font-semibold"
          onClick={profileHandler}
        >
          <FaUser />
        </button>
      </div>
      {openProfile && <Profile />}
      <SheetPresents />
      <Outlet />
    </>
  );
};

export default Home;
