import { Outlet, useNavigate } from "react-router-dom";
import ReactDOM from "react-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const Sheets = () => {
  const navigate = useNavigate();
  const token = useSelector((state) => state.expenseSheet.token);

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, []);
  return ReactDOM.createPortal(<Outlet />, document.querySelector("#sheets"));
};

export default Sheets;
