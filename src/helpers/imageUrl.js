const placeholderSvg = encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="640" height="400" viewBox="0 0 640 400">
    <rect width="640" height="400" fill="#f1f5f9"/>
    <circle cx="320" cy="165" r="52" fill="#cbd5e1"/>
    <path d="M130 330l125-125 78 78 63-63 114 110H130z" fill="#94a3b8"/>
    <text x="320" y="370" text-anchor="middle" font-family="Arial,sans-serif" font-size="24" fill="#64748b">Image unavailable</text>
  </svg>
`);

export const IMAGE_PLACEHOLDER = `data:image/svg+xml;charset=UTF-8,${placeholderSvg}`;

export const resolveImageUrl = (value) => {
  const image = String(value || "").trim();

  if (!image) return IMAGE_PLACEHOLDER;
  if (/^(https?:|data:|blob:)/i.test(image)) return image;

  const base = String(import.meta.env.VITE_IMAGE_PATH || "").replace(/\/+$/, "");
  if (!base) return `/${image.replace(/^\/+/, "")}`;

  return `${base}/${image.replace(/^\/+/, "")}`;
};

export const useImageFallback = (event) => {
  event.currentTarget.onerror = null;
  event.currentTarget.src = IMAGE_PLACEHOLDER;
};
