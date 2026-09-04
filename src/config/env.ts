const DEFAULT_API_URL = "/api/backend";
export const LOCAL_DEVELOPMENT = "local_develop";

export const env = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL,
  get apiUrl() {
    return process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL;
  },
  nodeEnv: process.env.NODE_ENV,
} as const;
