import axios from "axios";

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

// ── RESPONSE: catch 401 (expired/invalid token) ───────────────────────────
// When Firebase rejects a token, clear localStorage and redirect to login
// instead of silently failing with 401 errors everywhere.
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      error.config?.url?.includes("firebaseio.com")
    ) {
      localStorage.clear();
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);
