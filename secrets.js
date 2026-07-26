export const apiPath =
  import.meta.env.VITE_API_PATH ||
  (import.meta.env.DEV
    ? "http://localhost:3000/api"
    : "https://api.foodversedelivery.com/api");

export const apiAuthToken =
  import.meta.env.VITE_API_TOKEN || "YOUR_API_TOKEN_HERE";

export const IMAGE_PATH =
  import.meta.env.VITE_IMAGE_PATH ||
  apiPath.replace(/\/api\/?$/, "");
