export const GOOGLE_MAPS_API_KEY = String(
  import.meta.env.VITE_MAP_API_KEY ||
    import.meta.env.VITE_GOOGLE_MAPS_API_KEY ||
    "",
).trim();

export const GOOGLE_MAP_ID = String(
  import.meta.env.VITE_MAP_ID || "",
).trim();

export const hasGoogleMapsConfig = Boolean(GOOGLE_MAPS_API_KEY);
