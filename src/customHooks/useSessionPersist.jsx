/* eslint-disable react-refresh/only-export-components */
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { expenseSheetActions } from "../../store/expenseSheetSlice";
import { refreshIdToken } from "../config/tokenUtils";

const K = {
  token: "sp_token",
  tokenTime: "sp_token_time",
  userMail: "sp_userMail",
  convertedMail: "sp_convertedMail",
  sheetAdmin: "sp_sheetAdmin",
  sheetCode: "sp_sheetCode",
  inviteCode: "sp_inviteCode",
};

const TOKEN_MAX_AGE_MS = 55 * 60 * 1000;

const hasStoredSession = () =>
  Boolean(
    localStorage.getItem(K.token) ||
      localStorage.getItem("split-token") ||
      localStorage.getItem("sp_refresh_token"),
  );

const useSessionPersist = () => {
  const dispatch = useDispatch();
  const [isRestoring, setIsRestoring] = useState(hasStoredSession);

  const token = useSelector((s) => s.expenseSheet.token);
  const userMail = useSelector((s) => s.expenseSheet.userMail);
  const convertedMail = useSelector((s) => s.expenseSheet.convertedMail);
  const sheetAdmin = useSelector((s) => s.expenseSheet.sheetAdmin);
  const sheetCode = useSelector((s) => s.expenseSheet.sheetCode);
  const inviteCode = useSelector((s) => s.expenseSheet.inviteCode);

  useEffect(() => {
    if (token) {
      localStorage.setItem(K.token, token);
      localStorage.setItem("split-token", token);
      localStorage.setItem(K.tokenTime, String(Date.now()));
    }
  }, [token]);

  useEffect(() => {
    if (userMail) localStorage.setItem(K.userMail, userMail);
  }, [userMail]);

  useEffect(() => {
    if (convertedMail) localStorage.setItem(K.convertedMail, convertedMail);
  }, [convertedMail]);

  useEffect(() => {
    if (sheetAdmin) localStorage.setItem(K.sheetAdmin, sheetAdmin);
  }, [sheetAdmin]);

  useEffect(() => {
    if (sheetCode && inviteCode) {
      localStorage.setItem(K.sheetCode, sheetCode);
      localStorage.setItem(K.inviteCode, inviteCode);
    }
  }, [sheetCode, inviteCode]);

  useEffect(() => {
    const restore = async () => {
      setIsRestoring(hasStoredSession());

      const saved = {
        token: localStorage.getItem(K.token) || localStorage.getItem("split-token"),
        userMail: localStorage.getItem(K.userMail),
        convertedMail: localStorage.getItem(K.convertedMail),
        sheetAdmin: localStorage.getItem(K.sheetAdmin),
        sheetCode: localStorage.getItem(K.sheetCode),
        inviteCode: localStorage.getItem(K.inviteCode),
      };

      if (!token && (saved.token || localStorage.getItem("sp_refresh_token"))) {
        const savedAt = Number(localStorage.getItem(K.tokenTime) || 0);
        const age = Date.now() - savedAt;

        if (saved.token && savedAt && age < TOKEN_MAX_AGE_MS) {
          dispatch(expenseSheetActions.setToken(saved.token));
        } else {
          const newToken = await refreshIdToken();
          if (newToken) {
            dispatch(expenseSheetActions.setToken(newToken));
          } else {
            Object.values(K).forEach((key) => localStorage.removeItem(key));
            localStorage.removeItem("split-token");
            localStorage.removeItem("sp_refresh_token");
          }
        }
      }

      if (!userMail && saved.userMail) {
        dispatch(expenseSheetActions.setUserMail(saved.userMail));
      }
      if (!convertedMail && saved.convertedMail) {
        dispatch(expenseSheetActions.setChangedMail(saved.convertedMail));
      }
      if (!sheetAdmin && saved.sheetAdmin) {
        dispatch(expenseSheetActions.setSheetAdmin(saved.sheetAdmin));
      }
      if ((!sheetCode || !inviteCode) && saved.sheetCode && saved.inviteCode) {
        dispatch(
          expenseSheetActions.setCodes({
            sheetCode: saved.sheetCode,
            inviteCode: saved.inviteCode,
          }),
        );
      }

      setIsRestoring(false);
    };

    restore().catch(() => setIsRestoring(false));
    // The restore flow should run once on app start. The save effects above
    // keep later Redux changes synced into localStorage.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { isRestoring };
};

export default useSessionPersist;
