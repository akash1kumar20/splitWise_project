import { Outlet } from "react-router-dom";
import ReactDOM from "react-dom";

const Sheets = () => {
  return ReactDOM.createPortal(<Outlet />, document.querySelector("#sheets"));
};

export default Sheets;
