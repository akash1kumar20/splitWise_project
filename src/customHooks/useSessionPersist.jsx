import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { expenseSheetActions } from "../../store/expenseSheetSlice";

const K = {
  token:         "sp_token",
  tokenTime:     "sp_token_time",   // ✅ NEW: tracks when the token was saved
  userMail:      "sp_userMail",
  convertedMail: "sp_convertedMail",
  sheetAdmin:    "sp_sheetAdmin",
  sheetCode:     "sp_sheetCode",
  inviteCode:    "sp_inviteCode",
};

// Firebase idTokens expire after 1 hour.
// We treat anything older than 55 minutes as expired to give a 5-min buffer.
const TOKEN_MAX_AGE_MS = 55 * 60 * 1000;

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
  useEffect(() => {
    if (token) {
      localStorage.setItem(K.token,     token);
      localStorage.setItem(K.tokenTime, Date.now()); // ✅ stamp when token was stored
    }
  }, [token]);
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

    // ✅ FIX: Only restore token if it's less than 55 minutes old.
    // Firebase tokens expire after 1 hour — restoring an expired token
    // causes silent 401 failures where the user appears logged in but
    // every API write fails. Expired tokens are cleared immediately.
    if (!token && s.token) {
      const savedAt = Number(localStorage.getItem(K.tokenTime) || 0);
      const age = Date.now() - savedAt;
      if (age < TOKEN_MAX_AGE_MS) {
        dispatch(expenseSheetActions.setToken(s.token));
      } else {
        // Token too old — clear everything and let the user log in again
        Object.values(K).forEach((k) => localStorage.removeItem(k));
      }
    }
    if (!userMail      && s.userMail)       dispatch(expenseSheetActions.setUserMail(s.userMail));
    if (!convertedMail && s.convertedMail)  dispatch(expenseSheetActions.setChangedMail(s.convertedMail));
    if (!sheetAdmin    && s.sheetAdmin)     dispatch(expenseSheetActions.setSheetAdmin(s.sheetAdmin));
    if ((!sheetCode || !inviteCode) && s.sheetCode && s.inviteCode) {
      dispatch(expenseSheetActions.setCodes({ sheetCode: s.sheetCode, inviteCode: s.inviteCode }));
    }
  }, []);
};

export default useSessionPersist;
