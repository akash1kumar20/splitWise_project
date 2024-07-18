import { useEffect, useState } from "react";
import Navbar from "../ExtraComponents/Navbar";
import Footer from "../ExtraComponents/Footer";
import Profile from "../ExtraComponents/Profile";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import OtherOptions from "../ExtraComponents/OtherOptions";
import DisplayExpense from "../Expenses/DisplayExpense";
import SheetDetails from "./SheetDetails";
import CreateExpenseParent from "./CreateExpenseParent";

const SingleSheet = () => {
  const navigate = useNavigate();
  const token = useSelector((state) => state.expenseSheet.token);

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

  return (
    <div>
      <Navbar openProfile={profileChangeHandler} />
      {openProfile && <Profile />}
      {showCylinder && <OtherOptions />}
      <div className="md:flex  ">
        <SheetDetails />
        <CreateExpenseParent />
      </div>
      <DisplayExpense />
      <Footer openCylinder={showCylinderHandler} isOpen={showCylinder} />
    </div>
  );
};

export default SingleSheet;
