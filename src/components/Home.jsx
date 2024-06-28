import { Outlet, useNavigate } from "react-router-dom";
import SheetPresents from "./SheetPresents";
import { useEffect } from "react";

const Home = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("split-token");
    if (!token) {
      navigate("/");
    }
  }, []);
  return (
    <>
      <SheetPresents />
      <Outlet />
    </>
  );
};

export default Home;
