import axios from "axios";
import { apiAuthToken, apiPath } from "../../../secrets";

const axiosInstance = axios.create({
  baseURL: apiPath,
  headers: {
    "Content-Type": "application/json",
    // This is your static secret key from secrets.js
    "x-auth-token": apiAuthToken,
  },
});

// Request Interceptor: Injects the user's token before the request leaves
axiosInstance.interceptors.request.use(
  (config) => {
    // 1. Grab the token from localStorage
    const token = localStorage.getItem("AccessToken");

    // 2. If it exists, add it to the Authorization header
    if (token) {
      // Standard Bearer format: "Authorization: Bearer <token>"
      config.headers.AccessToken = `${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Global Error Handler
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the server returns 401 (Unauthorized), the token is likely expired or invalid
    if (error.response && error.response.status === 401) {
      console.warn("Session expired. Logging out...");
      localStorage.removeItem("AccessToken");

      // Redirect to login page
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;