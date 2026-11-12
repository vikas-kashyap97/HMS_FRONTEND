import axios from "axios";

// Configure per environment with VITE_API_URL (see .env.example).
export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://hms-backend-deployment-xv3e.onrender.com/api/v1";

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Safe error message extraction: `error.response` is undefined on network
// errors, timeouts and CORS failures, which used to crash the catch blocks.
export const getErrorMessage = (error) =>
  error?.response?.data?.message ||
  error?.message ||
  "Something went wrong. Please try again.";
