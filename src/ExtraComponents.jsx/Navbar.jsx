import axios from "axios";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { IoIosAddCircle } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const Navbar = ({ openProfile }) => {
  const [sheetData, setSheetData] = useState([]);
  const navigate = useNavigate();
  const userMail = localStorage.getItem("user-mail");
  const userabbreviation = userMail.substring(0, 2).toUpperCase();

  useEffect(() => {
    const userMail = localStorage.getItem("user-mail");
    let changeEmail;
    if (userMail === null) {
      changeEmail = 0;
    } else {
      changeEmail = userMail.replace("@", "").replace(".", "");
    }
    const fetchData = async () => {
      try {
        let res = await axios.get(
          `https://splitwiseapp-82dbf-default-rtdb.firebaseio.com/${changeEmail}/sheets.json`
        );
        const sheetArray = [];
        for (let key in res.data) {
          sheetArray.push({ ...res.data[key], id: key });
        }
        setSheetData(sheetArray);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  });

  const openProfileHandler = () => {
    openProfile();
  };

  return (
    <div className="bg-slate-700 text-white h-16 flex justify-between md:px-10 px-2 items-center">
      <select className="bg-black px-4 py-3 rounded-3xl " name="sheet">
        <option defaultValue hidden>
          Your Sheet
        </option>
        {sheetData.map((sheet) => (
          <option value={sheet.sheetName} name="sheet" key={sheet.id}>
            {sheet.sheetName}
          </option>
        ))}
      </select>
      <div
        onClick={() => navigate("/home/sheets/findSheet")}
        className="flex items-center gap-x-2 bg-black px-4 py-3 rounded-3xl cursor-pointer"
      >
        <FaSearch /> <span>Sheet</span>
      </div>
      <div
        onClick={() => navigate("/home/sheets/addSheet")}
        className="flex items-center gap-x-2 bg-black px-4 py-3 rounded-3xl cursor-pointer"
      >
        <IoIosAddCircle /> <span>Sheet</span>
      </div>
      <div>
        <p
          className="px-4 py-3 bg-black rounded-full text-xl font-semibold cursor-pointer"
          onClick={openProfileHandler}
        >
          {userabbreviation}
        </p>
      </div>
    </div>
  );
};

export default Navbar;
