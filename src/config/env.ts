const DEFAULT_API_URL = "/api/backend";

export const env = {
  get apiUrl() {
    return process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL;
  },
} as const;
