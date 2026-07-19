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

// ── RESPONSE: catch 401 — try token refresh before redirecting ────────────
// Instead of immediately logging out on 401, we first try to silently
// refresh the token. If refresh succeeds, retry the failed request.
// Only redirect to login if the refresh token is also expired/missing.
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (
      error.response?.status === 401 &&
      error.config?.url?.includes("firebaseio.com") &&
      !error.config._retried // prevent infinite retry loop
    ) {
      error.config._retried = true;
      const newToken = await refreshIdToken();

      if (newToken) {
        // Swap the old auth token in the URL and retry
        const retryUrl = error.config.url.replace(
          /auth=[^&]+/,
          `auth=${newToken}`
        );
        return axios({ ...error.config, url: retryUrl });
      }

      // Refresh also failed — session truly expired, force re-login
      localStorage.clear();
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);
