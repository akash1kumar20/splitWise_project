import { Outlet } from "react-router-dom";
import SheetPresents from "./SheetPresents";

const Home = () => {
  return (
    <>
      <SheetPresents />
      <Outlet />
    </>
  );
};

export default Home;
