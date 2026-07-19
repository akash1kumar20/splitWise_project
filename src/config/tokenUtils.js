// src/config/tokenUtils.js
// Shared Firebase token refresh utility.
// Used by both useSessionPersist (on page load) and axiosSetup (on 401).

const REFRESH_URL = "https://securetoken.googleapis.com/v1/token";

export const refreshIdToken = async () => {
  const refreshToken = localStorage.getItem("sp_refresh_token");
  if (!refreshToken) return null;

  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;

  try {
    const res = await fetch(`${REFRESH_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
    });

    const data = await res.json();

    if (data.id_token) {
      // Update both token keys so all parts of the app see the new token
      localStorage.setItem("split-token", data.id_token);
      localStorage.setItem("sp_token",    data.id_token);
      localStorage.setItem("sp_token_time", String(Date.now()));

      // Firebase may rotate the refresh token — always save the latest one
      if (data.refresh_token) {
        localStorage.setItem("sp_refresh_token", data.refresh_token);
      }

      return data.id_token;
    }

    return null;
  } catch {
    return null;
  }
};
