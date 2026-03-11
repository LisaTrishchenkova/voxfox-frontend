export const API_URL = import.meta.env.VITE_API_URL || "unknown";
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || "unknown";
export const COMMIT_HASH = import.meta.env.VITE_COMMIT_HASH || "unknown";
export const BUILD_DATE = import.meta.env.VITE_BUILD_DATE || "unknown";

console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);
console.log("VITE_APP_VERSION:", import.meta.env.VITE_APP_VERSION);
console.log("VITE_COMMIT_HASH:", import.meta.env.VITE_COMMIT_HASH);
console.log("VITE_BUILD_DATE:", import.meta.env.VITE_BUILD_DATE);
console.log("All env vars:", import.meta.env);
