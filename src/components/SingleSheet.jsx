import React, { useEffect, useState } from "react";
import Navbar from "../ExtraComponents.jsx/Navbar";
import Footer from "../ExtraComponents.jsx/Footer";
import Profile from "../ExtraComponents.jsx/Profile";
import { useNavigate } from "react-router-dom";

const SingleSheet = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("split-token");
    if (!token) {
      navigate("/");
    }
  }, []);
  const [openProfile, setOpenProfile] = useState(false);
  const profileChangeHandler = () => {
    setOpenProfile((openProfile) => !openProfile);
  };
  return (
    <div>
      <Navbar openProfile={profileChangeHandler} />
      {openProfile && <Profile />}
      <h1>Hi</h1>
      <Footer />
    </div>
  );
};

export default SingleSheet;
