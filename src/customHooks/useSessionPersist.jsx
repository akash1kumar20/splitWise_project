import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { expenseSheetActions } from "../../store/expenseSheetSlice";

const K = {
  token:         "sp_token",
  userMail:      "sp_userMail",
  convertedMail: "sp_convertedMail",
  sheetAdmin:    "sp_sheetAdmin",
  sheetCode:     "sp_sheetCode",
  inviteCode:    "sp_inviteCode",
};

// Uses localStorage (not sessionStorage) so data survives browser restarts.
const useSessionPersist = () => {
  const dispatch = useDispatch();

  const token         = useSelector((s) => s.expenseSheet.token);
  const userMail      = useSelector((s) => s.expenseSheet.userMail);
  const convertedMail = useSelector((s) => s.expenseSheet.convertedMail);
  const sheetAdmin    = useSelector((s) => s.expenseSheet.sheetAdmin);
  const sheetCode     = useSelector((s) => s.expenseSheet.sheetCode);
  const inviteCode    = useSelector((s) => s.expenseSheet.inviteCode);

  // ── SAVE to localStorage whenever Redux values change ──────────────
  useEffect(() => { if (token)         localStorage.setItem(K.token,         token);         }, [token]);
  useEffect(() => { if (userMail)      localStorage.setItem(K.userMail,      userMail);      }, [userMail]);
  useEffect(() => { if (convertedMail) localStorage.setItem(K.convertedMail, convertedMail); }, [convertedMail]);
  useEffect(() => { if (sheetAdmin)    localStorage.setItem(K.sheetAdmin,    sheetAdmin);    }, [sheetAdmin]);
  useEffect(() => {
    if (sheetCode && inviteCode) {
      localStorage.setItem(K.sheetCode,  sheetCode);
      localStorage.setItem(K.inviteCode, inviteCode);
    }
  }, [sheetCode, inviteCode]);

  // ── RESTORE from localStorage on mount (page refresh / new tab) ────
  useEffect(() => {
    const s = {
      token:         localStorage.getItem(K.token),
      userMail:      localStorage.getItem(K.userMail),
      convertedMail: localStorage.getItem(K.convertedMail),
      sheetAdmin:    localStorage.getItem(K.sheetAdmin),
      sheetCode:     localStorage.getItem(K.sheetCode),
      inviteCode:    localStorage.getItem(K.inviteCode),
    };

    if (!token         && s.token)         dispatch(expenseSheetActions.setToken(s.token));
    if (!userMail      && s.userMail)       dispatch(expenseSheetActions.setUserMail(s.userMail));
    if (!convertedMail && s.convertedMail)  dispatch(expenseSheetActions.setChangedMail(s.convertedMail));
    if (!sheetAdmin    && s.sheetAdmin)     dispatch(expenseSheetActions.setSheetAdmin(s.sheetAdmin));
    if ((!sheetCode || !inviteCode) && s.sheetCode && s.inviteCode) {
      dispatch(expenseSheetActions.setCodes({ sheetCode: s.sheetCode, inviteCode: s.inviteCode }));
    }
  }, []);
};

export default useSessionPersist;
