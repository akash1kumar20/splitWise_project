import { Outlet, useNavigate } from "react-router-dom";
import SheetPresents from "./SheetPresents";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Profile from "../ExtraComponents/Profile";
import { FaUser } from "react-icons/fa";
import useSessionPersist from "../customHooks/useSessionPersist";
import HomeTutorial from "../ExtraComponents/HomeTutorial";
import Loading from "../ExtraComponents/Loading";

const Home = () => {
  const navigate = useNavigate();
  const tokenRedux = useSelector((state) => state.expenseSheet.token);
  const token = tokenRedux || localStorage.getItem("sp_token");
  const [openProfile, setOpenProfile] = useState(false);

  const { isRestoring } = useSessionPersist();

  useEffect(() => {
    if (!isRestoring && !token) navigate("/");
  }, [isRestoring, navigate, token]);

  if (isRestoring) {
    return <Loading />;
  }

  return (
    <>
      <HomeTutorial />
      <div className="bg-slate-700 h-12 flex justify-end items-center pe-4">
        <button
          className="bg-gradient-to-br from-red-800 via-red-500 to-red-800 text-white py-2 px-6 rounded-xl my-1 font-semibold"
          onClick={() => setOpenProfile((p) => !p)}
        >
          <FaUser />
        </button>
      </div>
      {openProfile && <Profile />}
      {/* id for tutorial to highlight sheets grid */}
      <div id="tutorial-sheets-grid">
        <SheetPresents />
      </div>
      <Outlet />
    </>
  );
};

export default Home;
