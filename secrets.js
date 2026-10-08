const productionApiPath = "https://api.foodversedelivery.com/api";
const configuredApiPath = String(import.meta.env.VITE_API_PATH || "").trim();
const unsafeProductionApiPath =
  import.meta.env.PROD &&
  /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?(\/|$)/i.test(configuredApiPath);

export const apiPath =
  configuredApiPath && !unsafeProductionApiPath
    ? configuredApiPath
    : import.meta.env.DEV
      ? "http://localhost:3000/api"
      : productionApiPath;

export const apiAuthToken =
  import.meta.env.VITE_API_TOKEN || "YOUR_API_TOKEN_HERE";

export const IMAGE_PATH =
  import.meta.env.VITE_IMAGE_PATH ||
  apiPath.replace(/\/api\/?$/, "");
