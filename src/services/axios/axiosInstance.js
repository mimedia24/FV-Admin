import axios from "axios";
import { apiAuthToken, apiPath } from "../../../secrets";

const axiosInstance = axios.create({
  baseURL: apiPath,
  headers: {
    "x-auth-token": apiAuthToken,
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("AccessToken");

    if (token) {
      config.headers.AccessToken = token;
    }

    // FormData হলে Content-Type manually set করব না.
    // Browser নিজে boundary সহ multipart/form-data set করবে.
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    } else {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

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