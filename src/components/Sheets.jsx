import { Outlet, useNavigate } from "react-router-dom";
import ReactDOM from "react-dom";
import { useEffect } from "react";

const Sheets = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("split-token");
    if (!token) {
      navigate("/");
    }
  }, []);
  return ReactDOM.createPortal(<Outlet />, document.querySelector("#sheets"));
};

export default Sheets;
