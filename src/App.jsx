import AddAccount from "./accountAccess/AddAccount";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Loading from "./ExtraComponents/Loading";
import useSessionPersist from "./customHooks/useSessionPersist";

const App = () => {
  const navigate = useNavigate();
  const token = useSelector((state) => state.expenseSheet.token);
  const { isRestoring } = useSessionPersist();

  useEffect(() => {
    if (!isRestoring && token) {
      navigate("/home", { replace: true });
    }
  }, [isRestoring, navigate, token]);

  if (isRestoring) {
    return (
      <div className="bg-slate-900 text-white min-h-[100vh] min-w-[100vw]">
        <Loading />
      </div>
    );
  }

  return (
    <div className="bg-slate-900 text-white min-h-[100vh] min-w-[100vw] py-10">
      <AddAccount />
    </div>
  );
};

export default App;
