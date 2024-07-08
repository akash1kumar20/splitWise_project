import { useEffect, useState } from "react";
import Navbar from "../ExtraComponents/Navbar";
import Footer from "../ExtraComponents/Footer";
import Profile from "../ExtraComponents/Profile";
import { useNavigate } from "react-router-dom";
import SheetDetailsCard from "../Card/SheetDetailsCard";
import CreateExpense from "../Expenses/CreateExpense";
import { useSelector } from "react-redux";
import Users from "../ExtraComponents/Users";
import useFetchDataHook from "../customHooks/useFetchDataHook";
import OtherOptions from "../ExtraComponents/OtherOptions";
import DisplayExpense from "../Expenses/DisplayExpense";
import SheetDetails from "./SheetDetails";

const SingleSheet = () => {
  const navigate = useNavigate();
  const [addUser, setAddUser] = useState(false);
  const token = useSelector((state) => state.expenseSheet.token);
  const inviteCode = useSelector((state) => state.expenseSheet.inviteCode);

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, []);

  const [openProfile, setOpenProfile] = useState(false);
  const [showCylinder, setShowCylinder] = useState(false);

  const profileChangeHandler = () => {
    setOpenProfile((openProfile) => !openProfile);
  };

  const showCylinderHandler = () => {
    setShowCylinder((showCylinder) => !showCylinder);
  };

  let urlKey = "usersList" + inviteCode;
  const [comingData] = useFetchDataHook(
    `https://splitwiseapp-82dbf-default-rtdb.firebaseio.com/${urlKey}.json`
  );

  return (
    <div>
      <Navbar openProfile={profileChangeHandler} />
      {openProfile && <Profile />}
      {showCylinder && <OtherOptions />}
      <div className="md:flex  ">
        <SheetDetailsCard>
          <SheetDetails />
        </SheetDetailsCard>
        <SheetDetailsCard>
          {addUser && <Users />}
          {comingData.length > 0 && addUser && (
            <p
              className="text-blue-400 font-bold cursor-pointer mt-2 w-fit "
              onClick={() => setAddUser(false)}
            >
              Add Expense
            </p>
          )}
          {!addUser && comingData.length > 0 && (
            <CreateExpense users={comingData} />
          )}
          {comingData.length === 0 && (
            <p className="mt-2 ">
              Please atleast add one user name to continue
            </p>
          )}
          {!addUser && (
            <p
              className="text-blue-400 font-bold cursor-pointer mt-2 w-fit"
              onClick={() => setAddUser(true)}
            >
              Add users
            </p>
          )}
        </SheetDetailsCard>
      </div>
      <DisplayExpense />
      <Footer opeCylinder={showCylinderHandler} isOpen={showCylinder} />
    </div>
  );
};

export default SingleSheet;
