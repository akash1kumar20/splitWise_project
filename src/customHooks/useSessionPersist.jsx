import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { expenseSheetActions } from "../../store/expenseSheetSlice";
import { refreshIdToken } from "../config/tokenUtils";

const K = {
  token:         "sp_token",
  tokenTime:     "sp_token_time",
  userMail:      "sp_userMail",
  convertedMail: "sp_convertedMail",
  sheetAdmin:    "sp_sheetAdmin",
  sheetCode:     "sp_sheetCode",
  inviteCode:    "sp_inviteCode",
};

// Firebase idTokens expire after 1 hour.
// With a refresh token we can silently get a new one — no re-login needed.
const TOKEN_MAX_AGE_MS = 55 * 60 * 1000;

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
      localStorage.setItem("split-token", token); // axiosSetup reads this key
      localStorage.setItem(K.tokenTime, String(Date.now()));
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
    const restore = async () => {
      const s = {
        token:         localStorage.getItem(K.token),
        userMail:      localStorage.getItem(K.userMail),
        convertedMail: localStorage.getItem(K.convertedMail),
        sheetAdmin:    localStorage.getItem(K.sheetAdmin),
        sheetCode:     localStorage.getItem(K.sheetCode),
        inviteCode:    localStorage.getItem(K.inviteCode),
      };

      if (!token && s.token) {
        const savedAt = Number(localStorage.getItem(K.tokenTime) || 0);
        const age = Date.now() - savedAt;

        if (age < TOKEN_MAX_AGE_MS) {
          // Token is still fresh — restore it directly
          dispatch(expenseSheetActions.setToken(s.token));
        } else {
          // ✅ AUTO-LOGIN: Token expired — try to silently refresh it.
          // If successful, user stays logged in without seeing the login page.
          // Only redirects to login if refresh token is also missing/invalid.
          const newToken = await refreshIdToken();
          if (newToken) {
            dispatch(expenseSheetActions.setToken(newToken));
          } else {
            // Refresh failed — clear everything and force re-login
            Object.values(K).forEach((k) => localStorage.removeItem(k));
            localStorage.removeItem("split-token");
            localStorage.removeItem("sp_refresh_token");
          }
        }
      }

      if (!userMail      && s.userMail)      dispatch(expenseSheetActions.setUserMail(s.userMail));
      if (!convertedMail && s.convertedMail) dispatch(expenseSheetActions.setChangedMail(s.convertedMail));
      if (!sheetAdmin    && s.sheetAdmin)    dispatch(expenseSheetActions.setSheetAdmin(s.sheetAdmin));
      if ((!sheetCode || !inviteCode) && s.sheetCode && s.inviteCode) {
        dispatch(expenseSheetActions.setCodes({
          sheetCode: s.sheetCode,
          inviteCode: s.inviteCode,
        }));
      }
    };

    restore();
  }, []);
};

export default useSessionPersist;
