import axios from "axios";
import { refreshIdToken } from "./tokenUtils";

// ── REQUEST: append ?auth=TOKEN to every Firebase DB request ──────────────
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("split-token");
  const isFirebaseDB = config.url && config.url.includes("firebaseio.com");
  if (token && isFirebaseDB) {
    const separator = config.url.includes("?") ? "&" : "?";
    config.url = `${config.url}${separator}auth=${token}`;
  }
  return config;
});

// ── Helper: clear localStorage but preserve tutorial completion keys ───────
// ✅ Fix 4: localStorage.clear() was wiping tutorial keys, so tutorial
// would restart after every logout. Now tutorial keys survive session resets.
const clearSessionStorage = () => {
  const PRESERVE = ["sp_home_tutorial_done", "sp_sheet_tutorial_done"];
  const saved = {};
  PRESERVE.forEach((k) => {
    const v = localStorage.getItem(k);
    if (v) saved[k] = v;
  });
  localStorage.clear();
  Object.entries(saved).forEach(([k, v]) => localStorage.setItem(k, v));
};

// ── RESPONSE: catch 401 — try token refresh before redirecting ────────────
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (
      error.response?.status === 401 &&
      error.config?.url?.includes("firebaseio.com") &&
      !error.config._retried
    ) {
      error.config._retried = true;
      const newToken = await refreshIdToken();

      if (newToken) {
        const retryUrl = error.config.url.replace(
          /auth=[^&]+/,
          `auth=${newToken}`
        );
        return axios({ ...error.config, url: retryUrl });
      }

      // Refresh failed — clear session but keep tutorial progress
      clearSessionStorage();
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);
