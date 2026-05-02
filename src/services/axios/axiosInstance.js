import axios from "axios";
import { apiAuthToken, apiPath } from "../../../secrets";

const resolvedBaseURL =
  typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:3000/api"
    : apiPath;

const axiosInstance = axios.create({
  baseURL: resolvedBaseURL,
  headers: {
    "Content-Type": "application/json",
    "x-auth-token": apiAuthToken,
  },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("AccessToken");

    if (token) {
      config.headers.AccessToken = token;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Session expired. Logging out...");
      localStorage.removeItem("AccessToken");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;