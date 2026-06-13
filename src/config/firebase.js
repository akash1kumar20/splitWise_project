export const FIREBASE_API_KEY = import.meta.env.VITE_FIREBASE_API_KEY;
export const FIREBASE_DB_URL = import.meta.env.VITE_FIREBASE_DB_URL;

// Auth endpoints
export const SIGNIN_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`;
export const SIGNUP_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_API_KEY}`;
export const RESET_PASSWORD_URL = `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${FIREBASE_API_KEY}`;
export const UPDATE_PASSWORD_URL = `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${FIREBASE_API_KEY}`;

// Database helper — builds a full DB path
export const dbURL = (path) => `${FIREBASE_DB_URL}/${path}.json`;
