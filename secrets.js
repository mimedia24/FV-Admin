

const mode = 'PRO'  // or PRO // DEV

export const apiPath = mode === 'DEV' ? 'http://localhost:3000/api' : import.meta.env.VITE_API_PATH;
export const apiAuthToken = import.meta.env.VITE_API_TOKEN;
export const IMAGE_PATH = mode === 'DEV' ? 'http://localhost:3000' : "https://api.foodversedelivery.com/"
