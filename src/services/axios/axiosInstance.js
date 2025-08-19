import axios from "axios";
import { apiAuthToken, apiPath } from "../../../secrets";

const axiosInstance = axios.create({
  baseURL: apiPath,
  headers: {
    "x-auth-token": apiAuthToken,
  },
});

export default axiosInstance;
