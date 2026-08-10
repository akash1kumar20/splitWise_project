import { FaSearch } from "react-icons/fa";
import { IoIosAddCircle } from "react-icons/io";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Navbar = ({ openProfile }) => {
  const navigate = useNavigate();
  const userMail =
    useSelector((state) => state.expenseSheet.userMail) || "User";
  const userabbreviation = userMail.substring(0, 2).toUpperCase();

  return (
    <div className="bg-slate-700 text-white h-16 flex justify-between md:px-10 px-2 items-center">
      <div
        className="bg-black px-4 py-3 rounded-3xl cursor-pointer"
        onClick={() => navigate("/home")}
      >
        Home
      </div>
      <div
        id="tutorial-find-sheet"
        onClick={() => navigate("/home/sheets/findSheet")}
        className="flex items-center gap-x-2 bg-black px-4 py-3 rounded-3xl cursor-pointer"
      >
        <FaSearch /> <span>Sheet</span>
      </div>
      <div
        id="tutorial-add-sheet"
        onClick={() => navigate("/home/sheets/addSheet")}
        className="flex items-center gap-x-2 bg-black px-4 py-3 rounded-3xl cursor-pointer"
      >
        <IoIosAddCircle /> <span>Sheet</span>
      </div>
      <div>
        <p
          className="px-4 py-3 bg-black rounded-full text-xl font-semibold cursor-pointer"
          onClick={() => openProfile()}
        >
          {userabbreviation}
        </p>
      </div>
    </div>
  );
};

export default Navbar;
