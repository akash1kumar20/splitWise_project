import { useSelector } from "react-redux";

// Reads isAdmin with localStorage fallback so admin UI shows correctly
// even before the useSessionPersist restore effect re-dispatches to Redux.
const useAdminStatus = () => {
  const sheetAdminRedux = useSelector((s) => s.expenseSheet.sheetAdmin);
  const userMailRedux   = useSelector((s) => s.expenseSheet.userMail);

  const sheetAdmin = sheetAdminRedux || localStorage.getItem("sp_sheetAdmin") || "";
  const userMail   = userMailRedux   || localStorage.getItem("sp_userMail")   || "";

  // Guard: both must be non-empty and equal
  const isAdmin = Boolean(userMail) && Boolean(sheetAdmin) && userMail === sheetAdmin;

  return { isAdmin, sheetAdmin, userMail };
};

export default useAdminStatus;
