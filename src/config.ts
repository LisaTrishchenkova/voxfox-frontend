const getEnvVar = (name: string, required: boolean = false): string => {
  const value = import.meta.env[name];

  if (!value && required) {
    const errorMsg = `❌ Required environment variable ${name} is not set!`;
    console.error(
      `%c${errorMsg}`,
      "color: red; font-weight: bold; font-size: 14px",
    );
    console.error(
      `%c💡 Create .env.local with: ${name}=your_value`,
      "color: yellow",
    );

    if (import.meta.env.DEV) {
      throw new Error(errorMsg);
    }
  } else if (!value) {
    console.warn(
      `%c⚠️ Optional env var ${name} is not set, using default`,
      "color: orange",
    );
  }

  return value || "";
};

export const API_URL = getEnvVar("VITE_API_URL", true);
export const APP_VERSION = getEnvVar("VITE_APP_VERSION") || "unknown";
export const COMMIT_HASH = getEnvVar("VITE_COMMIT_HASH") || "unknown";
export const BUILD_DATE = getEnvVar("VITE_BUILD_DATE") || "unknown";
