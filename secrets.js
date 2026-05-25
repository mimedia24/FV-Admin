const mode = "DEV"; // DEV or PRO

export const apiPath =
  mode === "DEV"
    ? "http://localhost:3000/api"
    : "https://api.foodversedelivery.com/api";

export const apiAuthToken =
  import.meta.env.VITE_API_TOKEN || "YOUR_API_TOKEN_HERE";

export const IMAGE_PATH =
  mode === "DEV"
    ? "http://localhost:3000"
    : "https://api.foodversedelivery.com"; 